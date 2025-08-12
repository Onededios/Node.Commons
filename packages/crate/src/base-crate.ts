import { existsSync } from 'fs';
import path from 'path';

/**
 * Abstract base class representing a crate with a directory path.
 * Provides utilities for path resolution and validation.
 *
 * @remarks
 * - Ensures the existence of the directory at instantiation.
 * - Offers methods to resolve absolute and relative paths.
 * - Differentiates between file and directory paths.
 *
 * @example
 * ```typescript
 * class MyCrate extends BaseCrate { ... }
 * const crate = new MyCrate('some/relative/path');
 * const absPath = crate.getFullPath('file.txt');
 * ```
 */
export abstract class BaseCrate {
  protected readonly fullPath: string;

  /**
   * Creates an instance of the class with the specified relative directory path.
   *
   * @param relative - The relative path to the directory.
   * @throws Error if the directory does not exist at the given relative path.
   */
  constructor(protected readonly relative: string) {
    if (!this.exists())
      throw new Error(`Directory does not exist at ${this.relative}`);
    this.fullPath = this.getFullPath(relative);
  }

  /**
   * Returns the current full path associated with the crate.
   *
   * @returns {string} The full path as a string.
   */
  public readonly getCurrentPath = (): string => this.fullPath;

  /**
   * Resolves and returns the absolute path by combining the crate's full path with the provided relative path.
   *
   * @param relativePath - The relative path to resolve against the crate's full path.
   * @returns The absolute path as a string.
   */
  public readonly getFullPath = (relativePath: string): string =>
    path.resolve(this.fullPath, relativePath);
  /**
   * Returns the relative path from the crate's full path to the specified target path.
   *
   * @param relativePath - The target path to which the relative path should be calculated.
   * @returns The relative path from `this.fullPath` to `relativePath`.
   */
  public readonly getRelativePath = (relativePath: string): string =>
    path.relative(this.fullPath, relativePath);
  protected readonly isFile = (): boolean => !this.fullPath.endsWith('/');

  protected readonly isDir = (): boolean => this.fullPath.endsWith('/');

  private readonly exists = (): boolean => existsSync(this.getCurrentPath());
}
