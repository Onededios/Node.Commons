import { Logger } from '@onededios/node-commons-logging';
import { ErrorHandlerOptions } from '../models/error-handler-options';
import { ErrorContext } from '../models/error-context.interface';

export class ErrorHandler {
  private readonly options: Required<ErrorHandlerOptions>;

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

  public handle(error: unknown, context?: ErrorContext): void {
    const message = this.format(error, context);
    this.logger.ERROR(message);

    if (!this.options.handle) throw error;
  }

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
