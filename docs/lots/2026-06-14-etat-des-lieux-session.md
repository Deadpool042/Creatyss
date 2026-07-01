<!-- docs/lots/2026-06-14-etat-des-lieux-session.md -->

# État des lieux — session 2026-06-14 (passation Codex)

Document de passation : ce qui a été livré, l'état réel, les décisions, les
pièges techniques, comment tester, et ce qui reste. Conforme à `AGENTS.md`
(état réel vs cible vs hors périmètre).

---

## 1. Chantiers livrés cette session

### 1.1 `commerce.documents` — activation + bon de préparation

- Seed `FeatureFlag commerce.documents` (DRAFT) → la confirmation de commande
  (déjà codée) devient utilisable.
- `DELIVERY_NOTE` (bon de préparation) : service + action + bouton, pattern
  identique à la confirmation.
- Cadrage : `docs/lots/2026-06-13-commerce-documents-cadrage.md`.

### 1.2 `commerce.taxation` — TVA par territoire (B2C, métropole + DOM)

- **Logique pure testée** : `entities/tax/tax-territory.ts` (territoire par code
  postal, DOM 971–976, exonération Guyane/Mayotte), `entities/tax/tax-computation.ts`
  (ventilation TTC→HT/TVA). Tests : `tests/unit/entities/tax/`.
- **Résolution** : `features/commerce/taxation/queries/resolve-tax-rate.query.ts`
  (spécificité variant > produit > catégorie > store, validité, fallback bloquant).
- **Câblage checkout** : `features/commerce/orders/lib/order.repository.ts`
  calcule la TVA par ligne (gated : 0 si feature inactive).
- **Schéma** : `OrderLine.taxRatePercent` + `taxTerritory`
  (migration `20260614120000_add_order_line_tax_capture`).
- **Seed** : taux FR/DOM (`prisma/seed/tax-rules.seed.ts`) + flag (DRAFT).
- **UI admin** : `/admin/commerce/taxation` (liste + création de règles), lien
  « Réglages » dans `settings/advanced`.
- Cadrage : `docs/lots/2026-06-14-commerce-taxation-cadrage.md`.
- Doctrine : `docs/domains/optional/commerce/taxation.md` (décisions).

### 1.3 Chantier factures — `INVOICE` + `CREDIT_NOTE`

- **Schéma** (migration `20260614130000_add_invoice_schema`) :
  `documents.snapshot` (JSONB), `documents.parentDocumentId`, table
  `document_counters`.
- **Numérotation sans trou** :
  `features/admin/commerce/documents/services/allocate-document-number.service.ts`
  (`INSERT … ON CONFLICT` + `SELECT … FOR UPDATE`), format `FA-{année}-{0000}`.
- **Émission facture** : `issue-invoice.service.ts` (snapshot légal figé) +
  action + bouton « Émettre la facture ».
- **Avoir** : `issue-credit-note.service.ts` (rattaché à la facture via
  `parentDocumentId`, `AV-…`) + action + bouton « Émettre un avoir ».
- Cadrage : `docs/lots/2026-06-14-commerce-factures-cadrage.md`.

### 1.4 PDF des documents (à la demande)

- `render-document-pdf.ts` (lib **`pdf-lib`**) + route
  `GET /admin/commerce/documents/[documentId]/pdf` + lien « Télécharger le PDF ».
- Couvre confirmation, bon de préparation, facture, avoir. **Pas de stockage**
  (génération à la volée). Factur-X = ultérieur.

### 1.5 `commerce.fulfillment` V1

- Préparation logistique « tout ou rien » : services create/advance, query,
  actions, carte dans le détail commande, gated. Pas de schéma (modèle déjà posé).
- Indépendant de l'expédition, **sans impact stock**.
- Cadrage : `docs/lots/2026-06-14-commerce-fulfillment-cadrage.md`.

### 1.6 `commerce.returns` V1

- Demande de retour « commande entière », workflow
  `REQUESTED → … → CLOSED` + décisions, réf `RET-…`, carte dans le détail
  commande, gated. Pas de schéma.
- `REFUNDED` **déclaratif** (pas de remboursement réel ni restock).
- Cadrage : `docs/lots/2026-06-14-commerce-returns-cadrage.md`.

### 1.7 Corrections transverses

- **Drift type** : `OrderLine`/service `lowStockThreshold` manquant dans un type
  local (`product-update-services.ts`) — corrigé.
- **tsc OOM** : scripts `typecheck`/`typecheck:watch` passent par
  `node --max-old-space-size=8192 .../tsc` (`package.json`).
- **Drift migrations** : migration `20260613100000_add_feature_levels`
  (colonnes niveaux poussées via `db push` sans migration) pour réconcilier.
- **Prisma 7 / adaptateur driver** : créations imbriquées en relation corrigées
  (cf. § 4).
- Doctrine : note d'assiette TTC dans `docs/domains/core/commerce/pricing.md`.

### 1.8 `platform.notifications` — lecture admin du référentiel

- Seed `FeatureFlag platform.notifications` (DRAFT, inactif par défaut).
- Query de gating admin + snapshot lecture seule du référentiel
  `Notification` / `NotificationPreference` (compteurs, dernières entrées).
- Intégration dans `/admin/settings/notifications` **sans casser** la page de
  réglages emails transactionnels déjà existante.
- Lien « Reglages » ajouté dans `settings/advanced` une fois la feature active.
- Cadrage : `docs/lots/2026-06-14-platform-notifications-cadrage.md`.

### 1.9 `satellite.search` — lecture admin du référentiel

- Seed `FeatureFlag satellite.search` (DRAFT, inactif par défaut).
- Query de gating admin + lecture du référentiel `SearchDocument`
  (compteurs, dernières entrées, aperçu du texte indexé).
- Page discrète `/admin/settings/search`, liée depuis `settings/advanced` quand
  la feature est active.
- Aucun moteur externe, aucune indexation automatique, aucune recherche
  storefront dans ce lot.
- Cadrage : `docs/lots/2026-06-14-satellite-search-cadrage.md`.

### 1.10 `satellite.channels` — lecture admin du référentiel

- Seed `FeatureFlag satellite.channels` (DRAFT, inactif par défaut).
- Query de gating admin + lecture du référentiel `Channel`,
  `ChannelProductStatus` et `ChannelVariantStatus` (compteurs, dernières
  entrées).
- Page discrète `/admin/settings/channels`, liée depuis `settings/advanced`
  quand la feature est active.
- Aucun provider externe, aucune synchronisation, aucune publication dans ce lot.
- Cadrage : `docs/lots/2026-06-14-satellite-channels-cadrage.md`.

### 1.11 `platform.integrations` — lecture admin du référentiel

- Seed `FeatureFlag platform.integrations` (DRAFT, inactif par défaut).
- Query de gating admin + lecture du référentiel `Integration`,
  `IntegrationCredential` (redacté) et `IntegrationSyncState`.
- Page discrète `/admin/settings/integrations`, liée depuis `settings/advanced`
  quand la feature est active.
- Aucun secret brut, aucun adaptateur provider, aucune action opératoire dans ce lot.
- Cadrage : `docs/lots/2026-06-14-platform-integrations-cadrage.md`.

### 1.12 `platform.webhooks` — lecture admin du référentiel actuel

- Seed `FeatureFlag platform.webhooks` (DRAFT, inactif par défaut).
- Query de gating admin + lecture du référentiel `WebhookEndpoint` /
  `WebhookDelivery`.
- Page discrète `/admin/settings/webhooks`, liée depuis `settings/advanced`
  quand la feature est active.
- Point important : le lot **n'essaie pas de masquer** la divergence entre la
  doctrine actuelle (`webhooks entrants`) et le modèle Prisma observé
  (`endpoints` / `deliveries`).
- Cadrage : `docs/lots/2026-06-14-platform-webhooks-cadrage.md`.

### 1.13 `engagement.automations` — référentiel admin + doctrine

- Seed `FeatureFlag engagement.automations` (DRAFT, inactif par défaut).
- Création de la fiche domaine canonique
  `docs/domains/cross-cutting/automations.md`.
- Schéma Prisma minimal de définition posé :
  `prisma/optional/engagement/automations.prisma`
  - migration `20260614143000_add_automation_schema`.
- `/admin/marketing/automations` expose désormais un référentiel admin réel
  des définitions `Automation` :
  création en `DRAFT`, liste et activation/désactivation.
- Point important : **aucune exécution métier** n'est encore branchée dans ce
  lot malgré ce CRUD admin.
- Cadrage : `docs/lots/2026-06-14-engagement-automations-cadrage.md`.
  Suite schéma : `docs/lots/2026-06-14-engagement-automations-schema-cadrage.md`.
  Suite CRUD : `docs/lots/2026-06-14-engagement-automations-crud-cadrage.md`.

### 1.14 `engagement.newsletter` — souscription storefront effective

- La homepage storefront appelait déjà `POST /api/newsletter`, mais le route
  handler manquait encore.
- Ajout d'un handler public minimal, gated
  `meetsFeatureLevel("engagement.newsletter","basic")`, qui valide l'email et
  branche la souscription sur `NewsletterSubscriber`.
- Politique retenue : **idempotente** — création si absent, succès sans
  mutation si déjà `SUBSCRIBED`, réactivation explicite sinon.
- Aucun double opt-in, aucune campagne, aucun provider email, aucune
  automation exécutée dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-newsletter-storefront-subscription-cadrage.md`.

### 1.15 `engagement.automations` — premier déclencheur réel via `jobs`

- Une souscription newsletter storefront (`created` ou `reactivated`) peut
  désormais déclencher les automations `ACTIVE` avec
  `triggerType = NEWSLETTER_SUBSCRIBED`.
- Le branchement reste volontairement borné :
  - recherche des définitions `Automation` concernées ;
  - création d'un `Job` `PENDING` par automation ;
  - `scheduledAt` calculé depuis `delayMinutes`.
- Aucune exécution worker, aucun envoi provider, aucun modèle
  `AutomationRun` n'est ajouté dans ce lot.
- Frontière explicitée : `newsletter` = vérité d'abonnement,
  `automations` = définitions, `jobs` = intention planifiée.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-newsletter-trigger-cadrage.md`.

### 1.16 `engagement.automations` — visibilité admin des jobs planifiés

- `/admin/marketing/automations` expose maintenant une lecture bornée des jobs
  planifiés par le déclencheur `NEWSLETTER_SUBSCRIBED`.
- Le cockpit reste local au domaine :
  compteurs simples + dernières occurrences, sans mutation opératoire.
- La même page explicite aussi désormais combien de définitions et de jobs
  restent visibles après filtres locaux, y compris quand la vue jobs ne montre
  que les entrées les plus récentes d'un ensemble plus large.
- Chaque ligne job affiche aussi maintenant une référence courte dérivée de
  l'identifiant technique, utile pour citer un cas précis sans ouvrir la vue
  transverse des logs.
- `maintenance/logs` reste la vue transverse globale de la file de jobs.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-jobs-visibility-cadrage.md`.

### 1.17 `engagement.automations` — exécution manuelle bornée `EMAIL_MESSAGE`

- `/admin/marketing/automations` permet maintenant d'exécuter un job
  d'automation prêt, sans worker général.
- Le lot reste strictement borné à :
  - `triggerType = NEWSLETTER_SUBSCRIBED` ;
  - `actionType = EMAIL_MESSAGE` ;
  - template `newsletter-welcome` ou défaut nul.
- L'envoi s'appuie sur le provider transactionnel existant et crée une trace
  dédiée dans `EmailMessage`.
- Le job passe en `SUCCEEDED` ou `FAILED` avec message d'erreur lisible.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-email-message-execution-cadrage.md`.

### 1.18 `engagement.automations` — exécution batch des jobs visibles

- `/admin/marketing/automations` permet maintenant d'exécuter en une action les
  jobs prêts déjà visibles dans la page.
- Le batch réutilise l'exécuteur unitaire existant et retourne un bilan simple
  succès / échecs.
- Le lot reste borné :
  - jobs visibles uniquement ;
  - taille limitée ;
  - aucun worker global.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-batch-execution-cadrage.md`.

### 1.19 `engagement.automations` — visibilité locale de la trace email

- `/admin/marketing/automations` relie maintenant chaque job à l'éventuel
  `EmailMessage` déjà créé pendant l'exécution.
- La page expose localement une trace minimale exploitable :
  destinataire, statut email, provider, référence provider, erreur.
- Cette trace est maintenant rendue comme un bloc structuré par ligne job,
  plus lisible que la simple pile de lignes texte initiale.
- L'absence de trace locale pour un job `EMAIL_MESSAGE` est aussi explicitée
  dans la même ligne, y compris avant exécution quand le job est encore
  `PENDING`, au lieu de rester silencieuse.
- Aucun cockpit transverse `email_messages` n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-email-trace-visibility-cadrage.md`.

### 1.20 `engagement.automations` — désactivation et annulation des jobs en attente

- Désactiver une automation ne se contente plus de couper la définition pour le
  futur : les jobs `PENDING` déjà planifiés pour cette automation sont
  maintenant passés en `CANCELLED`.
- Le comportement reste borné au flux `NEWSLETTER_SUBSCRIBED` déjà ouvert.
- La réactivation ultérieure ne relance pas automatiquement les jobs annulés.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-deactivation-cancels-pending-jobs-cadrage.md`.

### 1.21 `engagement.automations` — annulation manuelle d'un job

- `/admin/marketing/automations` permet maintenant d'annuler manuellement un
  job `PENDING` directement depuis sa ligne.
- Le lot reste local au cockpit métier `automations` :
  aucune annulation batch, aucun cockpit transverse `jobs`.

### 1.44 `engagement.automations` — restauration locale des définitions archivées

- `/admin/marketing/automations` expose maintenant aussi une section locale
  des définitions archivées.
- Une définition supprimée de la liste active peut être restaurée depuis cette
  même page, sans route secondaire ni cockpit dédié.
- La restauration remet la définition en `INACTIVE`.
- Si le code d'origine a déjà été repris entre-temps, la restauration applique
  un code de repli lisible pour préserver l'unicité `(storeId, code)` sans
  bloquer l'opération.

### 1.45 `engagement.automations` — restauration locale des jobs archivés

- `/admin/marketing/automations` expose maintenant aussi une section locale
  des jobs archivés.
- Un job supprimé de la liste active peut être restauré depuis cette même page,
  sans cockpit transverse `jobs`.
- Un ancien `PENDING` supprimé par l'admin revient en `PENDING` uniquement si
  son automation liée est encore `ACTIVE`.
- Sinon, la restauration se contente de le remettre visible dans la liste
  active avec son état courant, sans réarmement implicite.

### 1.46 `engagement.automations` — restauration batch locale des archives visibles

- Les sections locales des définitions archivées et des jobs archivés peuvent
  maintenant restaurer en lot les éléments déjà visibles.
- Le lot reste strictement borné au cockpit canonique
  `/admin/marketing/automations`.
- Les automations restaurées en lot gardent la même règle de code de repli si
  le code d'origine a été repris.
- Les jobs restaurés en lot gardent la même règle : réarmement en `PENDING`
  seulement pour un ancien `PENDING` supprimé alors que son automation liée est
  encore `ACTIVE`, sinon simple réaffichage.

### 1.47 `engagement.automations` — filtre local des jobs archivés par statut

- La section locale des jobs archivés peut maintenant être filtrée par statut
  (`PENDING`, `RUNNING`, `FAILED`, `SUCCEEDED`, `CANCELLED`) dans la même page.
- Elle explicite aussi le volume réellement visible par rapport au total
  archivé actuellement relu.
- Un lien local permet de retirer ce filtre sans perdre les autres contextes de
  page déjà actifs.

### 1.48 `engagement.automations` — filtre local des définitions archivées

- La section locale des automations archivées peut maintenant être filtrée entre
  `Code libéré` et `Restauration directe`.
- La section explicite aussi le volume visible par rapport au total relu.
- Un état vide contextuel évite désormais le simple message générique quand le
  filtre ne renvoie aucune définition archivée visible.
- Un lien local permet de retirer ce filtre sans perdre les autres contextes de
  page déjà actifs.
- Le job annulé passe en `CANCELLED` avec une trace explicite d'annulation
  opératoire.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-manual-job-cancel-cadrage.md`.

### 1.22 `engagement.automations` — relance manuelle d'un job échoué

- `/admin/marketing/automations` permet maintenant de relancer localement un
  job `FAILED` depuis sa ligne via `Réessayer`.
- La relance réarme d'abord le job puis réutilise l'exécuteur borné déjà en
  place.
- Aucun retry automatique, aucune politique générique de reprise, aucun worker
  global n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-manual-job-retry-cadrage.md`.

### 1.23 `engagement.automations` — relance batch des jobs échoués visibles

- `/admin/marketing/automations` permet maintenant de relancer en une action
  les jobs `FAILED` déjà visibles dans la page.
- Le batch réutilise strictement la relance unitaire existante et retourne un
  bilan simple succès / échecs.
- Aucun retry automatique, aucune politique globale de reprise, aucun worker
  transverse n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-batch-retry-cadrage.md`.

### 1.24 `engagement.automations` — annulation batch des jobs en attente visibles

- `/admin/marketing/automations` permet maintenant d'annuler en une action les
  jobs `PENDING` déjà visibles dans la page.
- Le batch réutilise strictement l'annulation unitaire existante et retourne un
  bilan simple succès / échecs.
- Aucun cockpit transverse de file, aucune orchestration globale, aucun worker
  n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-batch-cancel-cadrage.md`.

### 1.25 `engagement.automations` — résumé d'activité jobs sur les définitions

- La liste des définitions `Automation` remonte maintenant un résumé local des
  jobs liés : volumes utiles et dernier état connu.
- L'objectif est opératoire : repérer rapidement une automation avec backlog
  ou échec sans ouvrir une vue transverse de file.
- Aucun nouveau contrôle d'exécution n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-definition-job-activity-cadrage.md`.

### 1.26 `engagement.automations` — filtre local des jobs par définition

- Depuis la liste des définitions `Automation`, un opérateur peut maintenant
  focaliser la section jobs sur une automation précise dans la même page.
- La section jobs signale explicitement quand un filtre local est actif et
  permet de revenir à la vue globale.
- Aucun écran détail d'automation ni cockpit transverse de file n'est ajouté
  dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-local-job-filter-by-definition-cadrage.md`.

### 1.27 `engagement.automations` — filtre local des jobs par statut

- La section jobs peut maintenant être filtrée localement par statut
  (`PENDING`, `RUNNING`, `FAILED`, `SUCCEEDED`, `CANCELLED`).
- Le filtre reste combinable avec le focus par définition déjà présent.
- Aucun écran supplémentaire, aucune vue transverse de file, aucun nouveau
  contrôle runtime n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-local-job-filter-by-status-cadrage.md`.

### 1.28 `engagement.automations` — badges d'activité actionnables sur les définitions

- Les badges de résumé d'activité affichés sur chaque définition `Automation`
  servent maintenant aussi de point d'entrée vers la section jobs déjà filtrée.
- Un badge conserve le contexte local cohérent : automation sélectionnée, et
  selon le badge, statut ciblé.
- Aucun nouvel écran ni nouvelle surface transverse n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-definition-activity-badges-link-jobs-cadrage.md`.

### 1.29 `engagement.automations` — filtre local des définitions par activité

- La liste des définitions `Automation` peut maintenant être restreinte dans la
  même page selon l'activité jobs déjà visible : avec jobs, avec attente, avec
  exécutions en cours, avec échecs, sans job.
- Ce filtre reste local à la section définitions et n'ajoute aucune vue
  transverse supplémentaire.
- Les liens vers la section jobs conservent ce contexte local dans la même
  page.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-definition-filter-by-activity-cadrage.md`.

### 1.30 `engagement.automations` — cartes de synthèse jobs actionnables

- Les cartes `Total`, `En attente`, `En cours`, `Échoués` de la section jobs
  servent maintenant aussi de point d'entrée vers le filtre statut existant.
- Cette navigation conserve les autres contextes locaux déjà actifs sur la page
  (`automation`, `definition`).
- Le résumé du dernier job sur une définition sert aussi de raccourci vers la
  vue jobs cohérente pour cette définition.
- Aucun nouvel écran ni filtre concurrent n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-job-stats-link-status-filter-cadrage.md`.

### 1.31 `engagement.automations` — état vide contextuel des jobs filtrés

- La section jobs explique maintenant plus clairement l'absence de résultat
  quand un filtre `automation`, `status` ou les deux ne renvoient aucun job.
- Un raccourci local permet de retirer les filtres jobs tout en conservant le
  contexte `definition`.
- Aucun nouvel écran ni filtre supplémentaire n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-jobs-contextual-empty-state-cadrage.md`.

### 1.32 `engagement.automations` — lien automation depuis une ligne job

- Le code automation affiché sur une ligne job sert maintenant aussi de point
  d'entrée vers le filtre `automation` de la même page.
- Cette focalisation conserve les contextes locaux déjà actifs (`status`,
  `definition`).
- Aucun écran détail supplémentaire n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-job-row-automation-link-cadrage.md`.

### 1.33 `engagement.automations` — lien statut depuis une ligne job

- Le badge statut d'une ligne job sert maintenant aussi de point d'entrée vers
  le filtre `status` de la même page.
- Ce raccourci conserve le contexte `automation` utile et le contexte
  `definition` déjà actif.
- Aucun écran ni filtre concurrent supplémentaire n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-job-row-status-link-cadrage.md`.

### 1.34 `engagement.automations` — libellé explicite de la date job

- La colonne date d'une ligne job précise maintenant si la date affichée
  correspond à une création, une planification, un démarrage ou une fin.
- Un job `PENDING` distingue aussi visuellement un état déjà prêt à exécuter
  d'un état simplement programmé plus tard.
- La même ligne explicite aussi si l'exécution est immédiate, déjà échue ou
  encore future.
- La zone d'action rappelle aussi qu'un job non prêt reste en attente
  d'échéance.
- Les états sans action locale n'affichent plus un simple tiret muet.
- Le résumé batch distingue aussi les jobs déjà prêts des jobs encore en
  attente d'échéance.
- La lecture locale distingue aussi plus clairement une erreur job d'une erreur
  portée par la trace email.
- Aucun historique détaillé ni nouvelle colonne transverse n'est ajouté dans ce
  lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-job-date-label-cadrage.md`.

### 1.35 `engagement.automations` — retrait rapide du filtre statut

- La section jobs rappelle maintenant explicitement le statut actif et propose
  un lien local pour retirer ce filtre.
- Cette remise à zéro conserve les contextes `automation` et `definition`
  encore actifs.
- Aucun filtre ni écran supplémentaire n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-status-filter-reset-link-cadrage.md`.

### 1.36 `engagement.automations` — retrait global des filtres jobs

- La section jobs propose maintenant un lien unique pour retirer d'un coup les
  filtres `automation` et `status`.
- Cette remise à zéro conserve le contexte `definition` déjà actif.
- Aucun nouvel écran ni nouveau filtre n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-reset-all-job-filters-cadrage.md`.

### 1.37 `engagement.automations` — retrait rapide du filtre définitions

- La section définitions rappelle maintenant explicitement le filtre actif et
  propose un lien local pour le retirer.
- Cette remise à zéro conserve les contextes `automation` et `status` encore
  utiles.
- Aucun nouvel écran ni nouveau filtre n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-definition-filter-reset-link-cadrage.md`.

### 1.38 `engagement.automations` — libellés trigger et action sur une ligne job

- Une ligne job explicite maintenant le déclencheur et l'action avec leurs
  libellés métier.
- Aucun nouvel écran, aucune nouvelle colonne transverse ni nouvelle action
  opératoire n'est ajouté dans ce lot.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-job-row-trigger-action-labels-cadrage.md`.

### 1.39 `engagement.automations` — réinitialisation globale des filtres de page

- La page affiche maintenant un bandeau récapitulatif dès qu'un filtre
  `definition`, `automation` ou `status` est actif.
- Ce bandeau permet de retirer en un clic tous les filtres de la page, sans
  devoir nettoyer séparément les sections définitions et jobs.
- Les retraits locaux déjà présents restent disponibles pour les ajustements
  fins.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-page-filters-reset-cadrage.md`.

### 1.40 `engagement.automations` — volume visible dans les actions batch

- Chaque action batch locale expose maintenant directement dans son propre
  libellé combien de jobs visibles seront exécutés, annulés ou relancés.
- Le calcul réutilise strictement les sous-ensembles déjà dérivés dans la page
  (`ready`, `pending`, `failed`) sans changer les handlers ni les règles
  métier.
- Quand aucun job n'est éligible, le bouton reste désactivé avec un libellé
  neutre.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-batch-button-counts-cadrage.md`.

### 1.41 `engagement.automations` — état actif du raccourci dernier job

- Le raccourci « dernier job » affiché sur une définition reflète maintenant
  visuellement lorsqu'il pointe déjà vers la combinaison `automation` +
  `status` actuellement ouverte dans la section jobs.
- Le lien canonique, sa cible et son rôle de raccourci restent inchangés.
- Cadrage :
  `docs/lots/2026-06-14-engagement-automations-latest-job-shortcut-active-state-cadrage.md`.

### 1.42 `engagement.automations` — édition et suppression locale des définitions

- Une définition `Automation` déjà créée peut maintenant être modifiée
  directement depuis sa ligne dans la liste active.
- La suppression opérateur archive désormais cette définition au lieu de la
  détruire physiquement, puis annule ses jobs `PENDING` encore liés.
- Le cockpit reste borné à `/admin/marketing/automations`, sans écran détail
  supplémentaire ni édition des jobs eux-mêmes.
- Cadrage :
  `docs/lots/2026-06-15-engagement-automations-edit-archive-cadrage.md`.

### 1.43 `engagement.automations` — modification et suppression locale d'un job

- Un job `PENDING` visible peut maintenant être replanifié depuis sa ligne ou
  rendu immédiatement exécutable en retirant sa date de planification.
- Un job visible peut aussi être supprimé de la liste active par archivage
  local ; si ce job était encore `PENDING`, il est d'abord annulé.
- Aucun cockpit transverse `jobs`, aucune édition du payload métier ni
  modification d'un job `RUNNING` n'est introduit.
- Cadrage :
  `docs/lots/2026-06-15-engagement-automations-job-edit-delete-cadrage.md`.

---

## 2. Migrations créées (à appliquer : `pnpm prisma migrate dev` + `pnpm db:generate`)

1. `20260613100000_add_feature_levels`
2. `20260614120000_add_order_line_tax_capture`
3. `20260614130000_add_invoice_schema`
4. `20260614143000_add_automation_schema`

## 3. Dépendance ajoutée

- `pdf-lib` (`pnpm add pdf-lib`).

---

## 4. ⚠️ Pièges techniques à connaître (pour Codex)

- **Prisma 7 + `@prisma/adapter-pg` (query compiler TS)** : dans une création
  **imbriquée en relation** (`data: { lines: { create: [...] } }`), il faut
  utiliser `{ relation: { connect: { id } } }`, **pas** la FK scalaire
  (`relationId`). La FK scalaire reste autorisée en **top-level**
  (`create`/`update`/`upsert`/`createMany` directs). **Ne pas mélanger** une
  relation et une FK scalaire au même niveau (erreur XOR `exactOptionalPropertyTypes`).
  Réf : `order.repository.ts`, `issue-credit-note.service.ts`,
  `create-return-request.service.ts`.
- **Feature flags DRAFT par défaut** : chaque module est seedé inactif. Activer
  via `/admin/settings/advanced`. Pattern lien « Réglages » :
  `features/admin/pilotage/components/settings-advanced/feature-flag-entry.tsx`.
- **tsc** nécessite le heap augmenté (déjà câblé dans `package.json`).
- **Vérifications** : `pnpm typecheck` / `pnpm lint` / `pnpm test` en local natif
  (cf. AGENTS.md). Le dernier `typecheck` global était **vert**, `lint` **0
  erreur** (91 warnings `console` préexistants dans scripts/seeds, non bloquants).

## 5. Comment tester un parcours complet

```
pnpm db:seed                 # admin (admin@creatyss.local / AdminDev123!) + flags + taux
pnpm seed:variables          # produits
pnpm catalog:backfill-price-snapshots   # remplit catalogPriceCents (sinon "déclinaison introuvable")
pnpm seed:test-checkout      # active un paiement + une livraison
# Activer commerce.taxation / documents / fulfillment / returns dans /admin/settings/advanced
# Storefront : ajouter au panier → checkout → commande
# Admin commande : préparation, facture (+ PDF), avoir, retour
```

(`pnpm seed:test-order` crée aussi une commande de test directe.)

---

## 6. Décisions à entériner (non bloquantes, à valider)

- **Assiette TTC** des prix (`pricing` stocke TTC, `taxation` dérive HT/TVA) —
  diverge de la prose historique « prix HT ». Cf. `pricing.md` / `taxation.md`.
- **Taux de TVA** (métropole/DOM) : à faire **valider par l'expert-comptable**
  avant production.

---

## 7. Reste à faire

### Dans les modules livrés (incréments)

- **Factures** : Factur-X (PDF/A-3 + XML EN 16931), e-reporting PPF, stockage
  persistant des fichiers (`storageKey`).
- **Taxation** : taux réduits par ciblage catégorie, OSS UE / export hors-UE.
- **Fulfillment** : partiel par quantité, lien shipment. (Impact inventaire :
  doctrine corrigée au 2026-07-01 — `FULFILLED` ne mute jamais le stock,
  consommé à la création de commande ; cf. `fulfillment.md`.)
- **Returns** : sélection lignes/quantités, lien remboursement (avoir/`payments`),
  restock `inventory`, demande côté client (storefront).

### Roadmap point 6 — modules L0 restants (1/32)

- `ai.core` (en dernier)

### Point 5 — `engagement.automations` après ouverture

- `engagement.automations` est désormais **L3 borné avec premier déclencheur
  réel** : feature flag seedé, doc domaine posée, schéma Prisma minimal de
  définition présent, CRUD admin création/liste/activation disponible, et
  planification de `Job` sur `NEWSLETTER_SUBSCRIBED`.
- La prochaine marche reste l'**exécution métier** de ces jobs :
  worker, politiques de reprise et branchement provider, hors périmètre de
  cette session.

Réf. d'ensemble : `docs/roadmap/2026-06-13-audit-catalogue-modules.md`.

---

## 8. Méthode recommandée (rappel AGENTS.md)

Pour chaque nouveau module : **cadrage d'abord** (objectif/périmètre/hors
périmètre/invariants/risques/vérifs/critères de fin), puis implémentation en
petits lots sûrs, puis vérifs (`typecheck`/`lint`/`test`) et doc. Les modèles
Prisma des modules optionnels sont **déjà posés** (souvent pas de migration).
