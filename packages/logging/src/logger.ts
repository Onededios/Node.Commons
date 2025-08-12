import { Enum, EnumValues } from '@onededios/node-commons-enum';

/**
 * Provides a structured and color-coded logging utility for console output,
 * supporting multiple log levels such as info, warning, error, success, and debug.
 *
 * The {@link Logger} class formats log messages with timestamps, log level,
 * origin signature, and color coding for improved readability in the console.
 *
 * The log level emission is governed by the deployment environment, allowing
 * debug messages to be suppressed in production environments.
 *
 * @example
 * const logger = new Logger('dev');
 * logger.INFO('Application started.');
 * logger.WARN('Low disk space.');
 * logger.ERROR('Unhandled exception occurred.');
 * logger.SUCCESS('User registration completed.');
 * logger.DEBUG('Variable x value:', x);
 *
 * @remarks
 * - The default environment is `"pro"` (production), which suppresses debug logs.
 * - Log messages include the origin method and file location for easier tracing.
 * - Color codes are applied for each log level to enhance visibility.
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
   * Logs a debug message to the console if the current environment is not production.
   *
   * @param msg - The debug message to log.
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
