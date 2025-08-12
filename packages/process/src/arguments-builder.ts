/**
 * A utility class for parsing and building strongly-typed command-line arguments.
 *
 * @typeParam P - An object type where each key is an argument name and each value is a parser function
 *                that takes a raw string and returns the parsed value.
 *
 * @example
 * ```typescript
 * const builder = new ArgumentsBuilder({
 *   port: (raw) => parseInt(raw, 10),
 *   verbose: (raw) => raw === 'true'
 * });
 * const args = builder.arguments; // { port: number, verbose: boolean }
 * ```
 *
 * @remarks
 * - Parses arguments from `process.argv`.
 * - Supports both long (`--option`) and short (`-o`) options, with or without values.
 * - Values can be provided as `--option=value` or `--option value`.
 * - If no value is provided, the argument is set to `'true'`.
 * - The parsed and typed arguments are available via the `arguments` property.
 *
 * @property arguments - A frozen object containing the parsed and typed arguments.
 * @param parsers - An object mapping argument names to parser functions.
 */
export class ArgumentsBuilder<
  P extends Record<string, (raw: string) => unknown>
> {
  /**
   * An object containing the processed arguments, where each key corresponds to a property in `P`
   * and its value is the return type of the associated function in `P`.
   *
   * This property is read-only and provides type-safe access to the results of argument processing.
   */
  public readonly arguments: Readonly<{ [K in keyof P]: ReturnType<P[K]> }>;

  /**
   * Initializes a new instance of the class with the provided argument parsers.
   *
   * @param parsers - An object containing parser functions for each argument key.
   *
   * This constructor parses the raw arguments using the provided parsers,
   * assigns the parsed values to the corresponding keys, and stores them
   * in an immutable `arguments` object.
   */
  constructor(private readonly parsers: P) {
    const tmp = {} as { [K in keyof P]: ReturnType<P[K]> };
    const rawArgs = this.parseArguments();

    for (const key in this.parsers) {
      tmp[key] = this.getVar(key, rawArgs);
    }

    this.arguments = Object.freeze(tmp);
  }

  private parseArguments(): Record<string, string> {
    const args: Record<string, string> = {};
    const argv = process.argv.slice(2); // Remove 'node' and script name

    let i = 0;
    while (i < argv.length) {
      const arg = argv[i];

      if (arg.startsWith('--')) {
        i = this.parseLongOption(arg, argv, i, args);
      } else if (arg.startsWith('-')) {
        i = this.parseShortOption(arg, argv, i, args);
      } else {
        i++;
      }
    }

    return args;
  }

  private parseLongOption(
    arg: string,
    argv: string[],
    index: number,
    args: Record<string, string>
  ): number {
    const equalIndex = arg.indexOf('=');
    if (equalIndex !== -1) {
      const key = arg.slice(2, equalIndex);
      const value = arg.slice(equalIndex + 1);
      args[key] = value;
      return index + 1;
    }

    const key = arg.slice(2);
    const nextArg = argv[index + 1];
    if (nextArg && !nextArg.startsWith('-')) {
      args[key] = nextArg;
      return index + 2;
    }

    args[key] = 'true';
    return index + 1;
  }

  private parseShortOption(
    arg: string,
    argv: string[],
    index: number,
    args: Record<string, string>
  ): number {
    const equalIndex = arg.indexOf('=');
    if (equalIndex !== -1) {
      const key = arg.slice(1, equalIndex);
      const value = arg.slice(equalIndex + 1);
      args[key] = value;
      return index + 1;
    }

    const key = arg.slice(1);
    const nextArg = argv[index + 1];
    if (nextArg && !nextArg.startsWith('-')) {
      args[key] = nextArg;
      return index + 2;
    }

    args[key] = 'true';
    return index + 1;
  }

  private getVar<K extends keyof P>(
    key: K,
    rawArgs: Record<string, string>
  ): ReturnType<P[K]> {
    const raw = rawArgs[key as string] ?? '';
    const parser = this.parsers[key] as (raw: string) => ReturnType<P[K]>;
    return parser(raw);
  }
}
