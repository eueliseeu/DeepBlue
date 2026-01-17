#!/usr/bin/env node

import { Command } from "commander";
import { initCommand } from "./commands";

const program = new Command();

program
  .name("deepblue")
  .description(
    "CLI moderna para automação de Docker - crie Dockerfiles em segundos",
  )
  .version("1.0.0");

program
  .command("init")
  .description("Inicializar configuração Docker para seu projeto")
  .action(async () => {
    await initCommand();
  });

program.parse();
