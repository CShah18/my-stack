import { readFile, writeFile, unlink, readdir, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { MemoryStore } from './index.js';

interface StoredEntry {
  value: unknown;
  expiresAt?: number;
}

export class FileStore implements MemoryStore {
  constructor(private baseDir: string) {}

  private async ensureDir(): Promise<void> {
    await mkdir(this.baseDir, { recursive: true });
  }

  private getFilePath(key: string): string {
    const safeKey = key.replace(/[^a-zA-Z0-9_-]/g, '_');
    return join(this.baseDir, `${safeKey}.json`);
  }

  public async get<T>(key: string): Promise<T | undefined> {
    await this.ensureDir();
    const filePath = this.getFilePath(key);
    try {
      const content = await readFile(filePath, 'utf-8');
      const entry: StoredEntry = JSON.parse(content);
      if (entry.expiresAt && Date.now() > entry.expiresAt) {
        await this.delete(key);
        return undefined;
      }
      return entry.value as T;
    } catch {
      return undefined;
    }
  }

  public async set<T>(key: string, value: T, ttlMs?: number): Promise<void> {
    await this.ensureDir();
    const filePath = this.getFilePath(key);
    const entry: StoredEntry = {
      value,
      expiresAt: ttlMs ? Date.now() + ttlMs : undefined,
    };
    await writeFile(filePath, JSON.stringify(entry, null, 2), 'utf-8');
  }

  public async delete(key: string): Promise<void> {
    await this.ensureDir();
    const filePath = this.getFilePath(key);
    try {
      await unlink(filePath);
    } catch {
      // Ignore if file doesn't exist
    }
  }

  public async list(prefix?: string): Promise<string[]> {
    await this.ensureDir();
    try {
      const files = await readdir(this.baseDir);
      const jsonFiles = files.filter((f) => f.endsWith('.json')).map((f) => f.slice(0, -5));
      if (prefix) {
        return jsonFiles.filter((k) => k.startsWith(prefix));
      }
      return jsonFiles;
    } catch {
      return [];
    }
  }

  public async clear(): Promise<void> {
    try {
      await rm(this.baseDir, { recursive: true, force: true });
      await this.ensureDir();
    } catch {
      // Ignore errors
    }
  }
}
