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
export {
  PromptInjectionDefense,
  promptInjectionMiddleware,
  promptInjectionMiddlewareSync,
  createPromptInjectionMiddleware,
  extractInput,
} from './prompt-injection-defense';
export { PromptInjectionDefense as default } from './prompt-injection-defense';
