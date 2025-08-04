export interface ErrorContext {
  operation?: string;
  user?: string;
  request?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}
