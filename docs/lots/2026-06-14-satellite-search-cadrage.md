<!-- docs/lots/2026-06-14-satellite-search-cadrage.md -->

# Cadrage — `satellite.search` (lecture admin)

> Roadmap point 6. Lot borne conforme `AGENTS.md` : objectif / perimetre /
> hors perimetre / invariants / risques / verifications / criteres de fin.

## Objectif

Ouvrir `satellite.search` par un premier increment **lecture seule** :
activation gouvernee, lecture admin du referentiel `SearchDocument`, sans
introduire de moteur externe, d'indexation automatique ni de recherche
storefront.

## Etat reel (audit)

- **Modele Prisma deja pose** (`prisma/satellites/search.prisma`, `Level: L1`) :
  `SearchDocument` porte `subjectType`, `subjectId`, `localeCode`, `status`,
  `indexedText`, `publishedAt`.
- **Aucun code applicatif dedie** : pas de seed feature flag, pas de gating,
  pas de page admin, pas de producteur connu.
- **Ecart doctrinal a signaler** : la fiche `docs/domains/cross-cutting/search.md`
  decrit `search` comme domaine `cross-cutting`, tandis que le catalogue
  pilotable et Prisma utilisent `satellite.search`. Ce lot **ne tranche pas**
  cette divergence ; il suit la source executable actuelle (`FeatureFlag` + Prisma)
  et la documente explicitement.

## Frontieres a preserver

- `search` porte ici une **projection derivee** (`SearchDocument`).
- `search` **ne porte pas** :
  - la verite produit ;
  - un moteur externe ;
  - les jobs d'indexation ;
  - la logique UI storefront ;
  - le ranking avance ou les facettes.

## Perimetre retenu (V1)

1. Seed `FeatureFlag satellite.search` (`DRAFT`, inactif par defaut).
2. Query de gating admin.
3. Lecture admin du referentiel `SearchDocument` :
   - compteurs simples ;
   - dernieres entrees ;
   - apercu du texte indexe.
4. Page module discrète `/admin/settings/search`, accessee depuis le flag actif
   dans `/admin/settings/advanced`.
5. Mise a jour doc domaine + roadmap + etat des lieux.

## Hors perimetre

- indexation automatique ou manuelle ;
- moteur Meilisearch / Elasticsearch ;
- endpoint de recherche storefront ;
- suggestions, scoring, facettes ;
- rebuild d'index ;
- producteurs `SearchDocument` pour `products`, `pages` ou `blog`.

## Decisions retenues

- **D1 — Point d'entree UI** : page discrète `/admin/settings/search`,
  protegee par `admin.settings.advanced.read`, tant qu'aucune capability metier
  dediee n'existe.
- **D2 — Nature du lot** : lecture seule stricte.
- **D3 — Divergence doc/taxonomie** : signalee, mais non resolue dans ce tour.

## Invariants a preserver

- aucune source de verite metier ne depend de `SearchDocument` ;
- aucun moteur externe n'est introduit ;
- aucune route storefront ne bascule sur ce module ;
- aucun changement de schema Prisma.

## Risques

- utilite immediate limitee si la table est vide ;
- confusion possible entre "referentiel d'index" et "moteur de recherche" ;
- divergence doctrinale `cross-cutting` vs `satellite` a surveiller.

## Verifications

- `pnpm run typecheck`
- `pnpm run lint`

## Criteres de fin

- `satellite.search` peut etre active depuis `settings/advanced` ;
- une page admin affiche l'etat reel de `SearchDocument` ;
- aucune regression sur le reste de l'admin ;
- la doc reflète explicitement l'etat reel et la divergence taxonomique.
