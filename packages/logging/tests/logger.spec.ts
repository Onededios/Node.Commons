import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { Logger } from '../src/logger';

describe('Logger', () => {
  const logger = new Logger('test');

  const stubConsole = () => ({
    info: vi.spyOn(console, 'info').mockImplementation(vi.fn()),
    warn: vi.spyOn(console, 'warn').mockImplementation(vi.fn()),
    error: vi.spyOn(console, 'error').mockImplementation(vi.fn()),
    log: vi.spyOn(console, 'log').mockImplementation(vi.fn()),
    debug: vi.spyOn(console, 'debug').mockImplementation(vi.fn()),
  });

  const msg = 'hello world';
  let spies: ReturnType<typeof stubConsole>;

  beforeEach(() => (spies = stubConsole()));
  afterEach(() => Object.values(spies).forEach((spy) => spy.mockRestore()));

  it('INFO should call console.info with a formatted message', () => {
    logger.INFO(msg);

    expect(spies.info).toHaveBeenCalledOnce();
    const output = spies.info.mock.calls[0][0] as string;
    expect(output).toContain('INFO');
    expect(output).toContain(msg);
  });

  it('WARN should call console.warn with a formatted message', () => {
    logger.WARN(msg);

    expect(spies.warn).toHaveBeenCalledOnce();
    const output = spies.warn.mock.calls[0][0] as string;
    expect(output).toContain('WARN');
    expect(output).toContain(msg);
  });

  it('ERROR should call console.error with a formatted message', () => {
    logger.ERROR(msg);

    expect(spies.error).toHaveBeenCalledOnce();
    const output = spies.error.mock.calls[0][0] as string;
    expect(output).toContain('ERROR');
    expect(output).toContain(msg);
  });

  it('SUCCESS should call console.log with a formatted message', () => {
    logger.SUCCESS(msg);

    expect(spies.log).toHaveBeenCalledOnce();
    const output = spies.log.mock.calls[0][0] as string;
    expect(output).toContain('SUCCESS');
    expect(output).toContain(msg);
  });

  it('logs DEBUG when env is not "pro"', () => {
    const debugLogger = new Logger('dev');
    debugLogger.DEBUG(msg);

    expect(spies.debug).toHaveBeenCalledOnce();
    const output = spies.debug.mock.calls[0][0] as string;
    expect(output).toContain('DEBUG');
    expect(output).toContain(msg);
  });

  it('does NOT log DEBUG in production env', () => {
    const notLogger = new Logger('pro');
    notLogger.DEBUG(msg);

    expect(spies.debug).not.toHaveBeenCalled();
  });
});
