---
name: schema-migration
description: Faire évoluer un schéma ou une migration en respectant strictement la doctrine DB actuelle, les contrats métier, la cohérence Prisma et les frontières du repo.
---

# Source de vérité

Lire d'abord :

1. README.md
2. AGENTS.md
3. .claude/CLAUDE.md
4. .meta/agent-doctrine.md
5. .meta/agent-routing.md

Puis :

- docs/architecture/README.md
- docs/architecture/10-fondations/**
- docs/architecture/20-structure/**
- docs/domains/** pertinents
- la documentation Prisma / schéma réellement utilisée dans le repo

# Règles

- auditer le schéma existant avant modification
- préserver les contrats métier
- éviter les colonnes ambiguës
- vérifier relations, index, uniques, timestamps
- rester compatible avec la doctrine courante
- ne pas élargir la migration hors périmètre
- ne pas supposer une structure legacy si elle n’existe plus

# Vérifications

- cohérence Prisma
- migrations locales
- impacts runtime
- impacts sur types générés
