import { DockerTemplate, TemplateConfig } from "../types";

const getHealthCheck = (database: string): string => {
  const checks: Record<string, string> = {
    postgres: `
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5`,
    mysql: `
    healthcheck:
      test: ["CMD", "mysqladmin" ,"ping", "-h", "localhost"]
      interval: 5s
      timeout: 5s
      retries: 5`,
    mongodb: `
    healthcheck:
      test: ["CMD", "mongosh", "--eval", "db.adminCommand('ping')"]
      interval: 5s
      timeout: 5s
      retries: 5`,
  };
  return checks[database] || "";
};

const generateDatabaseService = (database: string, port?: number): string => {
  const healthCheck = getHealthCheck(database);
  
  const services: Record<string, string> = {
    postgres: `
  db:
    image: postgres:17-alpine
    environment:
      - POSTGRES_PASSWORD=postgres
      - POSTGRES_USER=postgres
      - POSTGRES_DB=app_db
    ports:
      - "\${DB_PORT:-${port || 5432}}:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data${healthCheck}
    networks:
      - app-network
    restart: unless-stopped`,
    mysql: `
  db:
    image: mysql:9-oracle
    environment:
      - MYSQL_ROOT_PASSWORD=root
      - MYSQL_DATABASE=app_db
      - MYSQL_USER=user
      - MYSQL_PASSWORD=password
    ports:
      - "\${DB_PORT:-${port || 3306}}:3306"
    volumes:
      - mysql_data:/var/lib/mysql${healthCheck}
    networks:
      - app-network
    restart: unless-stopped`,
    mongodb: `
  db:
    image: mongo:8
    environment:
      - MONGO_INITDB_ROOT_USERNAME=root
      - MONGO_INITDB_ROOT_PASSWORD=root
      - MONGO_INITDB_DATABASE=app_db
    ports:
      - "\${DB_PORT:-${port || 27017}}:27017"
    volumes:
      - mongodb_data:/data/db${healthCheck}
    networks:
      - app-network
    restart: unless-stopped`,
  };
  return services[database] || "";
};

const generateDatabaseVolumes = (database: string): string => {
  const volumes: Record<string, string> = {
    postgres: `
  postgres_data:`,
    mysql: `
  mysql_data:`,
    mongodb: `
  mongodb_data:`,
  };
  return volumes[database] || "";
};

const getDependsOn = (hasDatabase: boolean): string => {
  return hasDatabase 
    ? `\n    depends_on:\n      db:\n        condition: service_healthy` 
    : "";
};

export const generateNodeTemplate = (
  config: TemplateConfig,
): DockerTemplate => {
  const dockerfile = `FROM node:${config.version}-alpine

WORKDIR /app

COPY package*.json ./

RUN if [ -f package.json ]; then npm install --omit=dev; fi

COPY . .

EXPOSE ${config.port}

USER node

CMD ["npm", "start"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:${config.port}"
    environment:
      - NODE_ENV=production
      - PORT=${config.port}${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}
    volumes:
      - .:/app
      - /app/node_modules${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};

export const generatePythonTemplate = (
  config: TemplateConfig,
): DockerTemplate => {
  const dockerfile = `FROM python:${config.version}-slim

WORKDIR /app

COPY requirements.txt* ./

RUN if [ -f requirements.txt ]; then \
    pip install --no-cache-dir -r requirements.txt; \
    fi
    
COPY . .

EXPOSE ${config.port}

CMD ["python", "app.py"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:${config.port}"
    environment:
      - PYTHONUNBUFFERED=1
      - PORT=${config.port}${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}
    volumes:
      - .:/app${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};

export const generateGoTemplate = (config: TemplateConfig): DockerTemplate => {
  const dockerfile = `FROM golang:${config.version}-alpine AS builder

WORKDIR /app

COPY go.* ./

RUN if [ -f go.mod ]; then go mod download; fi

COPY . .

RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

FROM alpine:latest

RUN apk --no-cache add ca-certificates

WORKDIR /root/

COPY --from=builder /app/main .

EXPOSE ${config.port}

CMD ["./main"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:${config.port}"
    environment:
      - PORT=${config.port}${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};

export const generateJavaTemplate = (
  config: TemplateConfig,
): DockerTemplate => {
  const dockerfile = `FROM eclipse-temurin:${config.version}-jdk-alpine AS builder

WORKDIR /app

COPY pom.xml ./
COPY src ./src

RUN apk add --no-cache maven
RUN mvn clean package -DskipTests

FROM eclipse-temurin:${config.version}-jre-alpine

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE ${config.port}

ENTRYPOINT ["java", "-jar", "app.jar"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:${config.port}"
    environment:
      - SPRING_PROFILES_ACTIVE=prod
      - SERVER_PORT=${config.port}${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};

export const generatePHPTemplate = (config: TemplateConfig): DockerTemplate => {
  const isPostgres = config.database === 'postgres';
  const installDbExtensions = isPostgres 
    ? 'apk add --no-cache libpq-dev && docker-php-ext-install pdo pdo_pgsql'
    : 'docker-php-ext-install pdo pdo_mysql';

  const dockerfile = `FROM php:${config.version}-fpm-alpine

WORKDIR /var/www/html

RUN ${installDbExtensions}

COPY . .

RUN chown -R www-data:www-data /var/www/html

EXPOSE ${config.port}

CMD ["php-fpm"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:9000"
    environment:
      - PHP_ENV=production${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}
    volumes:
      - .:/var/www/html${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    ports:
      - "${config.port}:80"
    volumes:
      - .:/var/www/html
      - ./nginx.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - app
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};

export const generateRubyTemplate = (
  config: TemplateConfig,
): DockerTemplate => {
  const dockerfile = `FROM ruby:${config.version}-alpine

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN apk add --no-cache build-base

RUN bundle config --global frozen 1 && \\
    bundle install --without development test

COPY . .

EXPOSE ${config.port}

CMD ["ruby", "app.rb"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:${config.port}"
    environment:
      - RACK_ENV=production
      - PORT=${config.port}${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}
    volumes:
      - .:/app${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};

export const generateRustTemplate = (
  config: TemplateConfig,
): DockerTemplate => {
  const dockerfile = `FROM rust:${config.version}-alpine AS builder

WORKDIR /app

RUN apk add --no-cache musl-dev

COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

COPY . .
RUN touch src/main.rs
RUN cargo build --release

FROM alpine:latest

RUN apk add --no-cache ca-certificates

WORKDIR /app

COPY --from=builder /app/target/release/* /usr/local/bin/

EXPOSE ${config.port}

# Assume que o binário tem o nome 'app', mas na prática depende do Cargo.toml
CMD ["/usr/local/bin/app"]`;

  const hasDatabase = !!(config.database && config.database !== "none");
  const dockerCompose = `services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "\${PORT:-${config.port}}:${config.port}"
    environment:
      - PORT=${config.port}${hasDatabase ? "\n      - DATABASE_URL=${DATABASE_URL}" : ""}${getDependsOn(hasDatabase)}
    restart: unless-stopped
    networks:
      - app-network
${hasDatabase ? generateDatabaseService(config.database!) : ""}
networks:
  app-network:
    driver: bridge
${
  hasDatabase
    ? `
volumes:${generateDatabaseVolumes(config.database!)}`
    : ""
}`;

  return { dockerfile, dockerCompose };
};