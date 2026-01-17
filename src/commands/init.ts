import { intro, select, text, spinner, outro, isCancel } from "@clack/prompts";
import chalk from "chalk";
import { Technology, Database, TemplateConfig } from "../types";
import { TECHNOLOGIES, DATABASES, MESSAGES } from "../templates/constants";
import { getTemplate } from "../templates";
import { writeDockerFiles, isValidPort, normalizePort } from "../utils";

export const initCommand = async (): Promise<void> => {
  console.clear();

  intro(chalk.bgBlue.bold(` ${MESSAGES.intro} `));

  const technology = (await select({
    message: MESSAGES.selectTech,
    options: TECHNOLOGIES.map((tech) => ({
      value: tech.value,
      label: tech.label,
    })),
  })) as Technology;

  if (isCancel(technology)) {
    outro(chalk.yellow(MESSAGES.cancel));
    process.exit(0);
  }

  const selectedTech = TECHNOLOGIES.find((t) => t.value === technology);
  if (!selectedTech) {
    outro(chalk.red(`${MESSAGES.error} Tecnologia não encontrada`));
    process.exit(1);
  }

  const version = (await select({
    message: MESSAGES.selectVersion,
    options: selectedTech.versions.map((v) => ({
      value: v,
      label: v,
    })),
  })) as string;

  if (isCancel(version)) {
    outro(chalk.yellow(MESSAGES.cancel));
    process.exit(0);
  }

  const database = (await select({
    message: MESSAGES.selectDatabase,
    options: DATABASES.map((db) => ({
      value: db.value,
      label: db.label,
    })),
  })) as Database;

  if (isCancel(database)) {
    outro(chalk.yellow(MESSAGES.cancel));
    process.exit(0);
  }

  const portInput = await text({
    message: MESSAGES.inputPort,
    placeholder: String(selectedTech.defaultPort),
    defaultValue: String(selectedTech.defaultPort),
    validate: (value) => {
      if (!isValidPort(value)) {
        return "Porta inválida. Use um número entre 1 e 65535";
      }
      return undefined;
    },
  });

  if (isCancel(portInput)) {
    outro(chalk.yellow(MESSAGES.cancel));
    process.exit(0);
  }

  const port = normalizePort(String(portInput));

  const s = spinner();
  s.start(MESSAGES.searching);

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const config: TemplateConfig = {
    technology: technology,
    version: version,
    port,
    database: database,
  };

  const template = getTemplate(config);

  s.message(MESSAGES.generating);

  const result = await writeDockerFiles(
    template.dockerfile,
    template.dockerCompose,
  );

  s.stop();

  if (result.success) {
    outro(
      chalk.green.bold(`\n${MESSAGES.success}\n`) +
        result.files?.map((f) => chalk.cyan(`  ✓ ${f}`)).join("\n"),
    );
  } else {
    outro(chalk.red(`${MESSAGES.error} ${result.message}`));
    process.exit(1);
  }
};
