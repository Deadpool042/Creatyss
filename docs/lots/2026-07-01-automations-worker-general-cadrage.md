# Cadrage — Automations : généraliser le worker et l'admin de jobs à plusieurs `typeCode`

**Date :** 2026-07-01
**Statut :** cadrage — aucune implémentation dans ce lot
**Roadmap liée :** `docs/roadmap/h3-administration-avancee/lot-automations-worker-general.md`

---

## 0. Constat de départ (Observé)

- `queue-order-placed-automation-jobs.service.ts` crée déjà des `Job`
  `typeCode = AUTOMATION_ORDER_PLACED` en base, appelé depuis
  `features/commerce/orders/lib/order.repository.ts`.
- `run-automation-jobs-batch.service.ts` ne traite que
  `SUPPORTED_JOB_TYPE_CODES = [AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE]`
  → les jobs `ORDER_PLACED` créés en base ne sont jamais sélectionnés,
  jamais exécutés, jamais recovery/retry.
- `execute-automation-job.service.ts` filtre en dur
  `typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE` et exige un champ
  `newsletterSubscriberId` obligatoire dans le payload → une exécution
  manuelle d'un job `ORDER_PLACED` échouerait de toute façon
  (`job_not_found`, puisque le `typeCode` ne matche pas le filtre).
- Les 5 services admin de gestion de jobs (`restore`, `reschedule`,
  `archive`, `cancel`, `retry`) filtrent tous en dur sur
  `AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE`, avec un patron identique
  (find → vérification de statut → `updateMany`). Aucune divergence de
  logique entre les 5 au-delà du `typeCode` et des transitions de statut
  autorisées.
- Le vrai écran d'administration des jobs d'automation
  (`features/admin/marketing/automations/queries/list-admin-automation-jobs.query.ts`,
  `list-admin-archived-automation-jobs.query.ts`,
  `list-admin-automations.query.ts`,
  `list-admin-archived-automations.query.ts`, actions
  `toggle-automation-status.action.ts`, `archive-automation.action.ts`)
  filtre lui aussi en dur sur `AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE`
  pour compter/lister/archiver les jobs liés à une automation. Cette
  surface est plus large que les seuls 5 services admin mentionnés dans
  la roadmap.
- `get-admin-newsletter-automation-snapshot.query.ts` filtre lui aussi
  sur le type newsletter, mais c'est correct par conception : c'est un
  panneau spécifique au domaine newsletter, pas un gap.
- `/admin/maintenance/logs` (`list-admin-jobs.query.ts`) et
  `/admin/maintenance/observability` (`get-admin-system-health.query.ts`)
  sont déjà **agnostiques au `typeCode`** — ils listent/agrègent tous les
  `Job` sans filtre de type. Ces deux pages couvrent donc déjà, sans
  aucune modification, la visibilité minimale demandée par le critère de
  fin « l'état du worker est visible dans l'observabilité admin
  existante ».
- Les deux services de mise en file (`queue-newsletter-subscribed-...`
  et `queue-order-placed-...`) posent déjà `subjectType`/`subjectId`
  génériques sur la ligne `Job` (`AUTOMATION_NEWSLETTER_SUBSCRIBER_SUBJECT_TYPE`
  / `newsletterSubscriberId` d'un côté, `AUTOMATION_ORDER_SUBJECT_TYPE`
  / `orderId` de l'autre). `execute-automation-job.service.ts` ignore
  totalement ces colonnes et redérive l'identité du sujet depuis un champ
  `newsletterSubscriberId` obligatoire caché dans `payloadJson` — alors
  que la clé de dispatch générique existe déjà sur la ligne `Job`.
- Les deux services de mise en file fixent `maxAttempts: 1` : il n'y a
  aujourd'hui **aucun retry automatique**, ni pour `NEWSLETTER_SUBSCRIBED`
  ni pour `ORDER_PLACED`. La logique d'auto-retry dans
  `run-automation-jobs-batch.service.ts` (FAILED avec
  `attemptCount < maxAttempts` → PENDING) est déjà générique et
  fonctionnera pour tout `typeCode` ajouté à `SUPPORTED_JOB_TYPE_CODES`
  sans modification — mais elle ne se déclenchera jamais tant que
  `maxAttempts` reste à 1 pour les deux types.
- Grep confirmé : le modèle `Job` (`prisma/cross-cutting/jobs.prisma`,
  `typeCode: String` libre, non-enum) n'est utilisé aujourd'hui que par
  le domaine `automations`. Les autres occurrences de `typeCode` dans le
  repo appartiennent à un modèle `Document` sans rapport
  (`features/admin/commerce/documents/**`).

---

## 1. Dispatch multi-`typeCode` dans le batch et l'exécution

### Décision

- Remplacer la constante figée `SUPPORTED_JOB_TYPE_CODES` par un tableau
  explicite listant tous les `typeCode` d'automation connus
  (`AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE`,
  `AUTOMATION_ORDER_PLACED_JOB_TYPE`, futurs types), défini une seule fois
  dans `features/automations/shared/automation-job.constants.ts` (ex.
  `AUTOMATION_JOB_TYPE_CODES`). `run-automation-jobs-batch.service.ts`
  l'importe pour la recovery, l'auto-retry et la sélection des jobs dus.
  Aucune autre logique de `run-automation-jobs-batch.service.ts` n'a
  besoin de changer : recovery, auto-retry et sélection sont déjà
  génériques sur `typeCode`.
- Dans `execute-automation-job.service.ts`, remplacer le filtre unique
  `typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE` par
  `typeCode: { in: AUTOMATION_JOB_TYPE_CODES }`, puis dispatcher
  l'exécution réelle par `typeCode` (ou par `triggerType`/`actionType`
  lu dans le payload, les deux existent déjà) vers une fonction
  spécifique par type de déclencheur. Le tronc commun (claim atomique
  `PENDING → RUNNING`, incrément `attemptCount`, transition finale
  `SUCCEEDED`/`FAILED`, écriture `resultJson`/`errorCode`/`errorMessage`)
  reste unique ; seule la résolution du sujet et le rendu du contenu
  (template email, destinataire) varient par type.
- Généraliser le parsing de payload : arrêter d'exiger
  `newsletterSubscriberId` en dur. Deux options équivalentes en coût,
  la première étant préférée car elle s'appuie sur ce qui existe déjà :
  1. **(recommandé)** lire `subjectType`/`subjectId` directement depuis
     la ligne `Job` (déjà posés par les deux services de mise en file)
     pour résoudre l'entité cible, et garder `payloadJson` uniquement
     pour les données non structurelles (`templateCode`, `automationId`,
     `automationCode`). Le dispatch devient : `subjectType ===
     "NEWSLETTER_SUBSCRIBER"` → handler newsletter, `subjectType ===
     "ORDER"` → handler commande.
  2. Garder un payload par type avec un champ discriminant commun
     (`schema`) et un `parseXxxPayload` par type, dispatché par
     `typeCode`. Plus proche du code actuel mais duplique ce que
     `subjectType`/`subjectId` offrent déjà gratuitement.
  Recommandation : option 1, car elle évite d'ajouter une couche de
  discrimination redondante avec des colonnes déjà présentes et déjà
  renseignées par les deux producteurs de jobs existants.
- Le rendu du contenu (template email `ORDER_PLACED` vs
  `NEWSLETTER_SUBSCRIBED`) reste dans `features/email/automation/`,
  avec un nouveau template ou une nouvelle branche dans
  `buildAutomationEmailTemplate` gardée derrière
  `isSupportedAutomationEmailTemplateCode`. Ne pas mélanger la
  résolution de template avec le dispatch de job : le job dispatch
  décide *quelle* automation/entité traiter, le template décide du
  *contenu*.

### Risque

- Le dispatch par `typeCode` dans `execute-automation-job.service.ts`
  ne doit pas dupliquer le tronc commun claim/finalisation : prévoir une
  fonction interne unique qui appelle un handler `(storeId, subjectId,
  payload) => Promise<ExecutionResult>` par type, pour éviter que chaque
  nouveau type de déclencheur réécrive sa propre gestion d'erreur.

---

## 2. Généralisation des services admin de gestion de jobs

### Décision

- Les 5 services (`restore`, `reschedule`, `archive`, `cancel`,
  `retry`) partagent un patron identique (find → vérification de statut
  → `updateMany` sur `id` + `storeId` + `typeCode` + `archivedAt`).
  Confirmé par lecture complète des 5 fichiers : aucune divergence
  métier entre types au-delà du filtre `typeCode` lui-même. La
  généralisation est donc un remplacement mécanique et sûr :
  `typeCode: AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE` →
  `typeCode: { in: AUTOMATION_JOB_TYPE_CODES }` dans les clauses `where`
  des 5 services, sans changer la forme des fonctions ni leur signature.
- Le grep confirme que le modèle `Job` est exclusif au domaine
  `automations` aujourd'hui (aucun autre domaine n'y écrit). Le risque
  de « laisser l'admin agir sur des jobs d'un autre domaine » est donc
  nul dans l'état actuel du repo — mais utiliser une constante
  `AUTOMATION_JOB_TYPE_CODES` explicite (plutôt que retirer le filtre
  `typeCode`) reste la bonne pratique : `Job` est classé
  `Category: cross-cutting` dans Prisma et pourrait accueillir d'autres
  producteurs à l'avenir. Ne jamais retirer complètement le filtre de
  `typeCode`.
- Périmètre plus large que celui mentionné dans la roadmap : la
  généralisation ne doit pas s'arrêter aux 5 services évoqués. Les
  requêtes/actions de `features/admin/marketing/automations/` qui
  filtrent aussi en dur sur `AUTOMATION_NEWSLETTER_SUBSCRIBED_JOB_TYPE`
  doivent être traitées dans le même micro-lot, sinon l'écran
  d'administration des automations (liste des jobs par automation,
  compteurs, archivage en cascade depuis une automation) restera
  aveugle aux jobs `ORDER_PLACED` alors que le worker les exécutera :
  - `list-admin-automation-jobs.query.ts`
  - `list-admin-archived-automation-jobs.query.ts`
  - `list-admin-automations.query.ts`
  - `list-admin-archived-automations.query.ts`
  - `toggle-automation-status.action.ts`
  - `archive-automation.action.ts`
  Ces fichiers parsent aussi `payloadJson` avec un type
  `AutomationJobPayload` local incluant `newsletterSubscriberId` en dur
  (`list-admin-automation-jobs.query.ts`) — à généraliser en cohérence
  avec la décision du point 1 (lire `subjectType`/`subjectId` plutôt que
  re-parser un champ spécifique).
- Ne pas généraliser `get-admin-newsletter-automation-snapshot.query.ts` :
  filtrage newsletter correct par conception (panneau dédié au domaine
  newsletter), pas un gap à corriger.

### Risque de duplication

- Le patron find/updateMany des 5 services est déjà dupliqué 5 fois
  aujourd'hui (avant même ce lot). Ce cadrage ne demande pas de le
  refactorer en une fonction générique paramétrée — ce serait un
  refactor opportuniste hors périmètre. Se limiter au remplacement du
  filtre `typeCode` dans chacun des 5 fichiers existants, en gardant la
  structure actuelle.

---

## 3. Politique de retry / `maxAttempts`

### Observé

- `run-automation-jobs-batch.service.ts` implémente déjà un mécanisme
  générique d'auto-retry (`FAILED` avec `attemptCount < maxAttempts` →
  `PENDING`) et de recovery (`RUNNING` bloqué >15min → `FAILED`), tous
  deux déjà filtrés sur `SUPPORTED_JOB_TYPE_CODES`. Une fois ce tableau
  étendu (point 1), ces deux mécanismes s'appliqueront à `ORDER_PLACED`
  sans aucune autre modification.
- Mais les deux services de mise en file fixent `maxAttempts: 1` en
  dur : dans les faits, **aucun retry automatique n'a jamais lieu**
  aujourd'hui, pour aucun type. L'auto-retry existe dans le batch mais
  ne se déclenche jamais faute de marge (`attemptCount` atteint
  `maxAttempts` dès le premier échec).

### Décision (à valider, hors périmètre d'exécution de ce cadrage)

- Ne pas changer `maxAttempts` pour `NEWSLETTER_SUBSCRIBED` dans ce lot
  (hors scope, pas demandé).
- Pour `ORDER_PLACED`, envisager `maxAttempts: 2` ou `3` : un email de
  confirmation de commande non envoyé a un impact client plus visible
  qu'un email de bienvenue newsletter manqué. C'est une **recommandation
  fonctionnelle à valider avec le porteur produit**, pas une décision
  technique arbitrable dans ce cadrage — signalé comme point ouvert.
- Aucun changement de la politique de backoff : le lot roadmap exclut
  explicitement les retry policies avec backoff exponentiel.

---

## 4. Observabilité admin

### Observé

- `/admin/maintenance/logs` (`list-admin-jobs.query.ts`) liste déjà tous
  les jobs sans filtre de `typeCode`, avec compteurs par statut
  (`pending`, `running`, `failed`, `succeeded`, `cancelled`, `total`).
- `/admin/maintenance/observability` (`get-admin-system-health.query.ts`)
  agrège déjà `db.job.groupBy({ by: ["status"] })` sans filtre de
  `typeCode`, alimentant la carte « Jobs échoués » de la page.

### Décision

- **Aucune modification requise** sur ces deux pages pour satisfaire le
  critère de fin « l'état du worker est visible dans l'observabilité
  admin existante » — c'est déjà le cas dès que `ORDER_PLACED` sera
  traité par le batch (point 1), les jobs `ORDER_PLACED` apparaîtront
  automatiquement dans `/admin/maintenance/logs` avec leur `typeCode`
  affiché en clair.
- Amélioration optionnelle (hors critère de fin, à trancher séparément) :
  ajouter une ventilation par `typeCode` dans `/admin/maintenance/logs`
  ou `/admin/maintenance/observability` si le volume de types justifie
  un jour de distinguer visuellement newsletter vs commande. Ne pas le
  faire dans ce lot : pas demandé par les critères de fin, ajouterait un
  micro-lot non nécessaire.
- Le point réellement à corriger n'est pas l'observabilité générique
  (déjà bonne) mais l'écran métier dédié
  `features/admin/marketing/automations/` (point 2), qui lui filtre en
  dur et deviendrait incohérent (jobs `ORDER_PLACED` invisibles depuis
  la fiche automation qui les a produits) si le point 2 n'est pas traité
  dans le même lot que le point 1.

---

## 5. Invariants à préserver (rappel roadmap, vérifiés compatibles)

- Claim atomique `PENDING → RUNNING` via `updateMany` avec `count === 1`
  vérifié : déjà en place dans `execute-automation-job.service.ts`,
  inchangé par la généralisation — le tronc commun de claim ne dépend
  pas du `typeCode`.
- Jobs `RUNNING`/`SUCCEEDED`/`CANCELLED` jamais re-traités : déjà garanti
  par les clauses `where: { status: "PENDING" }` dans la sélection —
  générique, pas affecté par l'ajout de types.
- Pas de blocage de la réponse HTTP : `run-automation-jobs-batch` est
  déjà appelé de façon synchrone mais bornée (`batchSize`) depuis la
  route cron ; l'ajout de types ne change pas ce contrat.
- Automations `INACTIVE` ne génèrent pas de jobs : déjà vérifié dans les
  deux services de mise en file (`status: "ACTIVE"` dans le `where` sur
  `automation.findMany`) — pas de changement nécessaire.

---

## 6. Découpage en micro-lots proposé

1. **Lot A — constante partagée + batch + exécution**
   - Ajouter `AUTOMATION_JOB_TYPE_CODES` dans
     `automation-job.constants.ts`.
   - Étendre `run-automation-jobs-batch.service.ts` au tableau.
   - Généraliser `execute-automation-job.service.ts` : dispatch par
     `subjectType`/`typeCode`, parsing de payload par type, handler
     `ORDER_PLACED` (résolution commande + template).
   - Nouveau template email `order-placed` dans
     `features/email/automation/automation-email-templates.ts`
     (contenu à valider avec le porteur produit — hors cadrage
     technique).
   - Tests unitaires : sélection multi-type, dispatch, non-régression
     newsletter.

2. **Lot B — admin services de gestion de jobs (5 fichiers)**
   - Remplacer le filtre `typeCode` unique par `{ in:
     AUTOMATION_JOB_TYPE_CODES }` dans `restore`, `reschedule`,
     `archive`, `cancel`, `retry`.
   - Tests ciblés sur chaque service pour un job `ORDER_PLACED`.

3. **Lot C — écran admin `marketing/automations` (jobs par automation)**
   - Généraliser les 4 queries et 2 actions listées en section 2.
   - Généraliser le parsing `AutomationJobPayload` en cohérence avec le
     dispatch par `subjectType` du Lot A.
   - Vérifier l'affichage des jobs `ORDER_PLACED` dans la fiche
     automation correspondante.

4. **Lot D — politique de retry `ORDER_PLACED` (conditionnel)**
   - À déclencher uniquement si le porteur produit valide l'ajustement
     de `maxAttempts` pour `ORDER_PLACED`. Pas de changement de
     `NEWSLETTER_SUBSCRIBED`.

Aucun lot dédié à l'observabilité (`/admin/maintenance/*`) : déjà
générique, satisfait par effet de bord des lots A et B.

---

## 7. Risques

- **Risque principal** : traiter uniquement les 5 services admin de la
  roadmap (Lot B) sans le Lot C laisserait l'écran métier dédié aux
  automations incohérent avec le worker — les jobs `ORDER_PLACED`
  seraient exécutés mais invisibles/inagissables depuis la fiche
  automation qui les a créés, uniquement visibles depuis
  `/admin/maintenance/logs` (générique, sans contexte automation).
- **Risque de contenu** : le template email `ORDER_PLACED` n'est pas
  spécifié dans la roadmap ni dans ce cadrage — contenu, sujet, données
  affichées restent à valider avant le Lot A.
- **Risque de retry silencieux** : si `maxAttempts` est augmenté pour
  `ORDER_PLACED` sans revoir l'idempotence de l'action (envoi email),
  un retry pourrait renvoyer un email déjà envoyé si l'échec survient
  après l'envoi mais avant l'écriture `SUCCEEDED`. À vérifier lors du
  Lot D : `createAutomationEmailIfAbsent` semble déjà protéger contre ce
  cas via une contrainte d'unicité sur `jobId`, mais ce n'est pas vérifié
  dans ce cadrage (Observé partiellement — à confirmer avant le Lot D).
- **Risque de scope creep** : ne pas transformer ce lot en refactor
  générique du CRUD de jobs (paramétrer les 5 services en une seule
  fonction générique) — hors périmètre, micro-lots doivent rester des
  remplacements mécaniques de filtre.

---

## 8. Agent recommandé pour l'implémentation

- `next-feature-builder` pour les Lots A, B, C (code applicatif
  `features/automations/**` et `features/admin/marketing/automations/**`).
- `prisma-architect` non nécessaire : aucun changement de schéma
  (`Job` supporte déjà plusieurs `typeCode` par conception, `typeCode`
  est une string libre non-enum).
- `test-engineer` pour les tests unitaires du dispatch multi-type et le
  test d'intégration bout-en-bout (`order créée → job PENDING →
  worker → job SUCCEEDED`) mentionné dans les vérifications de la
  roadmap.
- `docs-keeper` pour mettre à jour
  `docs/roadmap/h3-administration-avancee/lot-automations-worker-general.md`
  une fois les lots A-C livrés (déplacer les items de « Restant » vers
  « Observé comme implémenté »).

---

## 9. Ce que ce cadrage ne tranche pas

- Le contenu exact du template email `ORDER_PLACED` (sujet, corps,
  données commande affichées).
- La valeur définitive de `maxAttempts` pour `ORDER_PLACED` (Lot D,
  conditionnel, décision produit).
- L'opportunité d'une ventilation par `typeCode` dans l'observabilité
  admin (amélioration optionnelle, non requise par les critères de fin).
