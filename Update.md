# DeepBlue CLI - Nota de Atualização

#### Versão 1.2.2

Esta versão traz melhorias importantes para tornar seu ambiente de desenvolvimento mais robusto e eficiente, com foco na redução de erros manuais e na otimização do processo de construção dos containers.

## O que há de novo

### 1. Detecção Automática (Zero Config)

Agora a CLI é capaz de analisar seu projeto e identificar automaticamente a linguagem e as dependências usadas, sem que você precise configurar nada manualmente.

**Como funciona:** Ela busca arquivos como `package.json`, `requirements.txt`, `go.mod` e outros para sugerir a configuração mais adequada para o container.

**Vantagem:** Menos tempo configurando, mais tempo codando.

### 2. Gerenciamento Inteligente do .dockerignore

A partir de agora, todos os templates geram automaticamente um arquivo `.dockerignore`.

**Por que isso é importante:** Ele evita que pastas pesadas (como `node_modules`, `.git`, `dist`) e arquivos desnecessários sejam copiados para o Docker durante o build.

**Resultado:** Builds mais rápidos e consistentes, garantindo que as dependências sejam instaladas apenas dentro do container.

### 3. Dockerfiles Mais Resilientes

Reestruturamos os templates para que funcionem bem mesmo em projetos ainda no início.

**Melhoria:** Comandos como `npm install`, `pip install` ou `go mod tidy` agora só rodam se os arquivos de dependências realmente existirem.

**Benefício:** O build não quebra se você ainda não criou esses arquivos, dando mais flexibilidade durante o desenvolvimento.

### 4. Healthchecks Integrados no Docker Compose

A CLI agora adiciona verificações de saúde automáticas para bancos de dados (PostgreSQL, MySQL, MongoDB e Redis) no arquivo `docker-compose.yml`.

**Como ajuda:** Sua aplicação só sobe depois que o banco de dados estiver pronto para receber conexões.

**Evita aqueles erros** chatos de "Connection Refused" na inicialização.

## Outras Melhorias Técnicas

- **Builds em Etapas (Multi-Stage):** Para linguagens como Go, Rust e Java, geramos imagens menores e mais seguras para produção.
- **Segurança Reinforçada:** Containers Node.js e Python agora rodam com usuários não-root por padrão.
- **Compatibilidade com Bancos:** No PHP, a CLI instala automaticamente as extensões corretas do banco escolhido (MySQL ou PostgreSQL).

## Como atualizar

Para experimentar essas novidades, basta atualizar a CLI e rodar o comando `init` no seu projeto:

```bash
# Atualize a CLI e reinicie o ambiente do seu projeto
deepblue init
```

## Próximas Melhorias

Estamos sempre ouvindo nossa comunidade! Aqui estão algumas funcionalidades que já estão no nosso radar para as próximas versões:

- **Internacionalização (i18n):** Suporte a múltiplos idiomas, começando com Português e Inglês, para que você use a CLI no idioma de sua preferência.
- **Comandos de Utilitários Simplificados:**
  - `deepblue up`: Sobe todos os serviços do projeto (substitui `docker-compose up --build`).
  - `deepblue down`: Para e remove os containers do projeto.
  - `deepblue run`: Sobe o ambiente e já mostra os logs em tempo real.
  - `deepblue clean`: Remove containers, imagens e volumes órfãos relacionados ao projeto atual.

Se você tem mais sugestões, não deixe de compartilhar!

## Agradecimentos

Um agradecimento especial aos 167 desenvolvedores que interaram da CLI e alguns que enviaram feedback e sugeriram várias dessas melhorias. Vocês são essenciais para evoluirmos juntos!

Continue usando o DeepBlue e acompanhe as novidades. 🚀

---
