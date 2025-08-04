import { EnumValues } from '@onededios/node-commons-types';
import { Enum } from '@onededios/node-commons-enum';

/**
 * Console-based logger that formats messages and conditionally
 * suppresses chatty output (e.g. **debug** logs) in production.
 *
 * @remarks
 * Pass the current deployment environment once when you create
 * the instance.
 * In production (`"pro"`) {@link Logger.debug | debug()} is ignored,
 * while other levels always reach the console.
 *
 * @example
 * ```ts
 * import { Logger } from './logger';
 *
 * const logger = new Logger('dev');      // ⇠ emit all levels
 * logger.info('Server started');         // [INFO] Server started
 *
 * const prodLogger = new Logger();       // ⇠ defaults to 'pro'
 * prodLogger.debug('Cache miss');        // (suppressed)
 * ```
 */
export class Logger {
  /**
   * Creates a new {@link Logger} bound to an environment.
   *
   * @param currentEnv - Deployment environment that governs which
   *                     log levels are emitted.
   *                     Defaults to `"pro"`.
   */
  constructor(private readonly currentEnv = 'pro') {}

  /**
   * Writes an **informational** message to the console.
   *
   * @param msg - The human-readable message to output.
   *
   * @example Logger.INFO('Connection established with database.');
   */
  public readonly INFO = (msg: string) =>
    console.info(this.format(this.LevelEnum.info, '', msg));

  /**
   * Writes an **warning** message to the console.
   *
   * @param msg - The human-readable message to output.
   *
   * @example Logger.WARN('Could not find the desired file.');
   */
  public readonly WARN = (msg: string) =>
    console.warn(this.format(this.LevelEnum.warn, '', msg));

  /**
   * Writes an **error** message to the console.
   *
   * @param msg - The human-readable message to output.
   *
   * @example Logger.ERROR('Could not establish connection with database.');
   */

  public readonly ERROR = (msg: string) =>
    console.error(this.format(this.LevelEnum.error, '', msg));

  /**
   * Writes a **success** message to the console.
   *
   * @param msg - The human-readable message to output.
   *
   * @example Logger.SUCCESS('Record saved.');
   */
  public readonly SUCCESS = (msg: string) =>
    console.log(this.format(this.LevelEnum.success, '', msg));

  /**
   * Writes a **debug** message to the console.
   *
   * @remarks
   * Must set currentEnv different of **pro** to enable debug logs.
   *
   * @param msg - The human-readable message to output.
   * @param currentEnv - The current environment.
   *
   * @example Logger.DEBUG('Connecting to database with user "manolo"...');
   */
  public DEBUG(msg: string) {
    if (this.currentEnv.toLowerCase() === 'pro') return;
    console.debug(this.format(this.LevelEnum.debug, '', msg));
  }

  private readonly LevelEnum = Enum.create({
    info: 'INFO',
    warn: 'WARN',
    error: 'ERROR',
    success: 'SUCCESS',
    debug: 'DEBUG',
  });

  private format(
    level: string,
    symbol: string,
    msg: string,
    signature = 4
  ): string {
    const time = new Date().toISOString();
    const header = `${time} - ${symbol} ${level}`;
    const currentColor = this.getColor(level);
    const resetColor = this.getColor();

    return `${currentColor}${header} - ${this.getSignature(
      signature
    )}${resetColor}\n - ${msg}`;
  }

  private getSignature(skip: number) {
    const stack = new Error().stack?.split('\n');

    if (!stack || stack.length <= skip) return 'Unknown origin';

    let line = stack[skip].trim();
    if (line.startsWith('at ')) line = line.slice(3).trim();

    let method: string | undefined;
    let location = line;

    const openParen = line.lastIndexOf(' (');
    const closeParen = line.endsWith(')') ? line.length - 1 : -1;

    if (openParen !== -1 && closeParen === line.length - 1) {
      method = line.slice(0, openParen).trim();
      location = line.slice(openParen + 2, closeParen);
    }

    const locParts = location.split(':');
    if (locParts.length < 3) return 'Unknown origin';

    const col = locParts.pop()!;
    const lineNo = locParts.pop()!;
    const filePath = locParts.join(':');
    const fileName = filePath.split(/[/\\]/).pop() || filePath;

    return method
      ? `Method '${method}' from (${fileName}:${lineNo}:${col})`
      : `(${fileName}:${lineNo}:${col})`;
  }

  private getColor(level?: EnumValues<typeof this.LevelEnum>) {
    switch (level) {
      case this.LevelEnum.info:
        return '\x1b[34m';
      case this.LevelEnum.warn:
        return '\x1b[33m';
      case this.LevelEnum.error:
        return '\x1b[31m';
      case this.LevelEnum.success:
        return '\x1b[32m';
      case this.LevelEnum.debug:
        return '\x1b[35m';
      default:
        return '\x1b[0m';
    }
  }
}
