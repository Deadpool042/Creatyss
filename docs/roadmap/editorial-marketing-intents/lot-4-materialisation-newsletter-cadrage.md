<!-- docs/roadmap/editorial-marketing-intents/lot-4-materialisation-newsletter-cadrage.md -->

# Cadrage — Lot 4 : matérialisation d'un `MarketingIntent` approuvé en `NewsletterCampaign` DRAFT

## Statut

Cadrage uniquement. Aucun code modifié dans ce lot.

## Verdict

Le lot est réalisable sans migration Prisma.

L'idempotence de création peut reposer sur un `code` déterministe dérivé de
l'`id` du `MarketingIntent`, combiné à la contrainte unique existante
`@@unique([storeId, code])` sur `NewsletterCampaign`. Cette contrainte est
suffisante pour garantir qu'un rejeu retourne toujours la campagne déjà
créée, sans ajouter de colonne ni de relation.

En contrepartie, **aucune relation persistée réelle** (pas de clé étrangère)
n'existera entre `MarketingIntent` et `NewsletterCampaign` à l'issue de ce
lot. Le lien est dérivable (par le `code`), pas stocké. Ce compromis est
assumé explicitement — cf. section Idempotence et Cas limites — et reste
strictement au-dessus de la barre fixée par l'hypothèse de travail :
« ne proposer une migration que si le schéma réel ne permet aucune
idempotence fiable ». Ce n'est pas le cas ici.

## État observé

- **Modèle** : `MarketingIntent` (`prisma/cross-cutting/marketing.prisma`)
  et `NewsletterCampaign` (`prisma/optional/engagement/newsletter.prisma`)
  n'ont aujourd'hui aucune relation Prisma entre eux. `NewsletterCampaign`
  ne porte aucun champ de traçabilité vers une source (`provider` et
  `providerReference` concernent le provider d'envoi, pas une origine
  interne).
- **Doctrine domaine** (`docs/domains/cross-cutting/newsletter.md`,
  section « Campagnes newsletter de canal ») : `NewsletterCampaign` est déjà
  documenté comme distinct de `MarketingIntent` — « `MarketingIntent` porte
  une proposition de communication révisable ; `NewsletterCampaign` porte un
  brouillon ou une exécution bornée au canal newsletter. » Cette distinction
  est un invariant documentaire préexistant, pas une décision de ce lot.
- **Création actuelle de `NewsletterCampaign`**
  (`features/admin/marketing/newsletter/actions/create-newsletter-campaign.action.ts`) :
  le `code` est aujourd'hui un slug du nom suivi d'un suffixe aléatoire
  (`randomBytes(3)`), donc non déterministe. Ce lot introduira un deuxième
  mode de génération de `code`, propre au chemin de matérialisation.
- **Policy éditoriale**
  (`features/marketing/editorial-intents/resolve-editorial-marketing-intent-policy.ts`) :
  seul `content.blog_post.published` (et sa fusion `updated_visible`)
  suggère le canal `NEWSLETTER`. `HOMEPAGE` ne suggère que `SOCIAL`.
  `EDITORIAL_PAGE` ne suggère aucun canal. En pratique, à politique
  inchangée, seuls des intents `subjectType = BLOG_POST` seront
  matérialisables en newsletter.
- **Lacune de visibilité découverte pendant ce cadrage** : la query admin
  actuelle (`listAdminMarketingIntents`,
  `features/admin/marketing/intents/queries/list-admin-marketing-intents.query.ts`)
  filtre strictement `status: "PROPOSED"`. Un intent qui passe `APPROVED`
  disparaît immédiatement de la liste admin livrée au lot 3. Il n'existe
  aujourd'hui aucune surface pour retrouver un intent `APPROVED` et
  déclencher sa matérialisation. Ce point n'est pas une hypothèse à
  vérifier : c'est un fait observé qui conditionne le périmètre du futur lot
  Code (voir « Périmètre du futur lot Code »).
- **Feature gating existant** : aucune entrée de catalogue
  (`features/admin/feature-governance/catalog/feature-catalog.ts`) ne
  couvre le domaine `marketing-intents`. `engagement.newsletter` existe déjà
  (`family: optional`, `mutability: level_selectable`, niveaux `basic`,
  `segmentation`, `automation`), gouverné par `meetsFeatureLevel`.
- **Contrainte DB** : `NewsletterCampaign.code` est un `String` Prisma sans
  longueur bornée (mappé `TEXT` en PostgreSQL, confirmé par la migration
  initiale — aucune contrainte `db.VarChar`). Un `code` du type `mi-<cuid>`
  (~28 caractères) n'a aucun risque de troncature.

## Décisions proposées

### 1. Déclencheur exact

Action serveur explicite, déclenchée depuis l'admin, jamais automatique.

- Aucune matérialisation à l'approbation de l'intent (`reviewMarketingIntentAction`
  reste inchangée, ne fait rien de plus qu'aujourd'hui).
- Un bouton dédié (« Créer un brouillon newsletter ») apparaît uniquement
  sur un intent `APPROVED` dont `suggestedChannels` contient `NEWSLETTER`.
  Il déclenche une nouvelle action serveur
  `materializeMarketingIntentAsNewsletterCampaignAction(intentId)`.
- Confirme l'hypothèse de travail : approbation ≠ matérialisation.

### 2. Préconditions métier

Toutes nécessaires, vérifiées côté service (pas seulement côté UI) :

- l'intent existe ;
- `intent.status === "APPROVED"` ;
- `"NEWSLETTER"` ∈ `intent.suggestedChannels` ;
- `meetsFeatureLevel("engagement.newsletter", "basic")` est vrai ;
- `intent.storeId` résout un store existant (ou `null` accepté au même
  titre que la création manuelle actuelle, qui autorise `storeId: null`).

### 3. Détection du canal newsletter

Lecture directe de `MarketingIntent.suggestedChannels` (champ déjà
persisté, peuplé par la policy au moment de la projection). Pas de nouvelle
inférence à partir de `subjectType` ou `intentType` : le champ existe déjà
pour exactement cet usage et le découplage vis-à-vis de la policy éditoriale
est préférable (une évolution future de la policy n'a pas besoin de toucher
la matérialisation).

### 4. Mapping champ par champ

| `NewsletterCampaign` | Source                | Règle                                                          |
| -------------------- | --------------------- | -------------------------------------------------------------- |
| `storeId`            | `intent.storeId`      | copie directe                                                  |
| `code`               | dérivé de `intent.id` | `mi-${intent.id}` — déterministe, voir Idempotence             |
| `name`               | `contextJson.title`   | fallback `intent.subjectId` si absent                          |
| `subjectLine`        | `contextJson.title`   | même règle que `name` — l'admin l'édite avant envoi            |
| `previewText`        | —                     | `null` — aucune donnée fiable dans `contextJson` pour ce champ |
| `bodyHtml`           | gabarit minimal       | titre + lien vers le contenu source (voir ci-dessous)          |
| `bodyText`           | gabarit minimal       | équivalent texte du même gabarit                               |
| `status`             | constante             | `"DRAFT"`                                                      |
| `createdByUserId`    | admin courant         | `requireAuthenticatedAdmin().id`                               |

Construction du lien source dans le gabarit `bodyHtml`/`bodyText` : seul
`subjectType = BLOG_POST` a un chemin storefront connu et stable
(`/blog/${slug}`, `contextJson.slug`). Pour tout autre `subjectType`, pas de
lien généré — seul le titre apparaît. Cette limite est acceptable : la
policy actuelle ne suggère de toute façon `NEWSLETTER` que pour
`BLOG_POST`.

Le corps généré est un point de départ, pas un livrable. La campagne reste
`DRAFT` et éditable par l'admin avant tout envoi (cf. flux d'envoi déjà
livré dans `docs/roadmap/h3-administration-avancee/lot-newsletter-campagnes.md`).
Aucun `NewsletterCampaignRecipient` n'est créé à cette étape — confirmé
conforme à l'hypothèse de travail.

### 5. Stratégie d'idempotence

Reprend l'idiome déjà utilisé dans ce même chantier
(`createIntentFromPolicy` et `createPendingDelivery`,
`features/marketing/editorial-intents/project-editorial-domain-event-to-marketing-intent.service.ts`) :

1. calculer `code = "mi-" + intent.id` ;
2. tenter `db.newsletterCampaign.create({ data: { ..., code } })` ;
3. si erreur `P2002` (contrainte `storeId_code`), relire l'enregistrement
   existant via `findUnique({ where: { storeId_code: { storeId, code } } })`
   et le retourner tel quel — aucune mutation du contenu déjà généré ;
4. sinon, propager l'erreur.

`intent.id` est un `cuid()` stable et unique dans le temps : deux appels
successifs sur le même intent produisent toujours le même `code`, donc
toujours la même campagne. Aucune fenêtre de concurrence non couverte :
la contrainte unique est la source de vérité, pas une vérification
applicative préalable (`findFirst` puis `create` serait racy ; le
catch-P2002 ne l'est pas).

### 6. Relation persistée entre intent et campagne

Aucune. Le lien est **dérivé**, pas stocké : retrouver la campagne d'un
intent donné se fait par `findUnique({ where: { storeId_code: { storeId,
code: "mi-" + intentId } } })`, une lecture indexée et fiable grâce à la
contrainte unique existante — pas un scan.

Ce choix est documenté comme un compromis, pas une omission :

- pas d'intégrité référentielle (rien n'empêche, en théorie, une suppression
  ou une divergence de `code`) ;
- pas de requête inverse triviale « quels intents ont produit des
  campagnes » sans reconstituer le `code` attendu pour chaque intent ;
- si un besoin réel émerge plus tard (ex. filtrer les campagnes par intent
  d'origine dans l'admin, ou afficher l'historique de matérialisation côté
  intent), une migration additive (`NewsletterCampaign.sourceMarketingIntentId`
  nullable, FK `SetNull`) sera alors justifiée — mais pas avant.

### 7. Traitement des rejeux et conflits

- **Rejeu simple** (même intent, bouton recliqué ou action rejouée après
  timeout réseau) : retourne la campagne existante, aucun doublon, aucune
  erreur exposée à l'admin — traité comme un succès idempotent.
- **Conflit de `code`** entre deux intents distincts : structurellement
  impossible tant que `code` est dérivé de `intent.id` (identifiants
  `cuid()` uniques par construction). Si ce cas survient malgré tout
  (corruption de données, migration future changeant le format), il doit
  être traité comme une erreur technique, pas une erreur métier — ne pas
  retourner silencieusement la mauvaise campagne.
- **Intent réutilisé après un premier échec partiel** (ex. crash après
  `create`, avant confirmation UI) : couvert par le même catch-P2002 — le
  rejeu retrouve la campagne déjà créée.

### 8. Feature gating requis

Réutilisation de `engagement.newsletter`, niveau `basic` minimum, via
`meetsFeatureLevel("engagement.newsletter", "basic")` — la même garde que
`/admin/marketing/newsletter` et que la création manuelle de campagne.
Aucune nouvelle entrée `FEATURE_CATALOG` : l'objet écrit
(`NewsletterCampaign`) appartient déjà au domaine `newsletter`, et ce
domaine a déjà son mécanisme de gouvernance. Créer une entrée séparée pour
`marketing-intents` reviendrait à gouverner deux fois le même effet de bord
(écriture d'une `NewsletterCampaign`).

La revue des intents elle-même (`/admin/marketing/intents`, lot 3) reste
sans feature flag dédié, comme déjà noté dans le lot précédent — ce lot ne
change pas ce constat, il ajoute seulement une garde supplémentaire sur
l'action de matérialisation, pas sur la lecture de la liste.

### 9. Effet d'un archivage ultérieur de l'intent

Aucun effet automatique sur une campagne déjà matérialisée.

Une fois `APPROVED → ARCHIVED` appliqué à l'intent (transition autorisée
par `canApplyReviewDecision`, lot 3), la `NewsletterCampaign` déjà créée
continue son propre cycle de vie (`DRAFT → SCHEDULED → SENDING → ...`),
indépendamment. C'est cohérent avec l'invariant documentaire déjà en place
dans `newsletter.md` : `NewsletterCampaign` est un objet de canal autonome
dès sa création, pas un miroir vivant de l'intent. Ce n'est pas une lacune
de ce lot, c'est la conséquence directe de l'absence de relation persistée
(section 6) — et c'est le comportement voulu, pas un effet de bord.

Corollaire explicite à documenter dans le futur lot Code : matérialiser
n'est pas réversible en désarchivant l'intent. Il n'existe pas de commande
« annuler la matérialisation ».

### 10. Erreurs métier

| Cas                                                        | Réponse                                                                                       |
| ---------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Intent introuvable                                         | `not_found`                                                                                   |
| Intent non `APPROVED` (`PROPOSED`, `REJECTED`, `ARCHIVED`) | `invalid_status`, pas de matérialisation                                                      |
| `NEWSLETTER` absent de `suggestedChannels`                 | `channel_not_suggested`                                                                       |
| `engagement.newsletter` inactif ou niveau insuffisant      | `feature_gate_blocked`                                                                        |
| Store introuvable si `storeId` non nul mais orphelin       | erreur technique, pas une branche métier dédiée (cas déjà non géré ailleurs dans ce chantier) |

Aucune de ces erreurs ne doit provoquer de création partielle. Le service
reste une fonction totale : soit il retourne la campagne (créée ou
existante), soit un statut d'erreur métier explicite, jamais une exception
non typée remontée jusqu'à l'UI.

## Mapping métier

Voir section « Décisions proposées » point 4 — table complète.

Point d'attention distinct : `contextJson` sur `MarketingIntent` est
`Json?` (non typé au niveau Prisma). Le service de matérialisation doit
lire ce JSON avec les mêmes garde-fous que
`project-editorial-domain-event-to-marketing-intent.service.ts`
(`asJsonObject`, lecture défensive de `title`/`slug`, jamais de `as`
non vérifié) plutôt que de dupliquer une nouvelle fonction de lecture JSON.

## Idempotence

Voir section « Décisions proposées » points 5 et 7. Résumé : `code`
déterministe + contrainte unique existante + catch-P2002, sans nouvel état
ni verrou applicatif.

## Cas limites

- **Intent `APPROVED` sans `NEWSLETTER` dans `suggestedChannels`** (ex. un
  intent `HOMEPAGE` approuvé malgré un canal `SOCIAL` uniquement) : le
  bouton de matérialisation newsletter ne doit pas apparaître ; si l'action
  est appelée directement (contournement UI), elle doit renvoyer
  `channel_not_suggested`, pas créer une campagne vide de sens.
- **Titre absent du `contextJson`** (ancien intent créé avant l'ajout du
  champ, ou payload source incomplet) : fallback sur `subjectId`, jamais de
  `name`/`subjectLine` vide — la contrainte `min(2)` du schéma de création
  manuelle n'est pas rejouée ici (le service de matérialisation ne passe
  pas par `createNewsletterCampaignSchema`), donc le service doit imposer
  lui-même un minimum non vide.
- **Double clic / double soumission rapide côté UI** : couvert par
  l'idempotence (section 5), pas besoin de désactivation optimiste
  supplémentaire côté composant, bien qu'un `disabled` pendant la
  transition reste une bonne pratique UX déjà utilisée dans ce chantier
  (`IntentDecisionButtons`, lot 3).
- **Intent `APPROVED` mais devenu invisible dans l'admin** (lacune décrite
  dans « État observé ») : sans correction de la query de liste, ce lot est
  fonctionnellement inaccessible depuis l'UI malgré un service correct.
  C'est un cas limite bloquant, pas cosmétique — traité explicitement dans
  le périmètre du futur lot Code ci-dessous.

## Impact Prisma

Aucun changement de schéma requis pour ce lot. Pas de nouveau champ, pas de
nouvelle relation, pas de `pnpm run db:push`.

Si un besoin réel de relation persistée émerge plus tard (voir section 6),
l'évolution resterait additive et non bloquante : un champ nullable
`sourceMarketingIntentId` sur `NewsletterCampaign` avec `onDelete: SetNull`,
suivant exactement le pattern déjà en place pour
`MarketingIntent.sourceDomainEventId`. Cette option est documentée ici pour
mémoire, pas proposée dans ce lot.

## Périmètre du futur lot Code

Fichiers à créer :

- `features/marketing/editorial-intents/materialize-marketing-intent-as-newsletter-campaign.service.ts`
  — service pur : préconditions, mapping, idempotence, erreurs métier
  typées. Aucune dépendance à Next.js (`"use server"` + `server-only`,
  même forme que les services existants du chantier).
- `features/admin/marketing/intents/actions/materialize-newsletter-campaign.action.ts`
  — `requireAuthenticatedAdmin`, garde `meetsFeatureLevel`, appel du
  service, `revalidatePath`.

Fichiers à modifier :

- `features/admin/marketing/intents/queries/list-admin-marketing-intents.query.ts`
  — corriger la lacune de visibilité : exposer aussi les intents `APPROVED`
  compatibles newsletter (a minima), pour que le bouton de matérialisation
  ait une surface où exister. Décision de détail (onglet séparé « À
  matérialiser » vs liste unique multi-statuts) à trancher au moment du lot
  Code, pas ici.
- `features/admin/marketing/intents/components/admin-marketing-intents-list.tsx`
  — bouton conditionnel de matérialisation, affiché seulement si
  `status === "APPROVED"` et `"NEWSLETTER" ∈ suggestedChannels".
- `docs/domains/cross-cutting/newsletter.md` — compléter la section
  « Campagnes newsletter de canal » avec l'origine possible « matérialisée
  depuis un `MarketingIntent` approuvé », en conservant explicitement la
  distinction déjà actée intent/campagne.
- `docs/roadmap/editorial-marketing-intents/README.md` — passer le statut
  du Lot 4 de « à cadrer » à « cadré, implémentation à faire », avec
  pointeur vers ce document.

Aucune modification prévue de `prisma/**`.

## Hors périmètre

Repris tel quel de l'hypothèse de travail, confirmé applicable après
lecture :

- aucun `NewsletterCampaignRecipient` créé ;
- aucun envoi d'email, aucun déclenchement du flux d'envoi existant
  (`send-newsletter-campaign.action.ts`) ;
- aucun job, worker, webhook ou provider nouveau ;
- aucune logique de matérialisation dans un composant React — le mapping et
  l'idempotence vivent entièrement dans le service `features/marketing/...`,
  le composant ne fait qu'appeler l'action serveur ;
- lot 5 (matérialisation sociale) explicitement hors périmètre, non
  anticipé dans les noms de fichiers ci-dessus ;
- pas de génération de contenu HTML enrichi (pas d'IA, pas de rendu
  Markdown avancé) — gabarit minimal uniquement, cf. mapping.

## Validation

Ce lot est un cadrage. Aucune vérification `typecheck`/`lint`/tests
applicable — aucun fichier de code modifié.

Validation propre à ce document :

- lecture directe effectuée : `AGENTS.md`, `docs/domains/cross-cutting/marketing.md`,
  `docs/domains/cross-cutting/newsletter.md`,
  `docs/roadmap/editorial-marketing-intents/README.md`,
  `docs/roadmap/projet-creatyss.md`,
  `docs/roadmap/h3-administration-avancee/lot-newsletter-campagnes.md`,
  `docs/admin/settings-advanced-feature-system.md`,
  `prisma/cross-cutting/marketing.prisma`,
  `prisma/optional/engagement/newsletter.prisma`,
  services et UI des lots 1 à 3
  (`features/marketing/editorial-intents/**`,
  `features/admin/marketing/intents/**`), action et schéma de création
  manuelle de campagne, policy éditoriale, catalogue de features, migration
  SQL initiale (contrainte `code`) ;
- RAG `creatyss-rag` utilisé pour confirmer l'absence de doctrine
  contradictoire ailleurs dans `docs/domains/cross-cutting/**` sur la
  frontière marketing/newsletter ;
- `docs/architecture/` consulté au niveau structure
  (`docs/architecture/README.md` et sommaire des sous-dossiers) — pas de
  lecture exhaustive des fichiers `10-fondations`/`20-structure`, jugée non
  nécessaire : aucune décision de ce cadrage ne touche la classification de
  domaine, la structure `prisma/**`/`docs/domains/**`, ni une frontière de
  domaine non déjà tranchée par `marketing.md`/`newsletter.md`.

## Commit documentaire prévu

```
docs(marketing): cadrer la matérialisation newsletter d'un intent approuvé
```

Fichier ajouté : ce document. Aucun autre fichier modifié dans ce commit —
la mise à jour du statut dans `docs/roadmap/editorial-marketing-intents/README.md`
est repoussée au lot Code (elle référence des fichiers qui n'existent pas
encore, cf. règle de factualité : ne pas documenter comme fait ce qui n'est
pas implémenté).
