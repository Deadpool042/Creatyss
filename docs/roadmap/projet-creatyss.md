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
- pas de dérive vers une plateforme générique ou une site-factory

## Socle actuel

Le projet dispose déjà d’un socle exploitable pour avancer proprement :

- doctrine centralisée (`AGENTS.md`, `docs/architecture/`, `docs/domains/`)
- environnement local Docker
- base front/admin existante
- modèle initial catalogue / contenu / admin
- base documentaire de pilotage
- seed local avec import historique ponctuel possible

## Phase 1 — Stabilisation du socle

Objectif : fiabiliser la base avant extension fonctionnelle.

Priorités :

- corriger les incohérences documentaires et structurelles bloquantes
- consolider les frontières des domaines coeur et transverses critiques
- réduire la dette de maintenabilité la plus risquée
- stabiliser la gouvernance doc / architecture / repo

## Phase 2 — V1 catalogue, contenu et admin

Objectif : garantir le coeur éditorial et catalogue de la boutique.

Périmètre :

- produits
- variantes
- images
- catégories
- homepage éditable
- blog éditable
- admin simple et robuste pour les opérations courantes
- SEO de base

## Phase 3 — V1 commerce transactionnel minimal

Objectif : rendre la boutique exploitable de bout en bout sur son flux métier principal.

Périmètre :

- panier
- checkout
- commandes
- clients
- prix
- disponibilité
- validations métier minimales sur les flux critiques

## Phase 4 — Robustesse, qualité et exploitation

Objectif : rendre le socle plus fiable au quotidien.

Périmètre :

- typecheck, lint et validations ciblées
- non-régression sur les flux critiques
- exploitation locale reproductible
- sécurité admin et durcissement des flux sensibles
- maintenance plus prévisible

## Phase 5 — Commerce étendu (plus tard)

À ouvrir uniquement sur besoin explicite :

- retours
- cartes cadeaux
- fidélité
- expédition avancée
- taxation plus riche
- extensions de paiement non indispensables au socle

## Phase 6 — Capacités optionnelles (plus tard)

À ouvrir uniquement si elles restent bornées et sans contamination du coeur :

- recommandations
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
