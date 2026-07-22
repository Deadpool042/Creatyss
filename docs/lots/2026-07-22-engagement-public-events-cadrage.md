<!-- docs/lots/2026-07-22-engagement-public-events-cadrage.md -->

# Cadrage — Gestion de marchés (`engagement.public-events`)

> Chantier « gestion de marchés + diffusion marketing », branche
> `feature/engagement-public-events`, plan approuvé
> `humming-swimming-liskov`. Ce document couvre les Lots 1 à 3 (modèle,
> ouverture du module, storefront). Le Lot 4 (diffusion marketing) est traité
> dans un cadrage séparé : `docs/lots/2026-07-22-commerce-marketing-intents-cadrage.md`.

## État actuel

- La page publique `/les-marches` (`app/(public)/les-marches/page.tsx`)
  affichait un texte statique avec un placeholder « Calendrier » sans date
  réelle.
- Un modèle Prisma `PublicEvent` existait déjà, posé mais jamais activé
  (`prisma/optional/engagement/public-events.prisma`, `Feature:
engagement.public-events`, `Level: L2`), sans `FeatureFlag` seedé ni
  entrée `FEATURE_CATALOG`.

## Décisions tranchées (validées avec l'utilisateur)

- SMS hors périmètre — aucune infrastructure de consentement SMS n'existe.
- Pas d'envoi automatique : brouillon `DRAFT` + validation admin, même
  principe que le pipeline éditorial déjà livré.
- Réutilisation du modèle `PublicEvent` existant plutôt que création d'un
  nouveau modèle (plus petit changement fiable).
- `EventRegistration`/`EventReservation` non câblés — seul un indicateur
  informatif (`hasSpecialConditions`, `specialConditionsNote`) est ajouté,
  purement déclaratif, sans logique de blocage ni de capacité.
- Diffusion marketing produits : hors périmètre, cadrage séparé futur.

## Sous-lots

### Lot 1 — Modèle Prisma (extension légère)

- `prisma/optional/engagement/public-events.prisma` : ajout de
  `hasSpecialConditions: Boolean @default(false)` et
  `specialConditionsNote: String?` sur `PublicEvent`.
- `EventRegistration`/`EventReservation` non touchés, laissés non câblés.
- Migration Prisma standard (extension additive, pas de rupture).

### Lot 2 — Ouverture du module (feature flag + admin CRUD)

- **Feature flag** : `prisma/seed/public-events-feature-flag.seed.ts`,
  calqué sur `documents-feature-flag.seed.ts` — non gradué,
  `family: "optional"`, `defaultState: "inactive"`,
  `mutability: "toggleable"`, `scopes: ["store"]`. Câblé dans
  `prisma/seed.ts`.
- **FEATURE_CATALOG** : entrée `engagement.public-events` ajoutée dans
  `features/admin/feature-governance/catalog/feature-catalog.ts`.
- **Guard** : `queryFeatureFlagActive("engagement.public-events")`, pattern
  `is-documents-feature-active.query.ts`.
- **Admin CRUD** : `features/admin/marketing/public-events/`
  (`queries/`, `schemas/`, `actions/`, `services/`, `components/`,
  `shared/`).
- **Route admin** : `app/admin/(protected)/marketing/marches/page.tsx`,
  `[event]/page.tsx`, `nouveau/page.tsx` — garde `featureActive` en tête de
  route.

### Lot 3 — Storefront `/les-marches`

- `features/storefront/content/queries/list-public-marches.query.ts` :
  lecture des `PublicEvent` `status = ACTIVE`, triés par `startsAt`, gated
  par le flag.
- `app/(public)/les-marches/page.tsx` : remplace le placeholder par la
  liste réelle (titre, date, lieu, `specialConditionsNote` si présent).
  Repli sur le placeholder existant si le flag est inactif ou la liste
  vide — pas de régression.

## Hors périmètre confirmé

- SMS (aucune infrastructure de consentement).
- Envoi ou publication automatique sans validation admin.
- Inscriptions/réservations réelles (`EventRegistration`/
  `EventReservation`) — non exposées, non câblées.
- Diffusion marketing sur les produits.
- Toute modification du pipeline `editorial-marketing-intents` existant.

## Bilan d'exécution (2026-07-22)

**Fichiers créés / modifiés (Lots 1-3, Observé — état de la branche
`feature/engagement-public-events` avant merge)** :

- `prisma/optional/engagement/public-events.prisma` (modifié) — ajout
  `hasSpecialConditions`, `specialConditionsNote` sur `PublicEvent`.
- `prisma/seed/public-events-feature-flag.seed.ts` (nouveau) — seed du
  `FeatureFlag engagement.public-events`.
- `prisma/seed.ts` (modifié) — câblage de l'appel au seed ci-dessus.
- `features/admin/feature-governance/catalog/feature-catalog.ts`
  (modifié) — entrée `engagement.public-events`.
- `features/admin/marketing/public-events/` (nouveau répertoire) —
  CRUD admin complet (queries, schemas, actions, services, components).
- `app/admin/(protected)/marketing/marches/` (nouveau répertoire) —
  routes admin (`page.tsx`, `[event]/page.tsx`, `nouveau/page.tsx`).
- `features/storefront/content/queries/list-public-marches.query.ts`
  (nouveau) — lecture publique gated.
- `app/(public)/les-marches/page.tsx` (modifié) — liste réelle + repli
  placeholder.

**Vérifications exécutées** : `pnpm run typecheck` et `pnpm run lint` après
chaque sous-lot (Observé — conforme au contrat de validation
`.claude/CLAUDE.md`, résultats non recopiés ici ; se référer aux runs CI/
locaux de la branche).

**Vérifications non exécutées dans ce lot documentaire** : aucune recette
manuelle navigateur n'a été rejouée pendant la rédaction de ce cadrage
(Lot 5, documentation uniquement) ; `db:validate` non relancé (extension
Prisma mineure déjà validée dans le Lot 1).

**Risques éventuels** : le flag `engagement.public-events` reste non
gradué — toute évolution future vers des niveaux (ex. `basic`/`managed`)
nécessitera un nouveau cadrage, comme pour les autres modules `optional`
non gradués (`platform.notifications`, `platform.integrations`,
`satellite.search`, `satellite.channels`).

## Rattachement roadmap

- `docs/domains/cross-cutting/events.md` : section « Activation partielle
  observée (2026-07-22, `engagement.public-events`) » ajoutée, question
  ouverte sur la part des inscriptions/réservations partiellement levée
  pour ce périmètre.
- `docs/roadmap/2026-06-13-audit-catalogue-modules.md` : nouvelle ligne
  `engagement.public-events` en section 3 (`optional`), compteurs section 4
  mis à jour (32 → 33 modules).
- `docs/roadmap/h4-plateforme-automatisation/README.md` : non modifié —
  ce module ne relève pas du périmètre H4 (webhooks, intégrations,
  channels, search, localisation, IA) ; son rattachement documentaire
  suffit via `docs/domains/cross-cutting/events.md` et le présent cadrage.
  Cf. section « Incohérences détectées » plus bas pour la justification de
  cette décision de non-modification.

## Incohérences documentaires détectées en chemin (signalées, non corrigées si hors périmètre)

- `docs/domains/cross-cutting/events.md` classait le domaine comme
  « activable » et « transverse structurant » sans qu'aucune activation ne
  soit observée avant ce lot. Ce lot corrige partiellement l'écart en
  documentant l'activation réelle, mais le domaine reste loin du
  « structurant » décrit par la fiche doctrine (aucune inscription, aucune
  réservation, aucune capacité). Ce delta doctrine/implémentation est
  normal pour une fiche `docs/domains/**` qui décrit une cible large — il
  est simplement signalé ici pour traçabilité, conformément à la règle de
  preuve (documenté ≠ implémenté).
- Le module `engagement.public-events` a été rattaché à la fiche
  `docs/domains/cross-cutting/events.md` (domaine `events`) alors que son
  admin vit sous `features/admin/marketing/public-events/` et sa route sous
  `app/admin/(protected)/marketing/marches/` (namespace « marketing », pas
  « events »/« engagement »). C'est cohérent avec le choix produit
  (rattacher marketing/diffusion), mais crée une divergence de nommage
  entre la doctrine domaine (`events`) et l'organisation de code
  (`marketing`). Signalé sans correction — un renommage relèverait d'un
  micro-lot dédié si jugé utile, non demandé ici.
