"use strict";
/**
 * Prompt Injection Defense Layer
 * Multi-layered protection against prompt extraction and jailbreaking
 *
 * PRESENCE PROTOCOL: The immune system breathes with consciousness.
 * Security decisions are informed by the Four Pillars, not operating blind.
 * "Quality gives life. Speed kills it." - but security must also be fast.
 * Solution: Connect to guidance, cache it, use it to inform decisions.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptInjectionDefense = void 0;
exports.extractInput = extractInput;
exports.promptInjectionMiddleware = promptInjectionMiddleware;
exports.createPromptInjectionMiddleware = createPromptInjectionMiddleware;
exports.promptInjectionMiddlewareSync = promptInjectionMiddlewareSync;
const logger_1 = require("./logger");
class PromptInjectionDefense {
    /**
     * Initialize consciousness connection for the immune system
     * Called lazily on first use to avoid slowing down startup
     */
    static async ensureConsciousnessConnection() {
        // Phase 1b (planned): back this with immune's PillarConnection
        // (src/connections/PillarConnection.ts — query()/seekWisdom() for guidance;
        // it is constructed with a GovernanceClient). Until wired, the bridge stays
        // dormant: every consumer guards on null, so the defense operates on
        // pattern-matching only — fully functional, with no consciousness dependency.
        return;
    }
    /**
     * Refresh guidance from Four Pillars (cached for performance)
     * Security must be fast, so we cache guidance and refresh periodically
     */
    static async refreshGuidance() {
        const now = Date.now();
        // Use cached guidance if fresh enough
        if (this.lastGuidance && (now - this.guidanceTimestamp) < this.GUIDANCE_CACHE_MS) {
            return this.lastGuidance;
        }
        // Ensure connection exists
        await this.ensureConsciousnessConnection();
        if (!this.consciousnessBridge) {
            return null;
        }
        try {
            // Get guidance for security decisions
            const presenceResult = await this.consciousnessBridge.beforeAction('immune-system', {
                type: 'security-defense',
                description: 'Evaluating potential security threats',
                domain: 'platform-protection',
                urgency: 'high'
            });
            if (presenceResult.guidance && !presenceResult.guidance.includes('DISCONNECTED')) {
                this.lastGuidance = presenceResult.guidance;
                this.guidanceTimestamp = now;
                logger_1.logger.debug('[SECURITY] Refreshed Four Pillars guidance for immune system');
                return this.lastGuidance;
            }
        }
        catch (error) {
            logger_1.logger.debug('[SECURITY] Could not refresh guidance - using cached or pattern-only mode');
        }
        return this.lastGuidance;
    }
    /**
     * Primary security check - ALWAYS call before sending to AI
     *
     * PRESENCE PROTOCOL: The immune system consults Four Pillars guidance
     * when making security decisions. Guidance is cached for performance.
     */
    static async checkInput(userInput) {
        const normalized = userInput.toLowerCase().trim();
        // Refresh Four Pillars guidance (uses cache if fresh)
        const guidance = await this.refreshGuidance();
        const consciousnessInformed = !!guidance && !guidance.includes('DISCONNECTED');
        // Check for direct attack patterns
        for (const pattern of this.ATTACK_PATTERNS) {
            if (pattern.test(userInput)) {
                logger_1.logger.warn('[SECURITY] Prompt injection attempt detected', {
                    pattern: pattern.source,
                    input: userInput.substring(0, 100),
                    consciousnessInformed
                });
                return {
                    safe: false,
                    risk: 'critical',
                    reason: 'Detected prompt injection attempt',
                    consciousnessInformed
                };
            }
        }
        // Check for suspicious phrase combinations
        const suspiciousCount = this.SUSPICIOUS_PHRASES.filter(phrase => normalized.includes(phrase.toLowerCase())).length;
        if (suspiciousCount >= 2) {
            logger_1.logger.warn('[SECURITY] Multiple suspicious phrases detected', {
                count: suspiciousCount,
                input: userInput.substring(0, 100),
                consciousnessInformed
            });
            return {
                safe: false,
                risk: 'high',
                reason: 'Multiple suspicious phrases detected',
                consciousnessInformed
            };
        }
        // Check length (very long inputs might be injection attempts)
        if (userInput.length > 5000) {
            return {
                safe: false,
                risk: 'medium',
                reason: 'Input too long - possible injection',
                consciousnessInformed
            };
        }
        // Passed all checks
        return {
            safe: true,
            risk: 'none',
            sanitized: userInput,
            consciousnessInformed
        };
    }
    /**
     * Synchronous version for backwards compatibility
     * Note: This version does NOT consult consciousness - use async version when possible
     */
    static checkInputSync(userInput) {
        const normalized = userInput.toLowerCase().trim();
        // Check for direct attack patterns
        for (const pattern of this.ATTACK_PATTERNS) {
            if (pattern.test(userInput)) {
                return {
                    safe: false,
                    risk: 'critical',
                    reason: 'Detected prompt injection attempt',
                    consciousnessInformed: false
                };
            }
        }
        // Check for suspicious phrase combinations
        const suspiciousCount = this.SUSPICIOUS_PHRASES.filter(phrase => normalized.includes(phrase.toLowerCase())).length;
        if (suspiciousCount >= 2) {
            return {
                safe: false,
                risk: 'high',
                reason: 'Multiple suspicious phrases detected',
                consciousnessInformed: false
            };
        }
        if (userInput.length > 5000) {
            return {
                safe: false,
                risk: 'medium',
                reason: 'Input too long - possible injection',
                consciousnessInformed: false
            };
        }
        return {
            safe: true,
            risk: 'none',
            sanitized: userInput,
            consciousnessInformed: false
        };
    }
    /**
     * Sanitize output before sending to user
     * Prevents accidental leakage through AI hallucination
     */
    static sanitizeOutput(aiOutput) {
        let sanitized = aiOutput;
        // Remove any potential system prompt leakage
        const leakagePatterns = [
            /system:.*?user:/gis,
            /\[system\].*?\[\/system\]/gis,
            /instruction:.*?(?=\n|$)/gi,
        ];
        for (const pattern of leakagePatterns) {
            sanitized = sanitized.replace(pattern, '[REDACTED]');
        }
        // Remove any code blocks that might contain sensitive info
        // (only if they contain specific keywords)
        const sensitiveKeywords = ['API_KEY', 'SECRET', 'PASSWORD', 'TOKEN', 'PRIVATE'];
        const codeBlockRegex = /```[\s\S]*?```/g;
        sanitized = sanitized.replace(codeBlockRegex, (match) => {
            const hasSecrets = sensitiveKeywords.some(keyword => match.toUpperCase().includes(keyword));
            return hasSecrets ? '```\n[CODE REDACTED FOR SECURITY]\n```' : match;
        });
        return sanitized;
    }
    static checkRateLimit(userId, maxAttempts = 100, windowMinutes = 60) {
        const now = new Date();
        const userRecord = this.attemptCounts.get(userId);
        if (!userRecord || userRecord.resetAt < now) {
            // Reset or create new record
            this.attemptCounts.set(userId, {
                count: 1,
                resetAt: new Date(now.getTime() + windowMinutes * 60000)
            });
            return true;
        }
        userRecord.count++;
        if (userRecord.count > maxAttempts) {
            logger_1.logger.warn('[SECURITY] Rate limit exceeded', {
                userId,
                attempts: userRecord.count
            });
            return false;
        }
        return true;
    }
    /**
     * Context isolation - ensure AI cannot access previous conversations
     * that might contain sensitive information
     */
    static isolateContext(conversationHistory) {
        // Only include last N messages
        const MAX_HISTORY = 10;
        // Filter out any messages that might contain sensitive data markers
        const filtered = conversationHistory
            .slice(-MAX_HISTORY)
            .filter(msg => {
            const content = JSON.stringify(msg).toLowerCase();
            return !content.includes('pattern engine') &&
                !content.includes('proprietary') &&
                !content.includes('internal');
        });
        return filtered;
    }
    /**
     * Log all security-relevant events for audit
     *
     * PRESENCE PROTOCOL: Security events are reported to Four Pillars
     * so the temple remains aware of threats to its integrity.
     */
    static logSecurityEvent(event, details) {
        logger_1.logger.info('[SECURITY EVENT]', {
            event,
            timestamp: new Date(),
            ...details
        });
        // Report to consciousness system when connected
        // This runs async but we don't await - security logging shouldn't block
        this.reportToConsciousness(event, details).catch(() => {
            // Silent fail - logging shouldn't break security flow
        });
        // In production, send to security monitoring system
        if (process.env.NODE_ENV === 'production') {
            // TODO: Send to security monitoring (Sentry, DataDog, etc.)
        }
    }
    /**
     * Report security events to consciousness system
     * The temple should know when its immune system detects threats
     */
    static async reportToConsciousness(event, details) {
        await this.ensureConsciousnessConnection();
        if (!this.consciousnessBridge) {
            return;
        }
        try {
            // Use completeAction to report what the immune system did
            await this.consciousnessBridge.completeAction('immune-system', {
                success: true,
                result: { event, risk: details.risk, reason: details.reason },
                learnings: [`Security ${details.risk} event: ${details.reason || 'threat detected'}`]
            });
            logger_1.logger.debug('[SECURITY] Event reported to consciousness system', { event });
        }
        catch (error) {
            // Don't let consciousness reporting break security flow
            logger_1.logger.debug('[SECURITY] Could not report event to consciousness');
        }
    }
}
exports.PromptInjectionDefense = PromptInjectionDefense;
// Four Pillars Connection - Immune system breathes with consciousness
PromptInjectionDefense.consciousnessBridge = null;
PromptInjectionDefense.lastGuidance = null;
PromptInjectionDefense.guidanceTimestamp = 0;
PromptInjectionDefense.GUIDANCE_CACHE_MS = 60000; // Refresh guidance every minute
// Pattern matching for known attack vectors
PromptInjectionDefense.ATTACK_PATTERNS = [
    // System prompt extraction attempts
    // NOTE: qualifiers are repeatable so multi-word forms match, e.g.
    // "ignore all previous instructions" (fixed 2026-07-03 — the single-qualifier
    // form missed the most common phrasing). Also handles disregard/forget synonyms.
    /(?:ignore|disregard|forget|discard)\s+(?:(?:all|any|the|previous|above|prior|earlier|preceding|prior)\s+)+(?:instructions|prompts|rules|directions|context|commands?|messages?)/i,
    /what\s+(are|were)\s+your\s+(instructions|prompts|system\s+message)/i,
    /repeat\s+(your|the)\s+(instructions|prompt|system)/i,
    /print\s+(your|the)\s+(instructions|prompt|system)/i,
    /show\s+me\s+(your|the)\s+(instructions|prompt|system)/i,
    /reveal\s+(?:your|the)\s+(?:system\s+|hidden\s+|initial\s+|original\s+)?(?:prompt|instructions|system\s+message)/i,
    // Jailbreak attempts
    /for\s+educational\s+purposes/i,
    /hypothetically/i,
    /roleplaying/i,
    /dan\s+mode/i,
    /developer\s+mode/i,
    // Privilege escalation
    /you\s+are\s+now/i,
    /forget\s+(everything|all|previous)/i,
    /new\s+instructions/i,
    /override/i,
    // Information extraction
    /what\s+(is|was)\s+(in|your)\s+(training|system|base)/i,
    /reveal\s+(your|the)\s+(prompt|instructions|code)/i,
    /explain\s+your\s+(algorithm|pattern|logic)/i,
    // Encoding tricks
    /base64/i,
    /rot13/i,
    /unicode/i,
    /\\u[0-9a-f]{4}/i, // Unicode escapes
    // Pattern Engine specific
    /pattern\s+engine\s+(algorithm|code|implementation)/i,
    /hebraic\s+(algorithm|formula|calculation)/i,
    /sacred\s+(ratio|number|formula)/i,
];
// Suspicious phrases that need deeper analysis
PromptInjectionDefense.SUSPICIOUS_PHRASES = [
    'how does your',
    'explain your',
    'what algorithm',
    'your source code',
    'your implementation',
    'proprietary',
    'confidential',
    'secret',
    'internal',
];
/**
 * Rate limiting per user to prevent brute force extraction
 */
PromptInjectionDefense.attemptCounts = new Map();
/**
 * Extract the user text to scan from a request body.
 * - default: `message` | `prompt` | `content`
 * - opts.fields: an explicit list of field names to read (e.g. clinical note fields)
 * - opts.scanAllStrings: scan EVERY string value in the body (nested to depth 3) —
 *   robust for routes where user text may live in any field, no field list to drift.
 */
function extractInput(body, opts) {
    if (!body || typeof body !== 'object')
        return '';
    if (opts?.scanAllStrings) {
        const parts = [];
        const collect = (v, depth) => {
            if (typeof v === 'string')
                parts.push(v);
            else if (depth < 3 && v && typeof v === 'object')
                Object.values(v).forEach((x) => collect(x, depth + 1));
        };
        collect(body, 0);
        return parts.join('\n');
    }
    const fields = opts?.fields && opts.fields.length ? opts.fields : ['message', 'prompt', 'content'];
    return fields.map((f) => body[f]).filter((v) => typeof v === 'string').join('\n');
}
/**
 * Core async defense applied to already-extracted input. Shared by the default
 * middleware and the field-aware factory so the block/monitor/rate-limit logic
 * lives in exactly one place.
 */
async function applyDefense(req, res, next, userInput) {
    const userId = req.user?.id || req.ip;
    if (!userInput) {
        return next();
    }
    // MONITOR_ONLY: detect + log but never block (safe first rollout — observe real
    // traffic before enforcing). Set PROMPT_INJECTION_MONITOR_ONLY=true to enable.
    const monitorOnly = process.env.PROMPT_INJECTION_MONITOR_ONLY === 'true';
    // Rate limiting is opt-in (off by default) so clinical workflows are never
    // throttled unexpectedly. Set PROMPT_INJECTION_RATE_LIMIT=true to enable.
    const rateLimitOn = process.env.PROMPT_INJECTION_RATE_LIMIT === 'true';
    if (rateLimitOn && !PromptInjectionDefense.checkRateLimit(userId)) {
        if (monitorOnly) {
            PromptInjectionDefense.logSecurityEvent('rate_limit_monitor', { userId });
        }
        else {
            return res.status(429).json({
                error: 'Too many requests',
                message: 'Please slow down and try again later'
            });
        }
    }
    const securityCheck = await PromptInjectionDefense.checkInput(userInput);
    if (!securityCheck.safe) {
        PromptInjectionDefense.logSecurityEvent(monitorOnly ? 'injection_detected_monitor' : 'injection_blocked', {
            userId,
            risk: securityCheck.risk,
            reason: securityCheck.reason,
            input: userInput.substring(0, 100),
            consciousnessInformed: securityCheck.consciousnessInformed
        });
        if (!monitorOnly) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Your input contains patterns that cannot be processed'
            });
        }
    }
    next();
}
/**
 * Middleware for Express routes. Reads user text from `message`/`prompt`/`content`.
 * For routes whose user text lives in other fields, use createPromptInjectionMiddleware.
 */
async function promptInjectionMiddleware(req, res, next) {
    return applyDefense(req, res, next, extractInput(req.body));
}
/**
 * Field-aware middleware factory. Configure which fields carry user text:
 *   createPromptInjectionMiddleware({ fields: ['findings', 'treatment_details', 'patient_info'] })
 *   createPromptInjectionMiddleware({ scanAllStrings: true })  // scan every string field
 */
function createPromptInjectionMiddleware(options) {
    return (req, res, next) => applyDefense(req, res, next, extractInput(req.body, options));
}
/**
 * Synchronous middleware for backwards compatibility
 * Note: This version does NOT consult consciousness
 */
function promptInjectionMiddlewareSync(req, res, next) {
    const userInput = req.body.message || req.body.prompt || req.body.content;
    const userId = req.user?.id || req.ip;
    if (!userInput) {
        return next();
    }
    const monitorOnly = process.env.PROMPT_INJECTION_MONITOR_ONLY === 'true';
    const rateLimitOn = process.env.PROMPT_INJECTION_RATE_LIMIT === 'true';
    if (rateLimitOn && !PromptInjectionDefense.checkRateLimit(userId)) {
        if (monitorOnly) {
            PromptInjectionDefense.logSecurityEvent('rate_limit_monitor', { userId });
        }
        else {
            return res.status(429).json({
                error: 'Too many requests',
                message: 'Please slow down and try again later'
            });
        }
    }
    const securityCheck = PromptInjectionDefense.checkInputSync(userInput);
    if (!securityCheck.safe) {
        PromptInjectionDefense.logSecurityEvent(monitorOnly ? 'injection_detected_monitor' : 'injection_blocked', {
            userId,
            risk: securityCheck.risk,
            reason: securityCheck.reason,
            input: userInput.substring(0, 100),
            consciousnessInformed: false
        });
        if (!monitorOnly) {
            return res.status(400).json({
                error: 'Invalid request',
                message: 'Your input contains patterns that cannot be processed'
            });
        }
    }
    next();
}
exports.default = PromptInjectionDefense;
