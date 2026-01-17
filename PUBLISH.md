# 📦 Como Publicar no NPM e GitHub

## 📋 Pré-requisitos

- [x] Conta no GitHub
- [x] Conta no NPM (criar em https://www.npmjs.com/signup)
- [x] Git instalado
- [x] Node.js instalado

---

## 🚀 Parte 1: Publicar no GitHub

### 1. Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Nome do repositório: `DeepBlue`
3. Descrição: `CLI moderna para automação de Docker - crie Dockerfiles e docker-compose.yml em segundos`
4. Público
5. **NÃO** marque "Add README" (já temos)
6. Clique em "Create repository"

### 2. Configurar Git Local

```bash
# Dentro da pasta do projeto
cd /home/develiseu/Documentos/development/DeepBlue

# Inicializar git (se ainda não foi)
git init

# Adicionar todos os arquivos
git add .

# Fazer primeiro commit
git commit -m "feat: Initial commit - DeepBlue CLI with 7 languages and 4 databases"

# Renomear branch para main
git branch -M main

# Adicionar repositório remoto (SUBSTITUIR seu-usuario pelo seu username)
git remote add origin https://github.com/seu-usuario/DeepBlue.git

# Enviar para GitHub
git push -u origin main
```

### 3. Configurar GitHub (Opcional mas Recomendado)

No GitHub, adicione:
- **Tópicos (Topics)**: `docker`, `cli`, `typescript`, `automation`, `devops`, `dockerfile`, `docker-compose`
- **About**: "🌊 CLI moderna para automação de Docker com suporte a 7 linguagens e 4 bancos de dados"
- **Website**: URL do NPM após publicar: `https://www.npmjs.com/package/deepblue-cli`

---

## 📦 Parte 2: Publicar no NPM

### 1. Preparar o Projeto

```bash
# Certifique-se de estar na pasta do projeto
cd /home/develiseu/Documentos/development/DeepBlue

# Compilar o projeto
npm run build

# Testar localmente
npm link
deepblue init  # Testar se funciona
```

### 2. Configurar package.json

Edite o `package.json` e atualize:

```json
{
  "name": "deepblue-cli",
  "version": "1.0.0",
  "description": "CLI moderna para automação de Docker...",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/SEU-USUARIO/DeepBlue.git"
  },
  "author": "Seu Nome <seu.email@example.com>",
  "homepage": "https://github.com/SEU-USUARIO/DeepBlue#readme",
  "bugs": {
    "url": "https://github.com/SEU-USUARIO/DeepBlue/issues"
  }
}
```

**IMPORTANTE**: Substitua `SEU-USUARIO`, `Seu Nome` e `seu.email@example.com`

### 3. Login no NPM

```bash
# Fazer login (primeira vez)
npm login

# Vai pedir:
# Username: seu-usuario-npm
# Password: sua-senha
# Email: seu-email@example.com
```

### 4. Publicar no NPM

```bash
# Garantir que tudo está compilado
npm run build

# Publicar (acesso público)
npm publish --access public
```

### 5. Verificar Publicação

Acesse: https://www.npmjs.com/package/deepblue-cli

---

## ✅ Checklist Final

Antes de publicar, verifique:

- [ ] `npm run build` funciona sem erros
- [ ] `.gitignore` está configurado (não enviar node_modules, dist para git mas sim dist para npm)
- [ ] `package.json` tem todas as informações corretas
- [ ] README.md está completo e formatado
- [ ] LICENSE existe
- [ ] Testou localmente com `npm link`
- [ ] Código commitado no Git
- [ ] Repositório GitHub criado

---

## 🔄 Atualizações Futuras

Quando fizer mudanças:

```bash
# 1. Fazer as alterações no código

# 2. Compilar
npm run build

# 3. Atualizar versão (escolha um)
npm version patch  # 1.0.0 -> 1.0.1 (correções)
npm version minor  # 1.0.0 -> 1.1.0 (novas features)
npm version major  # 1.0.0 -> 2.0.0 (breaking changes)

# 4. Commit e push no GitHub
git push && git push --tags

# 5. Publicar nova versão no NPM
npm publish
```

---

## 📱 Pós-Publicação (LinkedIn)

### Template de Post para LinkedIn:

```
🚀 Novo Projeto Open Source: DeepBlue CLI 🌊

Acabei de lançar uma ferramenta que vai economizar MUITO tempo no setup de projetos Docker!

🎯 O que é?
CLI que gera Dockerfiles e docker-compose.yml automaticamente em segundos

✨ Features:
• 7 linguagens: Node.js, Python, Go, Java, PHP, Ruby, Rust
• 4 bancos de dados: PostgreSQL, MySQL, MongoDB, Redis
• Interface interativa e intuitiva
• Templates otimizados com melhores práticas 2026
• 100% TypeScript

⚡ Instalação:
npm install -g deepblue-cli

📦 GitHub: https://github.com/seu-usuario/DeepBlue
📚 NPM: https://www.npmjs.com/package/deepblue-cli

#Docker #DevOps #OpenSource #CLI #TypeScript #Automation #NodeJS #Python
```

### Incluir:
- Screenshot do CLI em ação
- GIF mostrando o fluxo completo
- Link para o repositório
- Link para o NPM

---

## 🎯 Comandos Resumidos

```bash
# GITHUB
git init
git add .
git commit -m "feat: Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/DeepBlue.git
git push -u origin main

# NPM
npm run build
npm login
npm publish --access public
```

---

## 📞 Ajuda

Se tiver problemas:

1. **NPM**: Verifique se o nome `deepblue-cli` está disponível em npmjs.com
2. **GitHub**: Certifique-se que tem permissão de push no repo
3. **Build**: Execute `npm run build` antes de publicar
4. **Teste**: Sempre teste com `npm link` antes de publicar

---

**Boa sorte com a publicação! 🚀**
