<!-- docs/lots/2026-07-22-commerce-marketing-intents-products-cadrage.md -->

# Cadrage — Diffusion marketing des produits (Lot 3, extension du consumer commerce)

> Suite de `docs/lots/2026-07-22-commerce-marketing-intents-cadrage.md`
> (cadrage marchés, Lot 4 du chantier « gestion de marchés »), branche
> `feature/commerce-intents-products`.

## Contexte

Le consumer `marketing-intents.commerce.v1`
(`features/marketing/commerce-intents/`) a été conçu, dès le cadrage
marchés, pour accueillir un second domaine source sans ambiguïté : la policy
`resolveCommerceMarketingIntentPolicy` couvrait déjà `market.created`,
`market.updated`, `market.cancelled`, avec un commentaire explicite dans le
code anticipant une extension `product.*`. Ce lot réalise cette extension :
brancher les produits sur le même pipeline générique
`DomainEvent -> MarketingIntent -> NewsletterCampaign/SocialPublication`
(brouillon proposé, jamais d'envoi automatique, validation admin requise —
identique au comportement marchés et au pipeline éditorial d'origine).

## Leçon tirée du bug corrigé sur PR #17 (antécédent)

Le chantier marchés a corrigé, en cours de route, un bug où un `PublicEvent`
créé `DRAFT` déclenchait à tort une proposition de diffusion marketing dès sa
création en base plutôt qu'à sa publication réelle (transition explicite vers
un statut public visible). La correction a introduit une garde de transition
de statut dans le recorder marché, pour ne déclencher `market.created` que
sur le passage effectif à un statut visible, jamais sur une simple insertion
Prisma en `DRAFT`.

Ce lot produits a été cadré dès le départ pour appliquer cette même leçon,
et l'a même renforcée avec une seconde garde propre au domaine produit.

## Pourquoi une double garde (statut + whitelist de champs) est nécessaire ici en particulier

La garde de transition de statut seule (reprise telle quelle du correctif
marché) est nécessaire mais insuffisante pour les produits, pour une raison
que les marchés n'ont pas : **la fréquence de mutation**.

- Un `Market` (marché) est créé et modifié occasionnellement, via un CRUD
  admin dédié à faible cadence — le risque de bruit sur la seule garde de
  statut était donc limité.
- Un `Product` est modifié en continu par des services Prisma **distincts**
  et fréquents : ajustement de stock, changement de prix, bascule de
  disponibilité par variante, gestion des catégories, SEO, variantes. Aucun
  de ces services ne touche `status` ni les champs éditoriaux, mais sans
  seconde garde, n'importe quelle fonction future touchant
  `Product.updatedAt`/`status` de façon incidente aurait pu générer un
  `MarketingIntent` sur une mutation purement opérationnelle, sans contenu
  éditorial nouveau à annoncer.

D'où la double garde effectivement implémentée dans
`features/admin/products/services/record-product-marketing-domain-events.ts` :

1. **Garde de statut** : ne déclenche `product.published` que sur la
   transition réelle `!== "ACTIVE" -> "ACTIVE"` (symétrique du correctif
   marché — jamais sur une création en `DRAFT`) ; ne déclenche
   `product.updated_visible` que si le produit est `ACTIVE` **avant ET
   après** la mutation (jamais sur la première publication, qui relève déjà
   de `product.published`).
2. **Garde de champs** (spécifique aux produits, sans équivalent marché) :
   pour `product.updated_visible`, exige en plus qu'au moins un champ de la
   whitelist éditoriale (`name`, `slug`, `marketingHook`,
   `shortDescription`, `description`, `careInstructions`) ait réellement
   changé. Ce pattern est repris à l'identique du pipeline éditorial blog
   déjà existant (`features/admin/blog/services/
record-blog-post-editorial-domain-events.ts`, fonction
   `getChangedVisibleFields` / garde `VISIBLE_FIELD_NAMES`), déjà éprouvé
   pour ce même problème de bruit sur un contenu à cadence de modification
   élevée.

Sans cette seconde garde, le pipeline commerce serait potentiellement
sollicité à chaque ajustement de stock ou de prix sur un produit déjà actif
— un volume de `MarketingIntent PROPOSED` sans rapport avec un changement
éditorial réel, dégradant la file de revue admin `/admin/marketing/intents`.
Le point de branchement unique (`updateProductGeneral`, seule fonction
touchant à la fois `status` et les champs éditoriaux) rend cette double
garde suffisante : les services de mutation stock/prix/disponibilité sont
des fonctions Prisma séparées, non instrumentées par ce lot, et ne peuvent
donc pas déclencher de diffusion par construction.

## Ce qui est neuf dans ce lot (Observé)

- `features/marketing/commerce-intents/resolve-commerce-marketing-intent-policy.ts`
  — extension additive de `COMMERCE_MARKETING_EVENT_TYPES` avec
  `"product.published"` et `"product.updated_visible"`, nouveaux cas de
  policy produisant `intentType: MarketingIntentType.PROMOTE_PRODUCT`,
  `subjectType: MarketingIntentSubjectType.PRODUCT`.
- `features/admin/products/services/record-product-marketing-domain-events.ts`
  (nouveau) — `recordProductPublishedDomainEvent` et
  `recordProductUpdatedVisibleDomainEvent`, appelant `recordDomainEvent()`
  générique (`aggregateType: "product"`), avec la double garde décrite
  ci-dessus.
- Branchement dans `updateProductGeneral`
  (`features/admin/products/editor/services/product-update-services.ts`),
  à l'intérieur de la transaction Prisma existante, après le
  `tx.product.update`.
- Extension additive de `prisma/cross-cutting/marketing.prisma` :
  `MarketingIntentType.PROMOTE_PRODUCT`,
  `MarketingIntentSubjectType.PRODUCT` — mêmes fichiers déjà étendus pour
  les marchés (`PROMOTE_COMMERCE_EVENT`, `PUBLIC_EVENT`), aucune valeur
  existante modifiée.
- `admin-marketing-intents-list.tsx` (`SUBJECT_TYPE_LABELS`) étendu avec
  `PRODUCT: "Produit"` (le `Record` exhaustif l'imposait pour rester
  compilable).
- Réutilisation **sans modification** de la projection runtime
  (`project-commerce-domain-event-to-marketing-intent.service.ts`,
  `consumerCode: "marketing-intents.commerce.v1"`), du rattrapage manuel,
  de la matérialisation newsletter/social et de la revue admin
  `/admin/marketing/intents` — tous génériques par `subjectType` et déjà
  partagés avec le flux marchés.

## Hors périmètre confirmé

- Diffusion déclenchée par un changement d'image (galerie/primaire) —
  `product-image-editor-actions.ts` n'est pas instrumenté (pas de snapshot
  avant/après disponible au même endroit).
- Diffusion sur variantes, prix, stock, disponibilité, catégories, SEO —
  jamais, par design (hors whitelist, services Prisma distincts non
  touchés).
- Archivage produit — pas de diffusion (symétrique du choix
  `market.cancelled` = `IGNORE`).
- SMS, envoi/publication automatique — cf. cadrage principal du chantier et
  cadrage marchés, inchangé.
- Aucune modification du gouvernance des flags `engagement.newsletter` /
  `engagement.social` : ce lot ne crée pas de nouveau flag, il branche un
  domaine source supplémentaire sur un mécanisme de diffusion déjà gouverné
  par ces flags existants.

## Vérification

- `pnpm run typecheck` / `pnpm run lint` — Observé comme exécutés au fil des
  sous-lots 1-2, non rejoués pendant la rédaction de ce cadrage
  documentaire.
- Tests unitaires ciblés créés : extension de
  `resolve-commerce-marketing-intent-policy.test.ts` (2 nouveaux cas), tests
  de la double garde (transition de statut, diff de champs whitelistés) dans
  `record-product-marketing-domain-events.ts` — cf. sous-lot 2 pour le détail
  des fichiers de test.

## Risque signalé (Déduit, hors périmètre de ce lot documentaire)

Le cadrage marchés (`docs/lots/2026-07-22-commerce-marketing-intents-cadrage.md`)
signalait déjà qu'un troisième domaine source de `MarketingIntent`
justifierait d'arbitrer une factorisation du squelette générique (garde
`DomainEventDelivery`/`deduplicationKey`, structure de la projection). Ce
lot est le second domaine source (après les marchés) à dupliquer ce
squelette pour la partie recorder/policy — la duplication reste
volontairement assumée ici (micro-lot, pas d'abstraction prématurée pour un
second cas d'usage), mais l'arbitrage évoqué reste d'autant plus pertinent
si un troisième domaine source apparaît.
