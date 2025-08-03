import { readdirSync } from 'fs';
import { Common } from './common';

export class Directory extends Common {
  constructor(relative: string) {
    super(relative);
    if (!this.isDir())
      throw new Error(`Path is not a directory: ${this.fullPath}`);
  }

  public getFiles(): string[] {
    const dirs = readdirSync(this.fullPath, { withFileTypes: true });
    return dirs
      .filter((dirent) => dirent.isFile())
      .map((dirent) => `${this.fullPath}/${dirent.name}`);
  }

  public getDirs(): string[] {
    const dirs = readdirSync(this.fullPath, { withFileTypes: true });
    return dirs
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => `${this.fullPath}/${dirent.name}`);
  }

  public isChildPresent(relativePath: string): boolean {
    const fullPath = this.getFullPath(relativePath);
    return readdirSync(this.fullPath).includes(fullPath);
  }
}
