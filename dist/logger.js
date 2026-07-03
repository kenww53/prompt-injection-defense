"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
/**
 * Self-contained, zero-dependency logger so the package carries no
 * service-specific logging dependency. Plain structured console output.
 */
exports.logger = {
    info: (msg, meta) => console.log(`[prompt-injection-defense] ${msg}`, meta ?? ''),
    warn: (msg, meta) => console.warn(`[prompt-injection-defense] ${msg}`, meta ?? ''),
    debug: (msg, meta) => { if (process.env.DEBUG)
        console.debug(`[prompt-injection-defense] ${msg}`, meta ?? ''); },
    error: (msg, meta) => console.error(`[prompt-injection-defense] ${msg}`, meta ?? ''),
};
