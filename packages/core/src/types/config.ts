export interface MyStackSettings {
  defaultModel?: string;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  outputDir: string;
  cacheEnabled: boolean;
}

export interface MyStackConfig {
  name: string;
  version: string;
  agents: string[];
  skills: string[];
  workflows: string[];
  rules: string[];
  templates: string[];
  plugins: string[];
  settings: MyStackSettings;
}
