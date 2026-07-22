<!-- docs/lots/2026-07-22-commerce-marketing-intents-cadrage.md -->

# Cadrage — Diffusion marketing des marchés (Lot 4, consumer parallèle)

> Suite de `docs/lots/2026-07-22-engagement-public-events-cadrage.md` (Lot 4
> du chantier « gestion de marchés »), branche
> `feature/engagement-public-events`.

## Antécédent architectural

`docs/roadmap/editorial-marketing-intents/README.md` documente le chantier
déjà clos (revue de clôture 2026-07-16) qui a établi le pipeline générique
`DomainEvent -> MarketingIntent -> NewsletterCampaign/SocialPublication` pour
le contenu éditorial (blog, homepage, pages). Ce chantier a livré :

- le modèle `MarketingIntent` (statuts, canaux, `deduplicationKey`) ;
- une policy pure `resolveEditorialMarketingIntentPolicy` couvrant une liste
  fermée d'`eventType` éditoriaux ;
- une projection runtime idempotente (`DomainEventDelivery` +
  `consumerCode` stable, `"marketing-intents.editorial.v1"` — Observé dans
  `features/marketing/editorial-intents/project-editorial-domain-event-to-marketing-intent.service.ts`) ;
- la revue admin générique `/admin/marketing/intents` ;
- la matérialisation `NewsletterCampaign`/`SocialPublication` en `DRAFT`,
  générique par `subjectType`.

Le README indique explicitement en clôture : « chantier clos avec dette
documentée » et classe les lots ultérieurs d'orchestration/providers comme
hors périmètre — sans mentionner de plan de généralisation à d'autres
domaines sources (commerce, marchés, produits).

## Pourquoi un consumer parallèle plutôt qu'une généralisation du pipeline éditorial

Décision actée avec l'utilisateur : créer un module séparé
`features/marketing/commerce-intents/` plutôt que d'étendre
`resolveEditorialMarketingIntentPolicy` et sa liste fermée
`EDITORIAL_MARKETING_EVENT_TYPES`.

Raisons :

1. **Chantier éditorial clos** — `docs/roadmap/editorial-marketing-intents/README.md`
   documente une clôture explicite avec revue Cowork (2026-07-16) et une
   dette de tests déjà identifiée. Rouvrir ce pipeline pour y injecter des
   `eventType` marché aurait mélangé la portée d'un chantier clos avec un
   chantier nouveau, et aurait remis en jeu les invariants déjà vérifiés
   (idempotence, machine à états) sans bénéfice proportionné.
2. **Liste fermée par construction** — la policy éditoriale est documentée
   comme couvrant explicitement les événements `content.*` (blog, homepage,
   pages légales/éditoriales), avec des règles de fusion et d'exclusion
   propres à ce domaine (ex. pages légales jamais promues). Un `eventType`
   `market.*` n'a pas la même sémantique de cycle de vie et aurait forcé
   soit une extension de cas `switch` étrangère au domaine éditorial, soit
   une généralisation prématurée non demandée par le cadrage.
3. **Réutilisation du socle générique, pas du module éditorial spécifique** —
   l'infrastructure réellement générique et déjà conçue pour être
   multi-domaines est `DomainEvent`/`DomainEventDelivery`/`MarketingIntent`
   et les services de matérialisation newsletter/social (génériques par
   `subjectType`, comme le confirme le README : « la revue admin ... et la
   matérialisation newsletter ... et sociale ... sont génériques et
   fonctionnent déjà pour n'importe quel `MarketingIntent` »). Seule la
   partie _spécifique au domaine source_ (recorder, policy, projection) est
   dupliquée en parallèle, avec un `consumerCode` distinct
   (`"marketing-intents.commerce.v1"`) garantissant l'isolation de
   l'idempotence entre les deux pipelines.
4. **Micro-lot / compatibilité existante** — conforme à la règle
   `.claude/CLAUDE.md` de préférer le plus petit changement fiable et la
   compatibilité existante plutôt qu'une abstraction prématurée
   (généraliser une policy pour un seul second cas d'usage aurait été une
   abstraction anticipée sans second/troisième exemple de domaine source).

## Ce qui est neuf dans ce lot (Observé)

- `features/marketing/commerce-intents/resolve-commerce-marketing-intent-policy.ts`
  — policy pure, liste fermée `COMMERCE_MARKETING_EVENT_TYPES` =
  `["market.created", "market.updated", "market.cancelled"]`. `market.cancelled`
  est délibérément **ignoré** (aucune proposition de diffusion sur une
  annulation) — commentaire explicite dans le code : « Proposer une
  diffusion positive ... n'est ni créé ni fusionné pour cet eventType ».
- `features/marketing/commerce-intents/project-commerce-domain-event-to-marketing-intent.service.ts`
  — projection runtime, même mécanique d'idempotence que l'éditorial
  (double garde `DomainEventDelivery` unique par `consumerCode` +
  `MarketingIntent.deduplicationKey` unique), `consumerCode:
"marketing-intents.commerce.v1"`.
- `features/marketing/commerce-intents/project-pending-commerce-domain-events.service.ts`
  — rattrapage manuel, scope limité aux `eventType` marché, même pattern
  que le rattrapage éditorial mais fichier et module distincts.
- Extension additive de `prisma/cross-cutting/marketing.prisma` :
  `MarketingIntentType.PROMOTE_COMMERCE_EVENT`,
  `MarketingIntentSubjectType.PUBLIC_EVENT` — nouvelles valeurs d'enum,
  aucune modification des valeurs éditoriales existantes.
- Réutilisation **sans modification** de la matérialisation newsletter/
  social existante et de la revue admin `/admin/marketing/intents`.

## Hors périmètre confirmé

- Aucune modification d'un fichier `*-editorial-*` ou de
  `docs/roadmap/editorial-marketing-intents/**` (chantier clos, hors
  périmètre de cette tâche par consigne stricte).
- Aucun déclenchement automatique de diffusion sur `market.cancelled` — le
  toggle admin actuel n'alterne qu'`ACTIVE`/`INACTIVE` ; aucun chemin ne
  produit aujourd'hui de statut `CANCELLED`, donc ce choix de policy reste
  pour l'instant non observable en pratique mais documenté pour le jour où
  un chemin d'annulation existera.
- Diffusion marketing sur les produits — cadrage séparé futur.
- SMS, envoi automatique — cf. cadrage principal du chantier.

## Vérification

- Tests unitaires ciblés créés :
  `tests/unit/features/marketing/resolve-commerce-marketing-intent-policy.test.ts`,
  `tests/unit/features/marketing/project-commerce-domain-event-to-marketing-intent.service.test.ts`
  (Observé — fichiers présents sur la branche).
- `pnpm run typecheck` / `pnpm run lint` — Observé comme exécutés au fil des
  sous-lots précédents (Lots 1-4), non rejoués pendant la rédaction de ce
  cadrage documentaire.

## Risque signalé (Déduit, non corrigé — hors périmètre de ce lot documentaire)

La duplication du mécanisme (recorder + policy + projection + rattrapage)
entre `marketing-intents.editorial.v1` et `marketing-intents.commerce.v1`
introduit une redondance structurelle assumée. Si un troisième domaine
source de `MarketingIntent` apparaît (ex. produits, cf. « hors périmètre »
ci-dessus), une factorisation du squelette générique (garde
`DomainEventDelivery`/`deduplicationKey`, structure du service de
projection) deviendrait pertinente à arbitrer dans un cadrage dédié plutôt
que de dupliquer une troisième fois.
