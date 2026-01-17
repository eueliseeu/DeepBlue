import { Technology, DockerTemplate, TemplateConfig } from "../types";
import {
  generateNodeTemplate,
  generatePythonTemplate,
  generateGoTemplate,
  generateJavaTemplate,
  generatePHPTemplate,
  generateRubyTemplate,
  generateRustTemplate,
} from "./generators";

export const getTemplate = (config: TemplateConfig): DockerTemplate => {
  const generators: Record<
    Technology,
    (config: TemplateConfig) => DockerTemplate
  > = {
    node: generateNodeTemplate,
    python: generatePythonTemplate,
    go: generateGoTemplate,
    java: generateJavaTemplate,
    php: generatePHPTemplate,
    ruby: generateRubyTemplate,
    rust: generateRustTemplate,
  };

  const generator = generators[config.technology];
  return generator(config);
};
