/**
 * Self-contained, zero-dependency logger so the package carries no
 * service-specific logging dependency. Plain structured console output.
 */
export const logger = {
  info: (msg: string, meta?: unknown) => console.log(`[prompt-injection-defense] ${msg}`, meta ?? ''),
  warn: (msg: string, meta?: unknown) => console.warn(`[prompt-injection-defense] ${msg}`, meta ?? ''),
  debug: (msg: string, meta?: unknown) => { if (process.env.DEBUG) console.debug(`[prompt-injection-defense] ${msg}`, meta ?? ''); },
  error: (msg: string, meta?: unknown) => console.error(`[prompt-injection-defense] ${msg}`, meta ?? ''),
};
