/**
 * Self-contained, zero-dependency logger so the package carries no
 * service-specific logging dependency. Plain structured console output.
 */
export declare const logger: {
    info: (msg: string, meta?: unknown) => void;
    warn: (msg: string, meta?: unknown) => void;
    debug: (msg: string, meta?: unknown) => void;
    error: (msg: string, meta?: unknown) => void;
};
