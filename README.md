
# DeepBlue CLI

<div align="center">

![Version](https://img.shields.io/npm/v/deepblue-cli.svg)
![License](https://img.shields.io/npm/l/deepblue-cli.svg)
![Downloads](https://img.shields.io/npm/dt/deepblue-cli.svg)

**CLI moderna para automação de ambientes Docker**

Gere Dockerfiles e `docker-compose.yml` prontos para produção em segundos, com suporte a múltiplas linguagens e bancos de dados.

[Documentação](https://eueliseeu.github.io/DeepBlue/)

</div>

---

## Visão Geral

O **DeepBlue CLI** é uma ferramenta de linha de comando focada em produtividade e padronização de ambientes Docker.  
Ele permite criar configurações completas de containers seguindo boas práticas modernas, sem necessidade de conhecimento profundo em Docker.

Ideal para:
- Projetos novos
- Padronização de ambientes
- Onboarding rápido de times
- Desenvolvimento local e produção

---

## Instalação

Requer **Node.js 18+**

```bash
npm install -g deepblue-cli
````

---

## Quick Start

Execute o comando abaixo e siga o assistente interativo:

```bash
deepblue init
```

Em poucos segundos, os arquivos Docker serão gerados no diretório do projeto.

---

## Funcionalidades

### 🚀 Recursos Principais

* **Interface interativa baseada em prompts** - Experiência guiada e intuitiva
* **Geração automática de arquivos Docker** - Dockerfile, docker-compose.yml e .dockerignore
* **Suporte a múltiplas linguagens e versões** - 7 linguagens de programação
* **Integração opcional com bancos de dados** - PostgreSQL, MySQL e MongoDB
* **Templates otimizados para produção** - Seguindo best practices Docker

### 🎯 Funcionalidades Avançadas

* **Detecção automática de projeto** - Identifica automaticamente a linguagem e versão do seu projeto
  - Node.js (via `package.json`)
  - Python (via `requirements.txt` ou `pyproject.toml`)
  - Go (via `go.mod`)
  - Java (via `pom.xml` ou `build.gradle`)
  - PHP (via `composer.json`)
  - Ruby (via `Gemfile`)
  - Rust (via `Cargo.toml`)

* **Detecção de versão instalada** - Detecta a versão da linguagem instalada no sistema
  - Sugere automaticamente a versão mais adequada
  - Permite usar versões personalizadas não listadas

* **Geração inteligente de .dockerignore** - Cria arquivos .dockerignore otimizados por linguagem
  - Padrões comuns (Git, IDEs, documentação)
  - Padrões específicos por tecnologia
  - Reduz o tamanho do build context

* **Configuração de portas personalizadas** - Validação e normalização automática
* **Código 100% TypeScript** - Type-safe e mantível
* **Estrutura extensível** - Fácil adicionar novas tecnologias

---

## Tecnologias Suportadas

### Linguagens

| Linguagem | Versões Disponíveis    | Porta Padrão |
| --------- | ---------------------- | ------------ |
| Node.js   | 25, 24, 22, 20         | 3000         |
| Python    | 3.14, 3.13, 3.12, 3.11 | 8000         |
| Go        | 1.25, 1.24             | 8080         |
| Java      | 27, 26, 21, 17         | 8080         |
| PHP       | 8.4, 8.3, 8.2, 8.1     | 8000         |
| Ruby      | 4.0, 3.4, 3.3, 3.2     | 3000         |
| Rust      | 1.92, 1.82, 1.81       | 8080         |

---

### Bancos de Dados

| Banco      | Imagem    | Porta |
| ---------- | --------- | ----- |
| PostgreSQL | 17-alpine | 5432  |
| MySQL      | 9-oracle  | 3306  |
| MongoDB    | 8         | 27017 |
| Nenhum     | —         | —     |

---

## Uso

### Comando Principal

```bash
deepblue init
```

### Fluxo de Execução (Exemplo)

#### Com Detecção Automática de Projeto

```bash
DeepBlue - Docker Automation

🔍 Detectando projeto...

✓ Node.js detectado
  Projeto: my-app
  Arquivo: package.json
  Versão: 20

? Deseja usar a configuração detectada? Sim
? Qual versão? 20 (instalada)
? Deseja adicionar um banco de dados? PostgreSQL
? Qual porta expor? 3000
? Gerar .dockerignore para Node.js? Sim

✓ Gerando arquivos Docker...

Arquivos criados com sucesso:
  ✓ Dockerfile
  ✓ docker-compose.yml
  ✓ .dockerignore
```

#### Sem Detecção (Configuração Manual)

```bash
DeepBlue - Docker Automation

? Qual linguagem você deseja usar? Node.js
? Qual versão? 25
? Deseja adicionar um banco de dados? PostgreSQL
? Qual porta expor? 3000
? Gerar .dockerignore para Node.js? Sim

Gerando arquivos Docker...

Arquivos criados com sucesso:
  ✓ Dockerfile
  ✓ docker-compose.yml
  ✓ .dockerignore
```

---

## Arquivos Gerados

### Dockerfile (Node.js)

```dockerfile
FROM node:25-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3000

USER node

CMD ["npm", "start"]
```

---

### docker-compose.yml (com PostgreSQL)

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      DATABASE_URL: postgresql://postgres:postgres@db:5432/app_db
    depends_on:
      - db

  db:
    image: postgres:17-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: app_db
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

---

### .dockerignore (Node.js)

```
# Generated by DeepBlue CLI
# Optimized .dockerignore for NODE

# Git
.git
.gitignore

# CI/CD
.github
.gitlab-ci.yml

# IDE
.vscode
.idea
*.swp

# Documentation
README.md
*.md
docs/

# Docker
Dockerfile
docker-compose.yml

# Node.js
node_modules/
npm-debug.log*

# Testing
coverage/
*.test.js
__tests__/

# Build
dist/
build/
.next/

# Environment
.env
.env.local
```

---

## Desenvolvimento Local

```bash
git clone https://github.com/eueliseeu/DeepBlue.git
cd DeepBlue

npm install
npm run build
npm link

deepblue init
```

### Scripts Disponíveis

```bash
npm run dev      # Modo desenvolvimento
npm run build    # Build TypeScript
npm run watch    # Build em modo watch
npm start        # Executa a versão compilada
```

---

## Contribuindo

Contribuições são bem-vindas.

1. Faça um fork do projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas alterações
4. Faça o push da branch
5. Abra um Pull Request

---

## Licença

Distribuído sob a licença MIT.
Consulte o arquivo [LICENSE](LICENSE) para mais informações.

---

## Autor

**Eliseu Pereira**

* GitHub: [https://github.com/eueliseeu](https://github.com/eueliseeu)
* LinkedIn: [https://linkedin.com/in/eueliseeu](https://linkedin.com/in/eueliseeu)

---

<div align="center">

**DeepBlue CLI**
Automação Docker simples, rápida e profissional.

</div>
