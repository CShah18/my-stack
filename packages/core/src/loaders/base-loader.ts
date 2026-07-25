import { z } from 'zod';

export interface Loader<T> {
  load(filePath: string): Promise<T>;
  loadAll(dirPath: string): Promise<T[]>;
  validate(data: unknown): T;
}

export abstract class BaseLoader<T> implements Loader<T> {
  constructor(protected schema: z.ZodSchema<T>) {}

  public validate(data: unknown): T {
    const result = this.schema.safeParse(data);
    if (!result.success) {
      throw new Error(`Validation failed: ${result.error.message}`);
    }
    return result.data;
  }

  public abstract load(filePath: string): Promise<T>;
  public abstract loadAll(dirPath: string): Promise<T[]>;
}
