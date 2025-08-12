/**
 * Options for configuring error handling behavior.
 *
 * @property handle - Indicates whether the error should be handled automatically.
 * @property includeStackTrace - If true, includes the stack trace in error output.
 * @property maxErrorLength - Specifies the maximum length of the error message.
 * @property sensitiveData - An array of sensitive data keys to be filtered from error output.
 */
export interface ErrorHandlerOptions {
  handle?: boolean;
  includeStackTrace?: boolean;
  maxErrorLength?: number;
  sensitiveData?: string[];
}
