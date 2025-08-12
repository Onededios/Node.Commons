/**
 * Represents contextual information about an error event.
 *
 * @property operation - The name of the operation during which the error occurred.
 * @property user - Identifier for the user associated with the error.
 * @property request - Identifier or details of the request that caused the error.
 * @property metadata - Additional metadata related to the error.
 * @property timestamp - The date and time when the error occurred.
 */
export interface ErrorContext {
  operation?: string;
  user?: string;
  request?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}
