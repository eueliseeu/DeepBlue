import { TechnologyOption, DatabaseOption } from "../types";

export const TECHNOLOGIES: TechnologyOption[] = [
  {
    value: "node",
    label: "Node.js",
    versions: ["22 LTS", "20 LTS", "18 LTS"],
    defaultPort: 3000,
  },
  {
    value: "python",
    label: "Python",
    versions: ["3.12", "3.11", "3.10"],
    defaultPort: 8000,
  },
  {
    value: "go",
    label: "Go",
    versions: ["1.23", "1.22", "1.21"],
    defaultPort: 8080,
  },
  {
    value: "java",
    label: "Java",
    versions: ["21 LTS", "17 LTS", "11 LTS"],
    defaultPort: 8080,
  },
  {
    value: "php",
    label: "PHP",
    versions: ["8.3", "8.2", "8.1"],
    defaultPort: 8000,
  },
  {
    value: "ruby",
    label: "Ruby",
    versions: ["3.3", "3.2", "3.1"],
    defaultPort: 3000,
  },
  {
    value: "rust",
    label: "Rust",
    versions: ["1.83", "1.82", "1.81"],
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
];

export const MESSAGES = {
  intro: "🌊 DeepBlue - Docker",
  selectTech: "Qual linguagem você deseja usar?",
  selectVersion: "Qual versão?",
  selectDatabase: "Deseja adicionar um banco de dados?",
  inputPort: "Qual porta expor? (Enter para usar a padrão)",
  searching: "Mergulhando e buscando templates...",
  generating: "Gerando arquivos Docker...",
  success: "Sucesso! Arquivos Docker criados:",
  error: "Erro ao gerar arquivos:",
  cancel: "Operação cancelada",
};
