import { SecretsProvider } from '../types/security.js';

export class EnvSecretsProvider implements SecretsProvider {
  private prefix: string;

  constructor(prefix: string = 'MYSTACK_SECRET_') {
    this.prefix = prefix;
  }

  private envKey(key: string): string {
    return `${this.prefix}${key.toUpperCase()}`;
  }

  public async get(key: string): Promise<string | undefined> {
    // Check prefixed key first, then fallback to exact key (for standard env vars like OPENAI_API_KEY)
    return process.env[this.envKey(key)] ?? process.env[key];
  }

  public async has(key: string): Promise<boolean> {
    const val = await this.get(key);
    return val !== undefined && val !== '';
  }

  public async list(): Promise<string[]> {
    const keys: string[] = [];
    for (const k of Object.keys(process.env)) {
      if (k.startsWith(this.prefix)) {
        keys.push(k.slice(this.prefix.length).toLowerCase());
      }
    }
    return keys;
  }

  public async set(key: string, value: string): Promise<void> {
    process.env[this.envKey(key)] = value;
  }
}
