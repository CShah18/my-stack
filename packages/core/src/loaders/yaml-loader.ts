import { readFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { parse } from 'yaml';
import { BaseLoader } from './base-loader.js';

export class YamlLoader<T> extends BaseLoader<T> {
  public async load(filePath: string): Promise<T> {
    try {
      const content = await readFile(filePath, 'utf-8');
      const parsed = parse(content);
      return this.validate(parsed);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to load YAML file at '${filePath}': ${msg}`);
    }
  }

  public async loadAll(dirPath: string): Promise<T[]> {
    try {
      const files = await readdir(dirPath);
      const yamlFiles = files.filter(
        (f) => f.endsWith('.yaml') || f.endsWith('.yml'),
      );
      const results: T[] = [];
      for (const file of yamlFiles) {
        const fullPath = join(dirPath, file);
        results.push(await this.load(fullPath));
      }
      return results;
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to load YAML directory at '${dirPath}': ${msg}`);
    }
  }
}
