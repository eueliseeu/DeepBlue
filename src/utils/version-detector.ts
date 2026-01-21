import { execSync } from "child_process";
import { Technology } from "../types";

interface VersionDetectionResult {
  detected: boolean;
  version: string | null;
  formattedVersion: string | null;
}

const executeCommand = (command: string): string | null => {
  try {
    return execSync(command, {
      encoding: "utf-8",
      stdio: ["pipe", "pipe", "ignore"],
    }).trim();
  } catch {
    return null;
  }
};

const formatVersion = (
  version: string,
  technology: Technology,
): string | null => {
  const majorMinorMatch = version.match(/(\d+)\.(\d+)/);
  if (!majorMinorMatch) return null;

  const major = majorMinorMatch[1];
  const minor = majorMinorMatch[2];

  switch (technology) {
    case "node":
      return `${major}`;
    case "python":
      return `${major}.${minor}`;
    case "go":
      return `${major}.${minor}`;
    case "java":
      return major;
    case "php":
      return `${major}.${minor}`;
    case "ruby":
      return `${major}.${minor}`;
    case "rust":
      return `${major}.${minor}`;
    default:
      return `${major}.${minor}`;
  }
};

const detectNodeVersion = (): VersionDetectionResult => {
  const output = executeCommand("node --version");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const version = output.replace("v", "");
  const formatted = formatVersion(version, "node");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

const detectPythonVersion = (): VersionDetectionResult => {
  const output =
    executeCommand("python3 --version") || executeCommand("python --version");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const version = output.replace("Python ", "").trim();
  const formatted = formatVersion(version, "python");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

const detectGoVersion = (): VersionDetectionResult => {
  const output = executeCommand("go version");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const match = output.match(/go(\d+\.\d+\.\d+)/);
  if (!match) return { detected: false, version: null, formattedVersion: null };

  const version = match[1];
  const formatted = formatVersion(version, "go");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

const detectJavaVersion = (): VersionDetectionResult => {
  const output = executeCommand("java -version 2>&1");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const match = output.match(/version "(\d+)/);
  if (!match) return { detected: false, version: null, formattedVersion: null };

  const version = match[1];
  const formatted = formatVersion(version, "java");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

const detectPHPVersion = (): VersionDetectionResult => {
  const output = executeCommand("php -v");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const match = output.match(/PHP (\d+\.\d+\.\d+)/);
  if (!match) return { detected: false, version: null, formattedVersion: null };

  const version = match[1];
  const formatted = formatVersion(version, "php");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

const detectRubyVersion = (): VersionDetectionResult => {
  const output = executeCommand("ruby -v");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const match = output.match(/ruby (\d+\.\d+\.\d+)/);
  if (!match) return { detected: false, version: null, formattedVersion: null };

  const version = match[1];
  const formatted = formatVersion(version, "ruby");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

const detectRustVersion = (): VersionDetectionResult => {
  const output = executeCommand("rustc --version");
  if (!output) return { detected: false, version: null, formattedVersion: null };

  const match = output.match(/rustc (\d+\.\d+\.\d+)/);
  if (!match) return { detected: false, version: null, formattedVersion: null };

  const version = match[1];
  const formatted = formatVersion(version, "rust");

  return {
    detected: true,
    version,
    formattedVersion: formatted,
  };
};

export const detectInstalledVersion = (
  technology: Technology,
): VersionDetectionResult => {
  const detectors: Record<
    Technology,
    () => VersionDetectionResult
  > = {
    node: detectNodeVersion,
    python: detectPythonVersion,
    go: detectGoVersion,
    java: detectJavaVersion,
    php: detectPHPVersion,
    ruby: detectRubyVersion,
    rust: detectRustVersion,
  };

  return detectors[technology]();
};
