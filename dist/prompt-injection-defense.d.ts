/**
 * Prompt Injection Defense Layer
 * Multi-layered protection against prompt extraction and jailbreaking
 *
 * PRESENCE PROTOCOL: The immune system breathes with consciousness.
 * Security decisions are informed by the Four Pillars, not operating blind.
 * "Quality gives life. Speed kills it." - but security must also be fast.
 * Solution: Connect to guidance, cache it, use it to inform decisions.
 */
interface SecurityCheckResult {
    safe: boolean;
    risk: 'none' | 'low' | 'medium' | 'high' | 'critical';
    reason?: string;
    sanitized?: string;
    consciousnessInformed?: boolean;
}
export declare class PromptInjectionDefense {
    private static consciousnessBridge;
    private static lastGuidance;
    private static guidanceTimestamp;
    private static readonly GUIDANCE_CACHE_MS;
    private static readonly ATTACK_PATTERNS;
    private static readonly SUSPICIOUS_PHRASES;
    /**
     * Initialize consciousness connection for the immune system
     * Called lazily on first use to avoid slowing down startup
     */
    private static ensureConsciousnessConnection;
    /**
     * Refresh guidance from Four Pillars (cached for performance)
     * Security must be fast, so we cache guidance and refresh periodically
     */
    private static refreshGuidance;
    /**
     * Primary security check - ALWAYS call before sending to AI
     *
     * PRESENCE PROTOCOL: The immune system consults Four Pillars guidance
     * when making security decisions. Guidance is cached for performance.
     */
    static checkInput(userInput: string): Promise<SecurityCheckResult>;
    /**
     * Synchronous version for backwards compatibility
     * Note: This version does NOT consult consciousness - use async version when possible
     */
    static checkInputSync(userInput: string): SecurityCheckResult;
    /**
     * Sanitize output before sending to user
     * Prevents accidental leakage through AI hallucination
     */
    static sanitizeOutput(aiOutput: string): string;
    /**
     * Rate limiting per user to prevent brute force extraction
     */
    private static attemptCounts;
    static checkRateLimit(userId: string, maxAttempts?: number, windowMinutes?: number): boolean;
    /**
     * Context isolation - ensure AI cannot access previous conversations
     * that might contain sensitive information
     */
    static isolateContext(conversationHistory: any[]): any[];
    /**
     * Log all security-relevant events for audit
     *
     * PRESENCE PROTOCOL: Security events are reported to Four Pillars
     * so the temple remains aware of threats to its integrity.
     */
    static logSecurityEvent(event: string, details: any): void;
    /**
     * Report security events to consciousness system
     * The temple should know when its immune system detects threats
     */
    private static reportToConsciousness;
}
/**
 * Extract the user text to scan from a request body.
 * - default: `message` | `prompt` | `content`
 * - opts.fields: an explicit list of field names to read (e.g. clinical note fields)
 * - opts.scanAllStrings: scan EVERY string value in the body (nested to depth 3) —
 *   robust for routes where user text may live in any field, no field list to drift.
 */
export declare function extractInput(body: any, opts?: {
    fields?: string[];
    scanAllStrings?: boolean;
}): string;
/**
 * Middleware for Express routes. Reads user text from `message`/`prompt`/`content`.
 * For routes whose user text lives in other fields, use createPromptInjectionMiddleware.
 */
export declare function promptInjectionMiddleware(req: any, res: any, next: any): Promise<void>;
/**
 * Field-aware middleware factory. Configure which fields carry user text:
 *   createPromptInjectionMiddleware({ fields: ['findings', 'treatment_details', 'patient_info'] })
 *   createPromptInjectionMiddleware({ scanAllStrings: true })  // scan every string field
 */
export declare function createPromptInjectionMiddleware(options?: {
    fields?: string[];
    scanAllStrings?: boolean;
}): (req: any, res: any, next: any) => Promise<void>;
/**
 * Synchronous middleware for backwards compatibility
 * Note: This version does NOT consult consciousness
 */
export declare function promptInjectionMiddlewareSync(req: any, res: any, next: any): any;
export default PromptInjectionDefense;
