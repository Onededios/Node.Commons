import { promises, statSync } from 'fs';
import { BaseCrate } from './base-crate';

/**
 * Represents a file on the filesystem and provides asynchronous methods for reading and writing.
 *
 * This class extends {@link BaseCrate} and ensures that the provided path points to a valid file.
 * It offers convenient methods for reading file contents as a string, parsing JSON files, and writing data.
 *
 * @typeParam T - The expected type of the parsed JSON object when using {@link readJSONAsync}.
 *
 * @example
 * // Reading a text file
 * const file = new File('example.txt');
 * file.readAsync().then(contents => console.log(contents));
 *
 * @example
 * // Reading and parsing a JSON file
 * interface Config { port: number; }
 * const configFile = new File<Config>('config.json');
 * configFile.readJSONAsync().then(config => console.log(config.port));
 *
 * @example
 * // Writing to a file
 * const logFile = new File('log.txt');
 * logFile.writeAsync('Log entry');
 *
 * @throws {Error} If the provided path does not point to a file.
 *
 * @see {@link BaseCrate}
 */
export class File<T = unknown> extends BaseCrate {
  /**
   * Creates a new File instance representing a file at the given relative path.
   * Throws an error if the provided path does not point to a file.
   *
   * @param relative - The relative path to the file.
   * @throws {Error} If the path does not point to a file.
   *
   * @example
   * const file = new File('data.txt');
   */
  constructor(relative: string) {
    super(relative);
    if (!File.isFileSync(this.getCurrentPath()))
      throw new Error(`Path is not a file: ${this.getCurrentPath()}`);
  }

  /**
   * Reads the file asynchronously as a string.
   * @param encoding - The encoding to use (default is 'utf-8').
   * @returns Promise resolving to the file contents as a string.
   *
   * @example
   * const handler = new File('notes.txt');
   * handler.readAsync().then(console.log);
   */
  public readAsync = async (
    encoding: BufferEncoding = 'utf-8'
  ): Promise<string> =>
    await promises.readFile(this.getCurrentPath(), encoding);

  /**
   * Reads and parses the file as JSON.
   * @returns Promise resolving to the parsed JSON object of type T.
   * @throws Error if the file does not exist or JSON is invalid.
   *
   * @example
   * interface User { name: string; }
   * const handler = new File<User>('user.json');
   * handler.readJSONAsync().then(user => console.log(user.name));
   */
  public async readJSONAsync(): Promise<T> {
    const content = await this.readAsync();
    return JSON.parse(content) as T;
  }

  /**
   * Writes data to the file asynchronously.
   * @param data - The string data to write to the file.
   * @returns A Promise that resolves when the write operation is complete.
   *
   * @example
   * const handler = new File('output.txt');
   * await handler.writeAsync('Hello, world!');
   */
  public writeAsync = async (data: string): Promise<void> =>
    await promises.writeFile(this.getCurrentPath(), data);

  /**
   * Checks synchronously if the given path is a file.
   * @param path - The path to check.
   * @returns True if the path is a file, false otherwise.
   */
  private static isFileSync(path: string): boolean {
    try {
      return statSync(path).isFile();
    } catch {
      return false;
    }
  }
}
