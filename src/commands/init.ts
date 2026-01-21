import { select, text, isCancel, confirm } from "@clack/prompts";
import chalk from "chalk";
import { Technology, Database, TemplateConfig } from "../types";
import { TECHNOLOGIES, DATABASES, MESSAGES } from "../templates/constants";
import { getTemplate } from "../templates";
import {
  writeDockerFiles,
  isValidPort,
  normalizePort,
  writeDockerIgnore,
} from "../utils";
import { detectProject } from "../utils/project-detector";
import { detectInstalledVersion } from "../utils/version-detector";

export const initCommand = async (): Promise<void> => {
  console.clear();
  console.log(chalk.blue.bold(`\n${MESSAGES.intro}\n`));

  const projectDetection = await detectProject();

  let technology: Technology;
  let detectedVersion: string | null = null;
  let installedVersion: string | null = null;

  if (projectDetection.detected && projectDetection.technology) {
    const techLabel = TECHNOLOGIES.find(
      (t) => t.value === projectDetection.technology,
    )?.label;

    console.log(chalk.green(`\n✓ ${techLabel} detectado\n`));

    const useDetected = await confirm({
      message: MESSAGES.useDetectedConfig,
      initialValue: true,
    });

    if (isCancel(useDetected)) {
      console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
      process.exit(0);
    }

    if (useDetected) {
      technology = projectDetection.technology;
      detectedVersion = projectDetection.version;
    } else {
      technology = (await select({
        message: MESSAGES.selectTech,
        options: TECHNOLOGIES.map((tech) => ({
          value: tech.value,
          label: tech.label,
        })),
      })) as Technology;

      if (isCancel(technology)) {
        console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
        process.exit(0);
      }
    }
  } else {
    technology = (await select({
      message: MESSAGES.selectTech,
      options: TECHNOLOGIES.map((tech) => ({
        value: tech.value,
        label: tech.label,
      })),
    })) as Technology;

    if (isCancel(technology)) {
      console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
      process.exit(0);
    }
  }

  const selectedTech = TECHNOLOGIES.find((t) => t.value === technology);
  if (!selectedTech) {
    console.log(chalk.red(`\n${MESSAGES.error} Tecnologia não encontrada\n`));
    process.exit(1);
  }

  const versionDetection = detectInstalledVersion(technology);
  if (versionDetection.detected && versionDetection.formattedVersion) {
    installedVersion = versionDetection.formattedVersion;
  }

  let suggestedVersion: string | null = detectedVersion || installedVersion;
  let versionOptions = selectedTech.versions.map((v) => ({
    value: v,
    label: v,
  }));

  if (suggestedVersion) {
    const matchesExisting = selectedTech.versions.some((v) =>
      v.includes(suggestedVersion!),
    );

    if (!matchesExisting) {
      versionOptions = [
        {
          value: suggestedVersion,
          label: `${suggestedVersion} ${chalk.dim("(instalada)")}`,
        },
        ...versionOptions,
      ];
    } else {
      versionOptions = versionOptions.map((opt) => {
        if (opt.value.includes(suggestedVersion!)) {
          return {
            ...opt,
            label: `${opt.value} ${chalk.dim("(instalada)")}`,
          };
        }
        return opt;
      });
    }
  }

  const version = (await select({
    message: MESSAGES.selectVersion,
    options: versionOptions,
  })) as string;

  if (isCancel(version)) {
    console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
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
    console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
    process.exit(0);
  }

  const portInput = await text({
    message: MESSAGES.inputPort,
    placeholder: String(selectedTech.defaultPort),
    defaultValue: String(selectedTech.defaultPort),
    validate: (value) => {
      if (!value || value.trim() === "") {
        return undefined;
      }
      if (!isValidPort(value)) {
        return "Porta inválida. Use um número entre 1 e 65535";
      }
      return undefined;
    },
  });

  if (isCancel(portInput)) {
    console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
    process.exit(0);
  }

  const generateDockerIgnoreFile = await confirm({
    message: MESSAGES.generateDockerIgnore.replace(
      "[Linguagem]",
      selectedTech.label,
    ),
    initialValue: true,
  });

  if (isCancel(generateDockerIgnoreFile)) {
    console.log(chalk.yellow(`\n${MESSAGES.cancel}\n`));
    process.exit(0);
  }

  const port =
    portInput && isValidPort(String(portInput))
      ? normalizePort(String(portInput))
      : selectedTech.defaultPort;

  console.log(chalk.blue(`\n${MESSAGES.generating}`));

  const config: TemplateConfig = {
    technology: technology,
    version: version,
    port,
    database: database,
  };

  const template = getTemplate(config);

  const result = await writeDockerFiles(
    template.dockerfile,
    template.dockerCompose,
  );

  const generatedFiles: string[] = result.files || [];

  if (generateDockerIgnoreFile) {
    const dockerIgnoreResult = await writeDockerIgnore(technology);
    if (dockerIgnoreResult.success) {
      generatedFiles.push(".dockerignore");
    }
  }

  if (result.success) {
    console.log(chalk.green.bold(`\n${MESSAGES.success}`));
    generatedFiles.forEach((f) => console.log(chalk.cyan(`  ✓ ${f}`)));
    console.log("");
  } else {
    console.log(chalk.red(`\n${MESSAGES.error} ${result.message}\n`));
    process.exit(1);
  }
};
