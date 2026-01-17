import { TechnologyOption, DatabaseOption } from "../types";

export const TECHNOLOGIES: TechnologyOption[] = [
  {
    value: "node",
    label: "Node.js",
    versions: ["25", "24", "22", "20"],
    defaultPort: 3000,
  },
  {
    value: "python",
    label: "Python",
    versions: ["3.14", "3.13", "3.12", "3.11"],
    defaultPort: 8000,
  },
  {
    value: "go",
    label: "Go",
    versions: ["1.25", "1.24"],
    defaultPort: 8080,
  },
  {
    value: "java",
    label: "Java",
    versions: ["27", "26", "21", "17"],
    defaultPort: 8080,
  },
  {
    value: "php",
    label: "PHP",
    versions: ["8.4", "8.3", "8.2", "8.1"],
    defaultPort: 8000,
  },
  {
    value: "ruby",
    label: "Ruby",
    versions: ["4.0", "3.4", "3.3", "3.2"],
    defaultPort: 3000,
  },
  {
    value: "rust",
    label: "Rust",
    versions: ["1.92", "1.82", "1.81"],
    defaultPort: 8080,
  },
];

export const DATABASES: DatabaseOption[] = [
  {
    value: "none",
    label: "Nenhum banco de dados",
  },
  {
    value: "postgres",
    label: "PostgreSQL",
    defaultPort: 5432,
  },
  {
    value: "mysql",
    label: "MySQL",
    defaultPort: 3306,
  },
  {
    value: "mongodb",
    label: "MongoDB",
    defaultPort: 27017,
  },
  {
    value: "redis",
    label: "Redis",
    defaultPort: 6379,
  },
];

export const MESSAGES = {
  intro: "🌊 DeepBlue - Docker",
  selectTech: "Qual linguagem você deseja usar?",
  selectVersion: "Qual versão?",
  selectDatabase: "Deseja adicionar um banco de dados?",
  inputPort: "Qual porta expor?",
  searching: "Mergulhando e buscando templates...",
  generating: "Gerando arquivos Docker...",
  success: "Sucesso! Arquivos Docker criados:",
  error: "Erro ao gerar arquivos:",
  cancel: "Operação cancelada",
};
