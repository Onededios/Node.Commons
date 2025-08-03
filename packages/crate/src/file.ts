import { promises } from 'fs';
import { Common } from './common';

export class File<T = unknown> extends Common {
  constructor(relative: string) {
    super(relative);
    if (!this.isFile()) throw new Error(`Path is not a file: ${this.fullPath}`);
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
  public readonly readAsync = async (encoding: BufferEncoding = 'utf-8') =>
    await promises.readFile(this.getCurrentPath(), encoding);

  /**
   * Reads and parses the file as JSON.
   * @returns Promise resolving to the parsed JSON object of type T.
   * @throws Error if the file does not exist.
   *
   * @example
   * interface User { name: string; }
   * const handler = new File<User>('user.json');
   * handler.readJSONAsync().then(user => console.log(user.name));
   */
  public readonly readJSONAsync = async (): Promise<T> =>
    JSON.parse(await this.readAsync());

  public readonly writeAsync = async (data: string) =>
    await promises.writeFile(this.getCurrentPath(), data);
}
