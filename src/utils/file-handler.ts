import * as fs from "fs-extra";
import * as path from "path";
import { GenerationResult } from "../types";

export const writeDockerFiles = async (
  dockerfile: string,
  dockerCompose: string,
  targetDir: string = process.cwd(),
): Promise<GenerationResult> => {
  try {
    const dockerfilePath = path.join(targetDir, "Dockerfile");
    const dockerComposePath = path.join(targetDir, "docker-compose.yml");

    await fs.writeFile(dockerfilePath, dockerfile, "utf-8");
    await fs.writeFile(dockerComposePath, dockerCompose, "utf-8");

    return {
      success: true,
      message: "Arquivos criados com sucesso!",
      files: ["Dockerfile", "docker-compose.yml"],
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Erro desconhecido",
    };
  }
};

export const fileExists = async (filePath: string): Promise<boolean> => {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
};

export const ensureDirectory = async (dirPath: string): Promise<void> => {
  await fs.ensureDir(dirPath);
};
