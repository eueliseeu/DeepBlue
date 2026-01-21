export type Technology =
  | "node"
  | "python"
  | "go"
  | "java"
  | "php"
  | "ruby"
  | "rust";

export type Database = "none" | "postgres" | "mysql" | "mongodb";

export interface TemplateConfig {
  technology: Technology;
  version: string;
  port: number;
  database?: Database;
}

export interface DockerTemplate {
  dockerfile: string;
  dockerCompose: string;
}

export interface TechnologyOption {
  value: Technology;
  label: string;
  versions: string[];
  defaultPort: number;
}

export interface DatabaseOption {
  value: Database;
  label: string;
  defaultPort?: number;
}

export interface GenerationResult {
  success: boolean;
  message: string;
  files?: string[];
}
