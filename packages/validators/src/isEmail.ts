/**
 * Checks if a value is a valid email address (simple RFC 5322 pattern).
 *
 * @param value - The string to validate.
 * @returns `true` if the value is a valid email, `false` otherwise.
 *
 * @example
 * isEmail('user@example.com'); // true
 * isEmail('not-an-email');     // false
 */
export function isEmail(value: string): boolean {
  if (typeof value !== 'string' || value.length > 320) return false;
  const at = value.indexOf('@');
  if (at < 1 || at !== value.lastIndexOf('@')) return false;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1);
  if (!local || !domain || local.length > 64 || domain.length > 255)
    return false;
  if (domain.indexOf('.') === -1) return false;
  if (domain.startsWith('.') || domain.endsWith('.')) return false; // <-- Prevents '@.com' and 'user@com.'
  if (/\s/.test(value)) return false;
  return true;
}
