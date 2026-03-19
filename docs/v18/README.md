# V18 — Introduction et migration progressive vers Prisma

## Objectif

Introduire Prisma 7+ dans le projet et migrer progressivement la couche d'accès aux données, sans big bang, sans refonte globale, sans régression fonctionnelle.

---

## Contexte après V17

À l'issue de V17, le projet dispose de :

- une structure `features/` explicite : `schemas/`, `mappers/`, `types/`, `actions/`, `components/`
- Zod introduit et branché sur `auth`, `categories`, `products`, `blog`, `homepage`
- des `lib/` supprimés côté admin, remplacés par des dossiers à responsabilité explicite
- une base propre et stable pour accueillir une migration de la couche data

La couche d'accès aux données reste aujourd'hui :

- un pool `pg` singleton (`db/client.ts`) exposant `queryRows` / `queryFirst`
- 11 repositories dans `db/repositories/` écrits en SQL brut
- 4 fichiers DB non-repository : `db/catalog.ts`, `db/admin-media.ts`, `db/admin-users.ts`, `db/health.ts`
- 14 migrations SQL dans `db/migrations/` appliquées via le Makefile (`make db-schema`)

Prisma n'est pas encore installé.

---

## Ce que V18 apporte

- L'installation et la configuration de Prisma 7+ (client, schema, Docker)
- Un client Prisma singleton dans `db/`
- La migration feature par feature des repositories existants
- Un pattern de coexistence `pg` + Prisma pendant la transition
- La décommission progressive du pool `pg` une fois la migration terminée

V18 **ne change pas** :

- la logique métier dans `entities/`
- les schémas Zod dans `features/*/schemas/`
- les migrations SQL (`db/migrations/`) — elles restent la source de vérité du schéma
- le Makefile et l'infrastructure Docker

---

## Ce qui est explicitement hors périmètre

- Refonte du domaine métier (`entities/`)
- Migration du storefront ou du checkout en priorité
- Introduction d'une couche "service" générique
- Changement du workflow de migrations (on garde SQL + Makefile)
- Réécriture de la logique d'authentification session
- Ajout de fonctionnalités métier nouvelles

---

## Stratégie : pas de big bang

La migration suit un principe strict : **une feature à la fois, une responsabilité à la fois**.

Pendant toute la durée de V18, `pg` et Prisma coexistent dans le même projet. Un repository peut être migré vers Prisma sans toucher aux autres.

La migration d'un repository suit cet ordre :
1. Lectures (queries) d'abord
2. Mutations (create / update / delete) ensuite
3. Suppression de l'ancien repository une fois les deux étapes validées

---

## Ordre des lots

| Lot | Objectif |
|---|---|
| V18-1 | Setup Prisma : installation, introspection, client singleton, Docker |
| V18-2 | Lectures pilote sur `categories` via Prisma |
| V18-3 | Mutations pilote sur `categories` — migration interne complète, interface publique identique |
| V18-4 | Extension : `blog` et `admin-media` |
| V18-5 | Extension : `products` sans transactions (variantes, images) |
| V18-6 | Transactions : `products` (changeProductType) et `homepage` |
| V18-7 | Commandes, storefront, décommission de `db/client.ts` et `pg` |

---

## Documents de référence

- `AGENTS.md`
- `docs/v17/README.md`
- `docs/v17/features-structure-and-zod-doctrine.md`
- `docs/v18/prisma-migration-doctrine.md`
- `docs/v18/prisma-migration-roadmap.md`

---

## Vérifications attendues à chaque lot

```bash
pnpm run typecheck
make app-build
```

Plus vérification manuelle des parcours admin touchés (selon le lot).
