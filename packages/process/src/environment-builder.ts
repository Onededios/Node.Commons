import { config } from 'dotenv';

/**
 * Builds a **strongly-typed, immutable** snapshot of your environment
 * variables at startup.
 *
 * The class accepts a **parsers map**—one parser function per variable
 * you care about. Each parser receives the raw `string | undefined`
 * from `process.env` and must return the value in the desired runtime
 * type (number, boolean, enum, etc.).
 *
 * Immediately upon construction the class:
 *
 * 1. Invokes {@link https://github.com/motdotla/dotenv | `dotenv.config()`},
 *    so values from a local `.env` file are merged into `process.env`.
 * 2. Parses every declared variable **eagerly** — failing fast if any
 *    parser throws.
 * 3. Exposes the results via the **readonly, frozen**
 *    {@link EnvironmentBuilder.variables | `variables`} property.
 *
 * @typeParam P - Record whose *keys* are variable names and *values*
 *                are parser functions (`(raw: string) => unknown`).
 *
 * @example
 * ```ts
 * import { EnvironmentBuilder } from './EnvironmentBuilder';
 *
 * const envBuilder = new EnvironmentBuilder({
 *   PORT:      (raw) => Number(raw ?? 3000),
 *   NODE_ENV:  (raw) => (raw ?? 'development') as 'development' | 'production',
 *   USE_CACHE: (raw) => raw === 'true',
 * });
 *
 * const { PORT, NODE_ENV, USE_CACHE } = envBuilder.variables;
 * // PORT      -> number
 * // NODE_ENV  -> 'development' | 'production'
 * // USE_CACHE -> boolean
 * ```
 */
export class EnvironmentBuilder<
  P extends Record<string, (raw: string) => unknown>
> {
  /**
   * An object containing environment variables, where each key corresponds to a property in `P`
   * and its value is the result of invoking the respective function in `P`.
   * 
   * @readonly
   * @typeParam P - The type representing the set of environment variable factories.
   * @remarks
   * This property provides a strongly-typed, immutable mapping of environment variable names to their computed values.
   */
  public readonly variables: Readonly<{ [K in keyof P]: ReturnType<P[K]> }>;

  /**
   * Creates a new {@link EnvironmentBuilder}.
   *
   * @param parsers - Dictionary of parser functions, one for each expected
   *                  environment variable.
   *                  The parsed output type of each function becomes the
   *                  corresponding value type in {@link variables}.
   */
  constructor(private readonly parsers: P) {
    config();

    const tmp = {} as { [K in keyof P]: ReturnType<P[K]> };

    (Object.keys(parsers) as (keyof P)[]).forEach(
      (key) => (tmp[key] = this.getVar(key))
    );

    this.variables = Object.freeze(tmp);
  }

  private getVar<K extends keyof P>(key: K): ReturnType<P[K]> {
    const raw = process.env[key as string] ?? '';
    const parser = this.parsers[key] as (raw: string) => ReturnType<P[K]>;
    return parser(raw);
  }
}
