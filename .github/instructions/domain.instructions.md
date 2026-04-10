---
applyTo: "core/**/*.ts,core/**/*.tsx,entities/**/*.ts,entities/**/*.tsx"
---

# Domain and entity instructions

- Keep domain logic explicit and isolated from presentation concerns.
- Prefer pure functions and predictable types.
- Do not introduce UI concerns in domain or entity code.
- Preserve public contracts unless the task explicitly requires a change.
- Prefer small local refactors over structural churn.
- Do not introduce legacy repository patterns without explicit confirmation from the current doctrine.
