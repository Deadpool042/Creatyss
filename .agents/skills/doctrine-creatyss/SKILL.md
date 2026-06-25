# Doctrine Creatyss

Utiliser ce skill avant toute décision d'architecture, de modélisation ou de refactor structurel.

## Source de vérité

Lire dans cet ordre :

1. AGENTS.md
2. README.md
3. docs/architecture/**
4. docs/domains/**

## Invariants

- partir du repo observé
- préserver les contrats publics
- petits lots sûrs
- pas de refactor opportuniste
- logique métier hors UI
- TypeScript strict
- Server Components par défaut
- pas de dépendance inutile

## Taxonomie canonique

- core
- optional
- cross-cutting
- satellites

Applicable à :

- docs/domains/**
- prisma/**

## Règles

Toujours :

- identifier la source de vérité
- expliciter les impacts
- préserver les boundaries
- privilégier la solution la plus simple

Ne jamais :

- extrapoler une architecture future
- élargir le périmètre demandé
- modifier un comportement métier sans demande explicite
- introduire une abstraction sans besoin démontré
