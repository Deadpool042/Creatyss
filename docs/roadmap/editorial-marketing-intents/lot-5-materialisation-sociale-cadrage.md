<!-- docs/roadmap/editorial-marketing-intents/lot-5-materialisation-sociale-cadrage.md -->

# Cadrage — Lot 5 : matérialisation d'un `MarketingIntent` approuvé en `SocialPublication` DRAFT

## Statut

Cadrage uniquement. Aucun code modifié dans ce lot.

## Verdict

Contrairement au lot 4 (newsletter), ce lot **nécessite une migration Prisma**.

`SocialPublication` (`prisma/optional/engagement/social.prisma`) ne porte
aujourd'hui aucun champ permettant une idempotence par code déterministe :
pas de `code`, pas de contrainte `@@unique` combinant `storeId` et une valeur
dérivable de `MarketingIntent.id`. Le pattern du lot 4 (`code` + contrainte
unique existante + catch-`P2002`) ne peut pas être repris tel quel.

Décision actée : ajouter `code String` + `@@unique([storeId, code])` sur
`SocialPublication`, migration additive strictement calquée sur le modèle
`NewsletterCampaign`. Aucun champ retiré, aucune contrainte existante
modifiée.

Second écart avec le lot 4 : `engagement.social` n'a **aucun `FeatureFlag`
seedé** et **aucune entrée `FEATURE_CATALOG`**, contrairement à
`engagement.newsletter` qui existait déjà avant le lot 4. Décision actée :
seeder `engagement.social` niveau `basic` (même forme que
`newsletter-feature-flag.seed.ts`) et ajouter l'entrée catalogue
correspondante, dans ce même lot.

## État observé

- **Modèle** : `SocialPublication` a un `channelCode: String` obligatoire
  (pas de valeur par défaut), sans lien avec un provider (`provider`/
  `providerReference` restent `null` à ce stade, hors périmètre — cf.
  `docs/domains/cross-cutting/social.md`, « avant les providers externes »).
  Aucune UI admin, aucune action, aucun service n'existe pour ce domaine —
  contrairement à `newsletter` qui avait déjà un CRUD abonnés + campagnes
  avant le lot 4.
- **Policy éditoriale**
  (`features/marketing/editorial-intents/resolve-editorial-marketing-intent-policy.ts`) :
  `SOCIAL` est suggéré pour `BLOG_POST` (`content.blog_post.published`,
  fusion `updated_visible`) **et** pour `HOMEPAGE`
  (`content.homepage.published`, fusion `updated_visible`) — contrairement à
  `NEWSLETTER`, suggéré uniquement pour `BLOG_POST`. Ce lot doit donc gérer
  deux `subjectType` sources, pas un seul.
- **Visibilité admin** : la lacune corrigée au lot 4
  (`list-admin-marketing-intents.query.ts` filtrant désormais
  `status in [PROPOSED, APPROVED]`) profite directement à ce lot — aucune
  correction supplémentaire de la query n'est nécessaire.
- **Doctrine domaine** (`docs/domains/cross-cutting/social.md`) : `social`
  est activable, distinct de `marketing` et `newsletter`, et porte
  explicitement une « cible sociale logique » (`SocialChannelTarget` au
  niveau conceptuel) — pas un contrat provider. `channelCode` doit donc
  rester une valeur interne neutre, jamais un nom de plateforme
  (Meta/Facebook/Instagram restent hors périmètre, cf. README du chantier).

## Décisions proposées

### 1. Migration Prisma

`prisma/optional/engagement/social.prisma` :

```prisma
model SocialPublication {
  ...
  code String
  ...
  @@unique([storeId, code])
}
```

Migration additive (`pnpm run db:migrate` équivalent du projet), aucune
donnée existante affectée (table vide en pratique, module jamais activé).

### 2. Feature gating requis

Nouveau `FeatureFlag` `engagement.social`, niveau `basic` uniquement (pas de
`segmentation`/`automation` à ce stade — rien dans ce lot ne le justifie).
Seed dédié `prisma/seed/social-feature-flag.seed.ts`, même forme que
`newsletter-feature-flag.seed.ts` (`status: "DRAFT"`,
`isEnabledByDefault: false`, `scopeType: "STORE"`). Entrée
`FEATURE_CATALOG` correspondante (`family: "optional"`,
`module: "engagement"`, `mutability: "level_selectable"`, niveau `basic`
uniquement).

### 3. Déclencheur exact

Identique au lot 4 : action serveur explicite depuis l'admin, jamais
automatique. Bouton (« Créer un brouillon social ») visible uniquement sur
un intent `APPROVED` avec `"SOCIAL"` ∈ `suggestedChannels`.

### 4. Mapping champ par champ

| `SocialPublication` | Source                | Règle                                                                 |
| ------------------- | --------------------- | --------------------------------------------------------------------- |
| `storeId`           | `intent.storeId`      | copie directe                                                         |
| `code`              | dérivé de `intent.id` | `mi-${intent.id}` — même idiome que le lot 4                          |
| `channelCode`       | constante             | `"generic"` — cible logique neutre, aucun provider (cf. État observé) |
| `subjectType`       | `intent.subjectType`  | copie directe (`BLOG_POST` ou `HOMEPAGE`)                             |
| `subjectId`         | `intent.subjectId`    | copie directe                                                         |
| `title`             | `contextJson.title`   | fallback `intent.subjectId` si absent                                 |
| `body`              | gabarit minimal       | titre + lien si résolvable (voir ci-dessous)                          |
| `status`            | constante             | `"DRAFT"`                                                             |
| `createdByUserId`   | admin courant         | `requireAuthenticatedAdmin().id`                                      |

Lien source : `BLOG_POST` → `/blog/${contextJson.slug}` (identique au lot 4) ; `HOMEPAGE` → `/` (chemin storefront stable, pas de `slug` en
`contextJson` pour ce `subjectType`). Tout autre `subjectType` : pas de
lien, titre seul (cas non atteignable en pratique, la policy ne suggère
`SOCIAL` que pour ces deux types).

### 5. Idempotence

Même idiome que le lot 4, rendu possible par la migration de ce lot :
`code = "mi-" + intent.id`, `create` puis catch-`P2002` →
`findFirst({ where: { storeId, code } })` → retour de l'existant. Aucune
vérification applicative préalable racy.

### 6. Relation persistée

Aucune, même compromis assumé qu'au lot 4 (section 6 du cadrage lot 4) :
lien dérivable par `code`, pas de FK. Cohérent avec la doctrine `social.md`
(« rattachée explicitement à une source métier lorsqu'elle dérive d'un
objet interne » — la source ici est `subjectType`/`subjectId`, pas
`MarketingIntent` lui-même).

### 7. Erreurs métier

Identique au lot 4 : `not_found`, `invalid_status`, `channel_not_suggested`
(canal `SOCIAL` absent), `engagement.social` inactif/niveau insuffisant.
Fonction totale, jamais d'exception non typée remontée à l'UI.

### 8. Effet d'un archivage ultérieur de l'intent

Aucun, même raisonnement qu'au lot 4 : `SocialPublication` déjà créée
poursuit son propre cycle de vie, indépendamment de l'intent source.

## Cas limites

- Intent `HOMEPAGE` sans `contextJson.slug` (attendu, ce `subjectType` n'en
  a jamais) → lien `/` fixe, pas de branche d'erreur.
- Intent `APPROVED` avec seulement `NEWSLETTER` dans `suggestedChannels`
  (aucun cas réel aujourd'hui vu la policy, mais pas structurellement
  impossible) → bouton social absent, action directe renvoie
  `channel_not_suggested`.
- Double clic / rejeu réseau → couvert par l'idempotence, pas de garde UI
  supplémentaire nécessaire.

## Périmètre du futur lot Code

Fichiers à créer :

- migration Prisma (`code` + `@@unique([storeId, code])` sur
  `SocialPublication`) ;
- `prisma/seed/social-feature-flag.seed.ts` (+ branchement dans le seed
  principal, même point d'entrée que `seedNewsletterFeatureFlag`) ;
- entrée `FEATURE_CATALOG` `engagement.social` ;
- `features/marketing/editorial-intents/materialize-marketing-intent-as-social-publication.service.ts` ;
- `features/admin/marketing/intents/actions/materialize-social-publication.action.ts` ;
- test unitaire du service (nominal, rejeu idempotent, refus non-APPROVED,
  refus canal non suggéré, résolution `P2002` concurrent — même couverture
  que le lot 4).

Fichiers à modifier :

- `features/admin/marketing/intents/components/admin-marketing-intents-list.tsx`
  — second bouton conditionnel, affiché si `"SOCIAL"` ∈
  `suggestedChannels` (indépendant du bouton newsletter existant, un intent
  `BLOG_POST` peut afficher les deux) ;
- `docs/domains/cross-cutting/social.md` — section « Décisions
  d'implémentation » à créer (le domaine n'en a aucune aujourd'hui,
  contrairement à `newsletter.md`) ;
- `docs/roadmap/editorial-marketing-intents/README.md` — statut du lot 5.

## Hors périmètre

- aucun `SocialPublicationAsset` créé ;
- aucune publication réelle, aucun appel provider (Meta, etc.) ;
- aucun job, worker, webhook ;
- niveaux `engagement.social` au-delà de `basic` (segmentation/ciblage
  éventuel, planification avancée) ;
- UI admin de gestion des `SocialPublication` (liste, édition, envoi) —
  hors périmètre de ce lot, comme la matérialisation newsletter n'avait pas
  besoin de reconstruire le CRUD newsletter, déjà existant. Ici il n'existe
  pas encore : sa construction reste un chantier séparé, non anticipé.

## Validation

Cadrage uniquement, aucune vérification `typecheck`/`lint`/tests
applicable.

Lecture directe effectuée : `AGENTS.md`,
`docs/domains/cross-cutting/social.md`,
`docs/roadmap/editorial-marketing-intents/README.md`,
`prisma/optional/engagement/social.prisma`,
`prisma/optional/engagement/newsletter.prisma`,
`prisma/seed/newsletter-feature-flag.seed.ts`,
`features/admin/feature-governance/catalog/feature-catalog.ts`,
`features/marketing/editorial-intents/resolve-editorial-marketing-intent-policy.ts`,
`features/marketing/editorial-intents/materialize-marketing-intent-as-newsletter-campaign.service.ts`,
`features/admin/marketing/intents/actions/materialize-newsletter-campaign.action.ts`,
cadrage et lot Code du lot 4.

## Commit documentaire prévu

```
docs(marketing): cadrer la matérialisation sociale d'un intent approuvé
```
