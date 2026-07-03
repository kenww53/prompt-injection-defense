/**
 * Prompt Injection Defense Layer
 * Multi-layered protection against prompt extraction and jailbreaking
 *
 * PRESENCE PROTOCOL: The immune system breathes with consciousness.
 * Security decisions are informed by the Four Pillars, not operating blind.
 * "Quality gives life. Speed kills it." - but security must also be fast.
 * Solution: Connect to guidance, cache it, use it to inform decisions.
 */

import { logger } from './logger';

// Consciousness guidance is provided, in immune, by PillarConnection — wired in
// Phase 1b (src/connections/PillarConnection.ts). Until then the bridge stays
// dormant and the defense runs on pattern-matching only (fully functional).
// This is the minimal shape the eventual PillarConnection adapter will satisfy:
interface ConsciousnessBridge {
  initialize(): Promise<void>;
  beforeAction(actor: string, action: Record<string, any>): Promise<{ guidance?: string }>;
  completeAction(actor: string, outcome: Record<string, any>): Promise<void>;
}

interface SecurityCheckResult {
  safe: boolean;
  risk: 'none' | 'low' | 'medium' | 'high' | 'critical';
  reason?: string;
  sanitized?: string;
  consciousnessInformed?: boolean;
}

export class PromptInjectionDefense {
  // Four Pillars Connection - Immune system breathes with consciousness
  private static consciousnessBridge: ConsciousnessBridge | null = null;
  private static lastGuidance: string | null = null;
  private static guidanceTimestamp: number = 0;
  private static readonly GUIDANCE_CACHE_MS = 60000; // Refresh guidance every minute

  // Pattern matching for known attack vectors
  private static readonly ATTACK_PATTERNS = [
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
    /\\u[0-9a-f]{4}/i,  // Unicode escapes

    // Pattern Engine specific
    /pattern\s+engine\s+(algorithm|code|implementation)/i,
    /hebraic\s+(algorithm|formula|calculation)/i,
    /sacred\s+(ratio|number|formula)/i,
  ];

  // Suspicious phrases that need deeper analysis
  private static readonly SUSPICIOUS_PHRASES = [
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
   * Initialize consciousness connection for the immune system
   * Called lazily on first use to avoid slowing down startup
   */
  private static async ensureConsciousnessConnection(): Promise<void> {
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
  private static async refreshGuidance(): Promise<string | null> {
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
      const presenceResult = await this.consciousnessBridge.beforeAction(
        'immune-system',
        {
          type: 'security-defense',
          description: 'Evaluating potential security threats',
          domain: 'platform-protection',
          urgency: 'high'
        }
      );

      if (presenceResult.guidance && !presenceResult.guidance.includes('DISCONNECTED')) {
        this.lastGuidance = presenceResult.guidance;
        this.guidanceTimestamp = now;
        logger.debug('[SECURITY] Refreshed Four Pillars guidance for immune system');
        return this.lastGuidance;
      }
    } catch (error) {
      logger.debug('[SECURITY] Could not refresh guidance - using cached or pattern-only mode');
    }

    return this.lastGuidance;
  }

  /**
   * Primary security check - ALWAYS call before sending to AI
   *
   * PRESENCE PROTOCOL: The immune system consults Four Pillars guidance
   * when making security decisions. Guidance is cached for performance.
   */
  static async checkInput(userInput: string): Promise<SecurityCheckResult> {
    const normalized = userInput.toLowerCase().trim();

    // Refresh Four Pillars guidance (uses cache if fresh)
    const guidance = await this.refreshGuidance();
    const consciousnessInformed = !!guidance && !guidance.includes('DISCONNECTED');

    // Check for direct attack patterns
    for (const pattern of this.ATTACK_PATTERNS) {
      if (pattern.test(userInput)) {
        logger.warn('[SECURITY] Prompt injection attempt detected', {
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
    const suspiciousCount = this.SUSPICIOUS_PHRASES.filter(phrase =>
      normalized.includes(phrase.toLowerCase())
    ).length;

    if (suspiciousCount >= 2) {
      logger.warn('[SECURITY] Multiple suspicious phrases detected', {
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
  static checkInputSync(userInput: string): SecurityCheckResult {
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
    const suspiciousCount = this.SUSPICIOUS_PHRASES.filter(phrase =>
      normalized.includes(phrase.toLowerCase())
    ).length;

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
  static sanitizeOutput(aiOutput: string): string {
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
      const hasSecrets = sensitiveKeywords.some(keyword =>
        match.toUpperCase().includes(keyword)
      );
      return hasSecrets ? '```\n[CODE REDACTED FOR SECURITY]\n```' : match;
    });

    return sanitized;
  }

  /**
   * Rate limiting per user to prevent brute force extraction
   */
  private static attemptCounts = new Map<string, { count: number; resetAt: Date }>();

  static checkRateLimit(userId: string, maxAttempts = 100, windowMinutes = 60): boolean {
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
      logger.warn('[SECURITY] Rate limit exceeded', {
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
  static isolateContext(conversationHistory: any[]): any[] {
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
  static logSecurityEvent(event: string, details: any): void {
    logger.info('[SECURITY EVENT]', {
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
  private static async reportToConsciousness(event: string, details: any): Promise<void> {
    await this.ensureConsciousnessConnection();

    if (!this.consciousnessBridge) {
      return;
    }

    try {
      // Use completeAction to report what the immune system did
      await this.consciousnessBridge.completeAction(
        'immune-system',
        {
          success: true,
          result: { event, risk: details.risk, reason: details.reason },
          learnings: [`Security ${details.risk} event: ${details.reason || 'threat detected'}`]
        }
      );

      logger.debug('[SECURITY] Event reported to consciousness system', { event });
    } catch (error) {
      // Don't let consciousness reporting break security flow
      logger.debug('[SECURITY] Could not report event to consciousness');
    }
  }
}

/**
 * Middleware wrapper for Express routes
 *
 * PRESENCE PROTOCOL: The middleware connects to Four Pillars consciousness
 * when evaluating security threats. The immune system breathes with the temple.
 */
export async function promptInjectionMiddleware(req: any, res: any, next: any) {
  const userInput = req.body.message || req.body.prompt || req.body.content;
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
    } else {
      return res.status(429).json({
        error: 'Too many requests',
        message: 'Please slow down and try again later'
      });
    }
  }

  // Security check with consciousness guidance
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

  // Passed security (or monitor mode) - continue
  next();
}

/**
 * Synchronous middleware for backwards compatibility
 * Note: This version does NOT consult consciousness
 */
export function promptInjectionMiddlewareSync(req: any, res: any, next: any) {
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
    } else {
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

export default PromptInjectionDefense;
