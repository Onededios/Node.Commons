import { existsSync } from 'fs';
import path from 'path';
import { g } from 'vitest/dist/chunks/suite.d.FvehnV49';

export abstract class Common {
  protected readonly fullPath: string;

  constructor(protected readonly relative: string) {
    if (!this.exists())
      throw new Error(`Directory does not exist at ${this.relative}`);
    this.fullPath = this.getFullPath(relative);
  }

  public readonly getCurrentPath = (): string => this.fullPath;

  protected readonly isFile = (): boolean => !this.fullPath.endsWith('/');

  protected readonly isDir = (): boolean => this.fullPath.endsWith('/');

  public readonly getFullPath = (relativePath: string): string =>
    path.resolve(this.fullPath, relativePath);

  private readonly exists = (): boolean => existsSync(this.getCurrentPath());
}
