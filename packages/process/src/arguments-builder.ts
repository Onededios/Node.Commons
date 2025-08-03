export class ArgumentsBuilder<
  P extends Record<string, (raw: string) => unknown>
> {
  public readonly arguments: Readonly<{ [K in keyof P]: ReturnType<P[K]> }>;

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
