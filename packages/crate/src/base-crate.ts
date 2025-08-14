import { existsSync, statSync } from 'fs';
import path from 'path';

export abstract class BaseCrate {
  protected readonly fullPath: string;

  constructor(protected readonly relative: string) {
    if (!this.exists())
      throw new Error(`Directory does not exist at: ${this.relative}`);
    this.fullPath = this.getFullPath(relative);
  }

  public readonly getCurrentPath = (): string => this.fullPath;

  public readonly getFullPath = (relativePath: string): string =>
    path.resolve(relativePath);
  public readonly getRelativePath = (relativePath: string): string =>
    path.relative(this.fullPath, relativePath);
  protected readonly isFile = (): boolean => !this.fullPath.endsWith('/');

  protected readonly isDir = (): boolean => {
    try {
      return statSync(this.fullPath).isDirectory();
    } catch {
      return false;
    }
  };

  private readonly exists = (): boolean => existsSync(this.getCurrentPath());
}
