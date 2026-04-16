# Roadmap projet — Creatyss

## Cadre

Cette roadmap est une vue canonique de haut niveau.
Elle cadre la trajectoire du projet sans décrire une architecture future non validée.

## Invariants

- boutique artisanale premium
- local-first (Docker / Docker Compose)
- Next.js App Router + TypeScript strict
- PostgreSQL / Prisma
- admin simple pour non-tech
- séparation claire domaine / orchestration / UI

## Socle actuel

Le socle actuel couvre la base documentaire et produit nécessaire pour avancer de manière stable :

- doctrine centralisée (`AGENTS.md`, `docs/architecture/`, `docs/domains/`)
- environnement local Docker
- base e-commerce initiale avec catalogue, admin et front public
- seed local avec import historique ponctuel possible

## V1 obligatoire

La V1 doit garantir un parcours e-commerce exploitable de bout en bout avec :

- catalogue produits (produits, variantes, images, catégories)
- homepage éditable
- blog éditable
- admin simple et robuste pour les opérations courantes
- cohérence des domaines coeur et des frontières documentées

## Lots prioritaires

### Phase 1 — Stabilisation du socle

- fiabiliser la cohérence documentaire et les liens internes
- consolider les frontières des domaines coeur et transverses critiques
- réduire la dette structurelle qui fragilise la maintenabilité

### Phase 2 — V1 métier

- finaliser les flux admin/public indispensables à l’exploitation
- sécuriser les invariants catalogue/commande/prix/disponibilité
- garantir une UX admin claire pour les opérations non-tech

### Phase 3 — Robustesse et qualité

- renforcer typecheck, lint et validations ciblées
- consolider les contrôles de non-régression sur les flux critiques
- fiabiliser l’exploitation locale et la reproductibilité Docker

## Lots différés

### Commerce étendu (plus tard)

- retours
- fidélité
- cartes cadeaux
- recommandations

### Capacités optionnelles (plus tard)

- enrichissements marketing avancés
- intégrations additionnelles non bloquantes pour la V1
- optimisations UX non critiques

## Hors périmètre assumé

Sans validation explicite, cette roadmap exclut :

- multi-tenant
- site-factory
- microservices
- IA produit
- analytics complexes
- multi-langue
- multi-devise
- moteur de règles complexe
