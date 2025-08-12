import { readdirSync } from 'fs';
import { BaseCrate } from './base-crate';

/**
 * Represents a directory within the crate system, providing methods to interact with its contents.
 *
 * @extends BaseCrate
 *
 * @remarks
 * The `Directory` class ensures that the provided path is a directory upon instantiation.
 * It offers synchronous methods to list files, subdirectories, and check for the presence of child items.
 *
 * @example
 * ```typescript
 * const dir = new Directory('src');
 * const files = dir.getFiles();
 * const subdirs = dir.getDirs();
 * const hasChild = dir.isChildPresent('index.ts');
 * ```
 */
export class Directory extends BaseCrate {
  /**
   * Creates a new instance using the provided relative path.
   * Throws an error if the path does not point to a directory.
   *
   * @param relative - The relative path to initialize the directory instance.
   * @throws {Error} If the specified path is not a directory.
   */
  constructor(relative: string) {
    super(relative);
    if (!this.isDir())
      throw new Error(`Path is not a directory: ${this.fullPath}`);
  }

  /**
   * Retrieves the list of files in the current directory.
   *
   * Scans the directory specified by `this.fullPath` and returns an array of absolute file paths
   * for all files (excluding directories and other types) found within it.
   *
   * @returns {string[]} An array of absolute file paths for each file in the directory.
   */
  public getFiles(): string[] {
    const dirs = readdirSync(this.fullPath, { withFileTypes: true });
    return dirs
      .filter((dirent) => dirent.isFile())
      .map((dirent) => `${this.fullPath}/${dirent.name}`);
  }

  /**
   * Retrieves the list of subdirectories within the current directory.
   *
   * @returns {string[]} An array of absolute paths to each subdirectory found in the directory.
   *
   * @remarks
   * This method synchronously reads the contents of the directory specified by `this.fullPath`,
   * filters out only the directories, and returns their absolute paths.
   *
   * @throws {Error} If the directory cannot be read (e.g., due to permissions or non-existence).
   */
  public getDirs(): string[] {
    const dirs = readdirSync(this.fullPath, { withFileTypes: true });
    return dirs
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => `${this.fullPath}/${dirent.name}`);
  }

  /**
   * Checks if a child directory or file specified by the given relative path exists within the current directory.
   *
   * @param relativePath - The relative path to the child directory or file to check for presence.
   * @returns `true` if the child is present in the directory; otherwise, `false`.
   */
  public isChildPresent(relativePath: string): boolean {
    const fullPath = this.getFullPath(relativePath);
    return readdirSync(this.fullPath).includes(fullPath);
  }
}
