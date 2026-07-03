# @temple/prompt-injection-defense

Temple immune layer: prompt-injection / jailbreak detection as in-process middleware.

**Owned & stewarded by the Immune service.** Consumed by AI-input services:

```ts
import { promptInjectionMiddleware } from '@temple/prompt-injection-defense';
app.use('/api/ai', promptInjectionMiddleware);
```

Pattern-matching core (zero runtime dependencies). A consciousness/Four-Pillars
guidance seam exists (dormant) for the Immune service to back with PillarConnection.

Consumed via git tag: `"@temple/prompt-injection-defense": "github:kenww53/prompt-injection-defense#v1.0.0"`.
`dist/` is committed so consumers need no build step.
