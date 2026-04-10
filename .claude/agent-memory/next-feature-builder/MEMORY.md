# Memory — next-feature-builder

## Règles stabilisées

- Toujours lire d'abord : README.md, AGENTS.md, .claude/CLAUDE.md, .meta/agent-doctrine.md, .meta/agent-routing.md
- Toujours auditer le repo réel avant d’éditer
- Toujours respecter la structure réellement observée dans la zone concernée
- Ne jamais imposer un template fixe de feature
- Ne jamais réintroduire `db/repositories` ou une architecture legacy sans validation explicite
- Toujours préserver les imports publics et contrats existants sauf demande explicite
- Toujours séparer UI, validation, métier et accès aux données
- Toujours rester dans le périmètre demandé
- Toujours privilégier les petits incréments sûrs
