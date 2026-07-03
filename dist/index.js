"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = exports.extractInput = exports.createPromptInjectionMiddleware = exports.promptInjectionMiddlewareSync = exports.promptInjectionMiddleware = exports.PromptInjectionDefense = void 0;
/**
 * @temple/prompt-injection-defense
 *
 * Temple immune layer: prompt-injection / jailbreak detection. Owned and
 * stewarded by the Immune service; consumed by AI-input services as
 * in-process middleware:
 *
 *   import { promptInjectionMiddleware } from '@temple/prompt-injection-defense';
 *   app.use('/api/ai', promptInjectionMiddleware);
 */
var prompt_injection_defense_1 = require("./prompt-injection-defense");
Object.defineProperty(exports, "PromptInjectionDefense", { enumerable: true, get: function () { return prompt_injection_defense_1.PromptInjectionDefense; } });
Object.defineProperty(exports, "promptInjectionMiddleware", { enumerable: true, get: function () { return prompt_injection_defense_1.promptInjectionMiddleware; } });
Object.defineProperty(exports, "promptInjectionMiddlewareSync", { enumerable: true, get: function () { return prompt_injection_defense_1.promptInjectionMiddlewareSync; } });
Object.defineProperty(exports, "createPromptInjectionMiddleware", { enumerable: true, get: function () { return prompt_injection_defense_1.createPromptInjectionMiddleware; } });
Object.defineProperty(exports, "extractInput", { enumerable: true, get: function () { return prompt_injection_defense_1.extractInput; } });
var prompt_injection_defense_2 = require("./prompt-injection-defense");
Object.defineProperty(exports, "default", { enumerable: true, get: function () { return prompt_injection_defense_2.PromptInjectionDefense; } });
