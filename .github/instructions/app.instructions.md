---
applyTo: "app/**/*.ts,app/**/*.tsx,features/**/*.ts,features/**/*.tsx"
---

# Next.js and feature implementation

- Use Server Components by default.
- Use Client Components only when interactivity or browser APIs require them.
- Use Server Actions only when they clearly simplify the flow.
- Keep routes and layouts simple unless a stronger structure is justified.
- Do not introduce parallel routes by default.
- Prefer nested layouts only when they provide a concrete benefit.
- Keep business rules out of route files and presentation components.
- Respect the current repository structure and imports already used in the surrounding area.
- Prefer small local extractions over public redesigns.
