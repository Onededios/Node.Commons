import { ErrorContext } from '../models/error-context.interface';
import { ErrorHandlerOptions } from './../models/error-handler-options';
import { Logger } from '@onededios/node-commons-logging';

/**
 * Handles error logging and formatting with support for masking sensitive data,
 * truncating long messages, and including contextual metadata.
 *
 * @remarks
 * The `ErrorHandler` class provides methods to handle errors synchronously and asynchronously,
 * format error messages with optional stack traces, and sanitize sensitive fields in error logs.
 *
 * @example
 * ```typescript
 * const handler = new ErrorHandler(logger, { includeStackTrace: true });
 * handler.handleSync(() => { throw new Error('Oops!'); });
 * ```
 *
 * @public
 */
export class ErrorHandler {
  private readonly options: Required<ErrorHandlerOptions>;

  /**
   * Creates an instance of the error handler.
   *
   * @param logger - The logger instance used for logging errors.
   * @param options - Optional configuration for error handling.
   *   - handle: Whether to handle errors automatically. Defaults to `true`.
   *   - includeStackTrace: Whether to include stack traces in error logs. Defaults to `false`.
   *   - maxErrorLength: The maximum length of error messages. Defaults to `1024`.
   *   - sensitiveData: An array of sensitive field names to mask in error logs. Defaults to `['password', 'secret']`.
   */
  constructor(
    private readonly logger: Logger,
    options: ErrorHandlerOptions = {}
  ) {
    this.options = {
      handle: options.handle ?? true,
      includeStackTrace: options.includeStackTrace ?? false,
      maxErrorLength: options.maxErrorLength ?? 1024,
      sensitiveData: options.sensitiveData ?? ['password', 'secret'],
    };
  }

  /**
   * Handles an error by formatting it and logging the message.
   * If the `handle` option is not enabled, the error is re-thrown.
   *
   * @param error - The error to handle, which can be of any type.
   * @param context - Optional context information to provide additional details about the error.
   * @throws Throws the error if the `handle` option is not set to true.
   */
  public handle(error: unknown, context?: ErrorContext): void {
    const message = this.format(error, context);
    this.logger.ERROR(message);

    if (!this.options.handle) throw error;
  }

  /**
   * Executes a synchronous function and handles any errors that occur.
   *
   * @typeParam T - The return type of the synchronous function.
   * @param syncFunc - The synchronous function to execute.
   * @param context - Optional error context to provide additional information for error handling.
   * @returns The result of the synchronous function if successful; otherwise, returns `undefined` if an error is caught.
   *
   * @remarks
   * If an error is thrown during the execution of `syncFunc`, the error is passed to the `handle` method
   * along with the optional `context`, and `undefined` is returned.
   */
  public handleSync<T>(
    syncFunc: () => T,
    context?: ErrorContext
  ): T | undefined {
    try {
      return syncFunc();
    } catch (error) {
      this.handle(error, context);
      return undefined;
    }
  }

  /**
   * Executes the provided asynchronous function and handles any errors that occur during its execution.
   *
   * @param asyncFunc - A function that returns a Promise. This function will be executed and monitored for errors.
   * @param context - Optional context information to be passed to the error handler if an error occurs.
   * @returns A Promise that resolves when the asynchronous function completes or after error handling.
   *
   * @remarks
   * If an error is thrown during the execution of `asyncFunc`, it will be caught and passed to the `handle` method along with the optional `context`.
   */
  public async handleAsync(
    asyncFunc: () => Promise<void>,
    context?: ErrorContext
  ): Promise<void> {
    try {
      await asyncFunc();
    } catch (error) {
      this.handle(error, context);
    }
  }

  private format(error: unknown, context?: ErrorContext): string {
    let message = '';

    if (context) {
      const parts = [];

      if (context.operation) parts.push(`Operation: ${context.operation}`);
      if (context.user) parts.push(`User: ${context.user}`);
      if (context.request) parts.push(`Request: ${context.request}`);

      if (parts.length > 0) message += `[${parts.join(', ')}] `;
    }

    if (error instanceof Error) {
      message += `${error.name}: ${error.message}`;

      if (this.options.includeStackTrace && error.stack)
        message += `\nStack Trace:\n${error.stack}`;
    } else message += this.prettify(error, 'Unknown Error');

    if (context?.metadata)
      message += this.prettify(context.metadata, 'Metadata');

    return message;
  }

  private sanitize(obj: unknown): unknown {
    if (typeof obj !== 'object' || obj === null) return obj;

    if (Array.isArray(obj)) return obj.map((item) => this.sanitize(item));

    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(obj)) {
      const any = this.options.sensitiveData.some((field) =>
        key.toLowerCase().includes(field.toLowerCase())
      );

      if (any) sanitized[key] = '[REDACTED]';
      else sanitized[key] = this.sanitize(value);
    }
    return sanitized;
  }

  private truncate(message: string): string {
    if (message.length <= this.options.maxErrorLength) return message;
    return (
      message.substring(0, this.options.maxErrorLength) + '... [TRUNCATED]'
    );
  }

  private prettify(message: unknown, title: string): string {
    try {
      const sanitized = this.sanitize(message);
      const serialized = JSON.stringify(sanitized, null, 2);
      const truncated = this.truncate(serialized);
      return `${title}: ${truncated}`;
    } catch {
      return `${title}: Unable to serialize message.`;
    }
  }
}
