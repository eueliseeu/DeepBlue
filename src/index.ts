#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands";
import { readFileSync } from "fs";
import { join } from "path";

const packageJson = JSON.parse(
  readFileSync(join(__dirname, "../package.json"), "utf-8"),
);

const program = new Command();

program
  .name("deepblue")
  .description(
    "CLI moderna para automação de Docker - crie Dockerfiles em segundos",
  )
  .version(packageJson.version);

program
  .command("init")
  .description("Inicializar configuração Docker para seu projeto")
  .action(async () => {
    await initCommand();
  });

program.parse();
