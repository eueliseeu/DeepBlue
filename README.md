
# DeepBlue CLI

<div align="center">

![Version](https://img.shields.io/npm/v/deepblue-cli.svg)
![License](https://img.shields.io/npm/l/deepblue-cli.svg)
![Downloads](https://img.shields.io/npm/dt/deepblue-cli.svg)

**CLI moderna para automação de ambientes Docker**

Gere Dockerfiles e `docker-compose.yml` prontos para produção em segundos, com suporte a múltiplas linguagens e bancos de dados.

[Instalação](#-instalação) • [Uso](#-uso) • [Funcionalidades](#-funcionalidades) • [Documentação](./docs)

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

* Interface interativa baseada em prompts
* Geração automática de Dockerfile e docker-compose.yml
* Suporte a múltiplas linguagens e versões
* Integração opcional com bancos de dados
* Templates otimizados para produção
* Configuração de portas e variáveis de ambiente
* Código 100% TypeScript
* Estrutura extensível para novas tecnologias

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
| Redis      | 7-alpine  | 6379  |
| Nenhum     | —         | —     |

---

## Uso

### Comando Principal

```bash
deepblue init
```

### Fluxo de Execução (Exemplo)

```bash
DeepBlue - Docker Automation

? Qual linguagem você deseja usar? Node.js
? Qual versão? 25
? Deseja adicionar um banco de dados? PostgreSQL
? Qual porta expor? 3000

Gerando arquivos Docker...

Arquivos criados com sucesso:
- Dockerfile
- docker-compose.yml
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

## Documentação

A documentação completa está disponível em [`/docs`](./docs), incluindo:

* Arquitetura do projeto
* Guia de contribuição
* Como adicionar novas linguagens
* Como criar novos templates
* Padrões e boas práticas

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
