import * as fs from "fs-extra";
import * as path from "path";
import { Technology } from "../types";

interface ProjectDetectionResult {
  detected: boolean;
  technology: Technology | null;
  version: string | null;
  projectName: string | null;
  detectedFrom: string | null;
}

const detectNodeProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const packageJsonPath = path.join(cwd, "package.json");

  try {
    if (await fs.pathExists(packageJsonPath)) {
      const packageJson = await fs.readJson(packageJsonPath);
      const engines = packageJson.engines?.node;
      let version: string | null = null;

      if (engines) {
        const match = engines.match(/(\d+)/);
        if (match) version = match[1];
      }

      return {
        detected: true,
        technology: "node",
        version,
        projectName: packageJson.name || null,
        detectedFrom: "package.json",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

const detectPythonProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const requirementsPath = path.join(cwd, "requirements.txt");
  const pyprojectPath = path.join(cwd, "pyproject.toml");

  try {
    if (await fs.pathExists(requirementsPath)) {
      return {
        detected: true,
        technology: "python",
        version: null,
        projectName: null,
        detectedFrom: "requirements.txt",
      };
    }

    if (await fs.pathExists(pyprojectPath)) {
      const content = await fs.readFile(pyprojectPath, "utf-8");
      const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);
      const versionMatch = content.match(/python\s*=\s*"[^\d]*(\d+\.\d+)/);

      return {
        detected: true,
        technology: "python",
        version: versionMatch ? versionMatch[1] : null,
        projectName: nameMatch ? nameMatch[1] : null,
        detectedFrom: "pyproject.toml",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

const detectGoProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const goModPath = path.join(cwd, "go.mod");

  try {
    if (await fs.pathExists(goModPath)) {
      const content = await fs.readFile(goModPath, "utf-8");
      const moduleMatch = content.match(/module\s+(.+)/);
      const versionMatch = content.match(/go\s+(\d+\.\d+)/);

      return {
        detected: true,
        technology: "go",
        version: versionMatch ? versionMatch[1] : null,
        projectName: moduleMatch ? moduleMatch[1] : null,
        detectedFrom: "go.mod",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

const detectJavaProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const pomPath = path.join(cwd, "pom.xml");
  const gradlePath = path.join(cwd, "build.gradle");

  try {
    if (await fs.pathExists(pomPath)) {
      const content = await fs.readFile(pomPath, "utf-8");
      const versionMatch = content.match(
        /<maven\.compiler\.source>(\d+)<\/maven\.compiler\.source>/,
      );
      const nameMatch = content.match(/<artifactId>([^<]+)<\/artifactId>/);

      return {
        detected: true,
        technology: "java",
        version: versionMatch ? versionMatch[1] : null,
        projectName: nameMatch ? nameMatch[1] : null,
        detectedFrom: "pom.xml",
      };
    }

    if (await fs.pathExists(gradlePath)) {
      return {
        detected: true,
        technology: "java",
        version: null,
        projectName: null,
        detectedFrom: "build.gradle",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

const detectPHPProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const composerPath = path.join(cwd, "composer.json");

  try {
    if (await fs.pathExists(composerPath)) {
      const composerJson = await fs.readJson(composerPath);
      const phpVersion = composerJson.require?.php;
      let version: string | null = null;

      if (phpVersion) {
        const match = phpVersion.match(/(\d+\.\d+)/);
        if (match) version = match[1];
      }

      return {
        detected: true,
        technology: "php",
        version,
        projectName: composerJson.name || null,
        detectedFrom: "composer.json",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

const detectRubyProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const gemfilePath = path.join(cwd, "Gemfile");

  try {
    if (await fs.pathExists(gemfilePath)) {
      const content = await fs.readFile(gemfilePath, "utf-8");
      const versionMatch = content.match(/ruby\s+['"](\d+\.\d+)/);

      return {
        detected: true,
        technology: "ruby",
        version: versionMatch ? versionMatch[1] : null,
        projectName: null,
        detectedFrom: "Gemfile",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

const detectRustProject = async (
  cwd: string,
): Promise<ProjectDetectionResult> => {
  const cargoPath = path.join(cwd, "Cargo.toml");

  try {
    if (await fs.pathExists(cargoPath)) {
      const content = await fs.readFile(cargoPath, "utf-8");
      const nameMatch = content.match(/name\s*=\s*"([^"]+)"/);

      return {
        detected: true,
        technology: "rust",
        version: null,
        projectName: nameMatch ? nameMatch[1] : null,
        detectedFrom: "Cargo.toml",
      };
    }
  } catch {
    // Ignore errors
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};

export const detectProject = async (
  cwd: string = process.cwd(),
): Promise<ProjectDetectionResult> => {
  const detectors = [
    detectNodeProject,
    detectPythonProject,
    detectGoProject,
    detectJavaProject,
    detectPHPProject,
    detectRubyProject,
    detectRustProject,
  ];

  for (const detector of detectors) {
    const result = await detector(cwd);
    if (result.detected) {
      return result;
    }
  }

  return {
    detected: false,
    technology: null,
    version: null,
    projectName: null,
    detectedFrom: null,
  };
};
