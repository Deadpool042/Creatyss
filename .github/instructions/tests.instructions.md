---
applyTo: "tests/**/*.ts,tests/**/*.tsx,tests/**/*.js,tests/**/*.mjs,vitest.config.ts,playwright.config.ts"
---

# Testing instructions

- Prefer focused tests tied to real repository behavior.
- Do not introduce broad or brittle tests without clear value.
- Keep tests aligned with the actual domain and UI contracts.
- Cover critical flows, validation, and regressions relevant to the task.
- Avoid snapshot-heavy or ornamental tests unless they solve a real stability need.
