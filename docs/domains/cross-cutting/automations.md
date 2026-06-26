# Automations

## Rôle

Le domaine `automations` porte les activations marketing automatisées déclenchées
par des signaux métier du système.

Il définit :

- ce qu'est une automation marketing du point de vue du système ;
- comment elle se distingue de la newsletter, des notifications, du workflow
  générique et des jobs techniques ;
- comment des déclencheurs métier peuvent produire une activation marketing
  gouvernée ;
- comment l'état d'une automation reste lisible, traçable et borné ;
- comment le système reste maître de sa vérité interne avant toute intégration
  provider.

Le domaine existe pour éviter deux dérives opposées :

- disperser la logique d'activation marketing dans plusieurs features sans
  frontière claire ;
- traiter un outil externe de marketing automation comme vérité métier locale.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse optionnelle`

### Activable

`oui`

Le domaine `automations` est optionnel du point de vue produit, mais devient
structurant dès lors que le système porte réellement des déclencheurs,
conditions, délais et états d'exécution marketing internes.

---

## Source de vérité

Le domaine `automations` est la source de vérité pour :

- la définition interne d'une automation marketing reconnue par le système ;
- son état d'activation ou de suspension ;
- ses déclencheurs métier explicitement supportés ;
- ses lectures opératoires internes si le modèle les porte ;
- la traçabilité minimale de son exécution ou de son échec si cette
  responsabilité est activée.

Le domaine `automations` n'est pas la source de vérité pour :

- l'abonnement newsletter, qui relève de `newsletter` ;
- la notification transactionnelle, qui relève de `notifications` ;
- l'orchestration métier générique multi-domaines, qui relève de `workflow` ;
- l'exécution asynchrone rejouable, qui relève de `jobs` ;
- les fournisseurs emailing ou CRM externes, qui relèvent de `integrations` ;
- les commandes, paniers, clients et autres vérités métier source.

Une automation marketing n'est ni un simple job différé, ni un workflow
générique, ni une campagne provider externe.

---

## Responsabilités

Le domaine `automations` est responsable de :

- définir ce qui constitue une automation marketing interne ;
- borner les déclencheurs marketing explicitement reconnus ;
- exposer une lecture gouvernée des automations actives, suspendues ou
  archivées si le modèle les porte ;
- expliciter la frontière entre signal source, orchestration et action
  marketing ;
- protéger le système contre les automations implicites, opaques ou
  contradictoires.

Selon le périmètre retenu plus tard, le domaine peut également être responsable de :

- relance panier abandonné ;
- relance post-achat ;
- bienvenue abonné ;
- délais ou fenêtres de déclenchement ;
- journal minimal d'exécution ;
- suspension manuelle d'une automation.

---

## Non-responsabilités

Le domaine `automations` n'est pas responsable de :

- définir la vérité du panier, de la commande ou du client ;
- gérer l'abonnement newsletter ;
- porter les notifications transactionnelles ;
- devenir le moteur de workflow générique du système ;
- devenir la file technique d'exécution ;
- porter les secrets provider ou l'intégration externe complète ;
- se substituer à `marketing` tout entier.

Le domaine `automations` ne doit pas devenir :

- un alias flou de "campagnes marketing" ;
- un simple miroir d'un outil externe ;
- un conteneur fourre-tout de règles événementielles sans langage métier clair.

---

## Invariants

Les invariants minimaux sont les suivants :

- une automation possède un déclencheur explicite et interprétable ;
- une automation active ne doit pas masquer son domaine source ;
- un déclenchement différé ne doit pas être confondu avec un job technique sans
  contexte métier ;
- une suspension doit être visible comme telle ;
- une exécution marketing ne doit pas réécrire silencieusement la vérité métier
  de son domaine source ;
- les frontières avec `newsletter`, `notifications`, `workflow` et `jobs`
  doivent rester explicites.

Le domaine protège la gouvernance des activations marketing internes, pas la
totalité de la relation client.

Dans le cockpit admin borné actuellement livré, la lecture opératoire doit
rester explicite : filtres actifs, compteurs et sous-ensembles visibles doivent
être compréhensibles sans inspection transverse supplémentaire.
Chaque ligne job peut aussi exposer un identifiant court local de référence,
distinct de toute vue transverse globale des logs techniques.

---

## Dépendances

### Dépendances métier

Le domaine `automations` interagit fortement avec :

- `marketing`
- `newsletter`
- `customers`
- `orders`
- `checkout`
- `notifications`

### Dépendances transverses

Le domaine dépend également de :

- `workflow`
- `jobs`
- `audit`
- `observability`
- `template-system`

### Dépendances externes

Le domaine peut interagir avec :

- plateformes emailing ;
- CRM ;
- outils de marketing automation ;
- fournisseurs de notifications ou de messaging.

### Règle de frontière

Le domaine `automations` porte la gouvernance interne des activations
marketing automatisées.
Il ne doit pas absorber :

- la vérité métier source ;
- la file d'exécution technique ;
- les contrats providers ;
- la newsletter comme domaine autonome ;
- la couche marketing entière.

---

## Événements significatifs

Le domaine `automations` publie ou peut publier des événements significatifs tels que :

- automation créée ;
- automation activée ;
- automation suspendue ;
- automation déclenchée ;
- automation ignorée faute de précondition ;
- automation exécutée ;
- automation échouée ;
- automation archivée.

Le domaine peut consommer des signaux liés à :

- panier abandonné détecté ;
- commande payée ;
- inscription newsletter confirmée ;
- capability boutique modifiée ;
- reprise manuelle autorisée.

Les noms exacts doivent rester exprimés dans le langage métier du système.

---

## Cycle de vie

Le domaine `automations` possède un cycle de vie partiel.

Le cycle exact reste à stabiliser, mais il doit au minimum distinguer :

- brouillon ;
- actif ;
- suspendu ;
- archivé.

Selon le modèle retenu, des états d'exécution ou d'instance peuvent exister :

- planifié ;
- en attente ;
- exécuté ;
- ignoré ;
- échoué.

Le domaine doit éviter :

- les automations fantômes ;
- les états purement techniques non interprétables ;
- les déclenchements silencieux sans lecture opératoire.

---

## Interfaces et échanges

Le domaine `automations` expose principalement :

- des lectures d'automations configurées ;
- des commandes d'activation, suspension ou archivage si cette responsabilité
  est portée ;
- des lectures opératoires sur les déclenchements ou exécutions si le modèle les porte ;
- des événements significatifs liés à son cycle de vie.

Le domaine reçoit principalement :

- des événements métier source ;
- des décisions opératoires admin ;
- des préconditions issues de `newsletter`, `customers`, `orders` ou `consent`
  selon les cas ;
- des demandes d'exécution différée via `jobs`.

Le domaine ne doit pas exposer un contrat dicté par un outil externe.

Dans le cockpit admin borné actuellement livré sur
`/admin/marketing/automations` :

- les définitions actives peuvent être créées, modifiées, activées,
  désactivées et archivées localement ;
- les définitions archivées restent visibles dans la même page et peuvent être
  restaurées sans quitter cette route canonique ;
- ces définitions archivées peuvent aussi être restaurées en lot tant qu'elles
  sont déjà visibles dans la même page ;
- ces restaurations locales restent des actions opératoires explicites,
  confirmées avant exécution ;
- la section des définitions archivées peut aussi être filtrée localement entre
  `Code libéré` et `Restauration directe`, avec comptage visible, état vide
  contextuel, retrait explicite et maintien du focus dans la même zone ;
- ces filtres de définitions archivées peuvent aussi afficher directement leurs
  volumes connus, pour rendre la corbeille locale plus lisible ;
- la carte `Archives` peut aussi retirer d'un coup tous ses filtres locaux sans
  toucher aux filtres encore actifs sur les définitions ou jobs non archivés ;
- chaque définition archivée rappelle aussi localement si elle emporte ou non
  des jobs archivés liés, pour éviter de confondre définition et exécution ;
- cette même ligne peut aussi proposer des raccourcis locaux par statut vers la
  section `Jobs archivés` liée à cette définition ;
- une restauration remet la définition en `INACTIVE` ;
- si son code d'origine a déjà été repris par une autre définition active, la
  restauration conserve un code de repli local lisible au lieu de casser la
  contrainte d'unicité.
- les jobs archivés restent eux aussi relisibles localement dans la même page ;
- ces jobs archivés peuvent eux aussi être restaurés en lot tant qu'ils sont
  déjà visibles dans la même page ;
- ces restaurations locales restent elles aussi confirmées avant exécution ;
- la section des jobs archivés peut aussi être filtrée localement par statut,
  avec comptage visible, retrait explicite et maintien du focus dans la même
  zone ;
- cette même section peut aussi être focalisée localement sur une automation
  archivée précise depuis la ligne de définition correspondante ;
- chaque job archivé peut aussi refocaliser localement la section des
  automations archivées sur sa définition liée quand elle est encore présente ;
- quand ce focus définition archivée est actif, la section correspondante le
  rappelle aussi localement et garde la ligne ciblée visuellement identifiable ;
- ce focus définition archivée peut aussi être retiré directement depuis la
  section `Automations archivées`, sans passer par la section `Jobs archivés` ;
- si un filtre d'archives masque temporairement la définition actuellement
  focalisée, la section doit aussi l'expliciter localement au lieu de laisser
  disparaître silencieusement la ligne ciblée ;
- de même, si une automation archivée focalisée possède bien des jobs archivés
  mais aucun dans le statut filtré, la section `Jobs archivés` doit l'expliquer
  localement et proposer le retrait de ce filtre statut ;
- quand un focus automation archivée est actif dans `Jobs archivés`, la section
  rappelle aussi localement le volume global de jobs archivés liés et leur
  répartition connue par statut ;
- dans ce même contexte, les filtres de statut peuvent aussi exposer
  directement les volumes connus pour cette automation focalisée ;
- quand ce filtre d'archives ne renvoie aucun résultat, la section explicite
  aussi localement que le vide vient du statut sélectionné ;
- restaurer un job réarme seulement un ancien `PENDING` supprimé par l'admin
  quand son automation liée est encore `ACTIVE` ; sinon la restauration ne fait
  que le remettre visible.

---

## Contraintes d'intégration

Le domaine `automations` peut être exposé à des contraintes telles que :

- déclenchement différé ;
- idempotence ;

## Décisions d'implémentation

### CRUD admin des définitions, sans runtime (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-crud-cadrage.md`.

- `/admin/marketing/automations` expose un référentiel admin réel des
  définitions `Automation` ;
- création en `DRAFT`, liste et activation/désactivation ;
- aucune exécution métier, aucun run model, aucun provider branché dans ce lot.

### Premier déclencheur réel via `jobs` : `NEWSLETTER_SUBSCRIBED` (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-newsletter-trigger-cadrage.md`.

- la souscription storefront newsletter déclenche désormais une recherche des
  automations `ACTIVE` avec `triggerType = NEWSLETTER_SUBSCRIBED` ;
- pour chaque définition active correspondante, le système crée un `Job`
  `PENDING`, `scheduledAt` selon `delayMinutes` ;
- la transaction reste atomique avec la mutation `NewsletterSubscriber` ;
- frontière assumée :
  - `newsletter` = vérité d'abonnement ;
  - `automations` = définition ;
  - `jobs` = intention planifiée ;
  - aucun worker, aucune exécution provider dans ce lot.

### Visibilité admin des jobs planifiés (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-jobs-visibility-cadrage.md`.

- `/admin/marketing/automations` affiche désormais une lecture bornée des jobs
  planifiés par le déclencheur `NEWSLETTER_SUBSCRIBED` ;
- la vue reste locale au domaine `automations` et ne remplace pas
  `maintenance/logs` ;
- aucun contrôle opératoire sur les jobs n'est ajouté dans ce lot.

### Exécution manuelle bornée `EMAIL_MESSAGE` (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-email-message-execution-cadrage.md`.

- `/admin/marketing/automations` permet désormais d'exécuter manuellement un
  job d'automation `PENDING` et prêt ;
- lot strictement borné à :
  - `triggerType = NEWSLETTER_SUBSCRIBED` ;
  - `actionType = EMAIL_MESSAGE` ;
  - template `newsletter-welcome` ou défaut nul ;
- l'envoi s'appuie sur le provider transactionnel existant et crée une trace
  `EmailMessage` dédiée ;
- aucun worker automatique, aucun retry générique et aucun template éditable
  ne sont ajoutés ici.

### Exécution batch des jobs visibles (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-batch-execution-cadrage.md`.

- `/admin/marketing/automations` peut maintenant exécuter en une fois les jobs
  prêts déjà visibles dans la page ;
- le batch réutilise strictement l'exécuteur unitaire existant ;
- le lot reste borné :
  - jobs visibles uniquement ;
  - taille limitée ;
  - aucun worker, aucune orchestration globale.

### Visibilité locale de la trace email (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-email-trace-visibility-cadrage.md`.

- `/admin/marketing/automations` relie maintenant chaque job à sa trace
  `EmailMessage` quand elle existe ;
- la page expose localement : destinataire, statut email, provider,
  référence provider et dernière erreur ;
- cette lecture locale est maintenant rendue comme un bloc structuré par job,
  pour rester exploitable sans ouvrir un cockpit transverse ;
- l'absence de trace locale sur un job `EMAIL_MESSAGE` est aussi explicitée,
  y compris avant exécution quand le job est encore `PENDING`, au lieu de
  rester implicite dans l'interface ;
- cette lecture reste volontairement locale au domaine `automations` et
  n'ouvre aucun cockpit transverse `email_messages`.

### Désactivation admin et annulation des jobs en attente (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-deactivation-cancels-pending-jobs-cadrage.md`.

- désactiver une définition `Automation` annule maintenant ses jobs `PENDING`
  déjà planifiés dans le flux `NEWSLETTER_SUBSCRIBED` ;
- cette annulation est une suspension opératoire, pas un échec technique ;
- la réactivation ultérieure ne rejoue pas automatiquement les jobs annulés.

### Annulation manuelle d'un job `PENDING` (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-manual-job-cancel-cadrage.md`.

- `/admin/marketing/automations` permet maintenant d'annuler manuellement un
  job `PENDING` directement depuis sa ligne ;
- cette annulation reste locale au cockpit métier `automations` ;
- aucun batch d'annulation ni cockpit transverse `jobs` n'est ajouté.

### Modification et suppression locale d'un job visible (2026-06-15)

Cf.
`docs/lots/2026-06-15-engagement-automations-job-edit-delete-cadrage.md`.

- un job `PENDING` visible peut maintenant être replanifié localement depuis sa
  ligne, ou rendu immédiatement exécutable en retirant sa date ;
- un job visible peut aussi être retiré de la liste active par archivage local ;
- si ce job était encore `PENDING`, il est d'abord annulé pour éviter toute
  exécution tardive après suppression locale ;
- cette capacité reste bornée au cockpit `automations` et ne crée aucune vue
  transverse générique des jobs.

### Relance manuelle d'un job `FAILED` (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-manual-job-retry-cadrage.md`.

- `/admin/marketing/automations` permet maintenant de relancer localement un
  job `FAILED` depuis sa ligne ;
- la relance réarme le job puis réutilise l'exécuteur borné existant ;
- aucun retry automatique ni politique générique de reprise n'est ajouté.

### Relance batch des jobs `FAILED` visibles (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-batch-retry-cadrage.md`.

- `/admin/marketing/automations` peut maintenant relancer en une fois les jobs
  `FAILED` déjà visibles dans la page ;
- le batch réutilise strictement la relance unitaire existante ;
- aucun retry automatique ni orchestration transverse de file n'est ajouté.

### Annulation batch des jobs `PENDING` visibles (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-batch-cancel-cadrage.md`.

- `/admin/marketing/automations` peut maintenant annuler en une fois les jobs
  `PENDING` déjà visibles dans la page ;
- le batch réutilise strictement l'annulation unitaire existante ;
- aucun cockpit transverse de file ni orchestration globale n'est ajouté.

### Résumé d'activité jobs sur les définitions (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-definition-job-activity-cadrage.md`.

- la liste des définitions `Automation` expose maintenant un résumé local de
  leurs jobs liés ;
- le cockpit remonte au minimum les volumes utiles et le dernier état connu ;
- le résumé du dernier job sert aussi maintenant de raccourci vers la vue jobs
  cohérente pour cette même définition ;
- ce même raccourci reflète aussi désormais visuellement lorsqu'il correspond
  déjà à la vue jobs actuellement active ;
- cette lecture reste locale à `automations` et n'ouvre aucune vue transverse.

### Filtre local des jobs par définition (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-local-job-filter-by-definition-cadrage.md`.

- une définition `Automation` permet maintenant de focaliser localement la
  section jobs sur ses occurrences liées ;
- le filtre reste cantonné à `/admin/marketing/automations` ;
- le retour à la vue globale reste immédiat dans la même page.

### Filtre local des jobs par statut (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-local-job-filter-by-status-cadrage.md`.

- la section jobs peut maintenant être focalisée localement sur un statut
  précis ;
- ce filtre reste combinable avec le focus par définition ;
- il reste strictement borné au cockpit local `automations`.

### Badges d'activité actionnables sur les définitions (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-definition-activity-badges-link-jobs-cadrage.md`.

- les badges de résumé affichés sur une définition `Automation` peuvent
  maintenant ouvrir la section jobs locale cohérente ;
- cette navigation réutilise les filtres automation + statut déjà présents ;
- elle reste strictement locale à `/admin/marketing/automations`.

### Filtre local des définitions par activité jobs (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-definition-filter-by-activity-cadrage.md`.

- la liste des définitions peut maintenant être restreinte localement selon
  l'activité jobs déjà connue ;
- ce filtre ne change pas la frontière du module et ne crée aucune vue
  transverse ;
- les liens existants vers la section jobs conservent ce contexte local.

### Cartes de synthèse jobs actionnables (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-job-stats-link-status-filter-cadrage.md`.

- les cartes de synthèse de la section jobs peuvent maintenant ouvrir le filtre
  statut cohérent ;
- cette navigation conserve aussi les contextes locaux `automation` et
  `definition` déjà actifs ;
- elle reste locale au cockpit `automations`.

### État vide contextuel des jobs filtrés (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-jobs-contextual-empty-state-cadrage.md`.

- la section jobs explique maintenant si le vide vient d'un filtre automation,
  statut, ou des deux ;
- elle propose aussi un retour local vers une vue jobs plus large ;
- cette remise à zéro conserve le contexte `definition` déjà actif.

### Lien automation depuis une ligne job (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-job-row-automation-link-cadrage.md`.

- chaque ligne job peut maintenant refocaliser la page sur son automation ;
- ce lien conserve les contextes locaux `status` et `definition` déjà actifs ;
- il reste borné à la même page `automations`.

### Lien statut depuis une ligne job (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-job-row-status-link-cadrage.md`.

- le badge statut d'une ligne peut maintenant refocaliser la vue sur ce statut ;
- ce lien conserve le contexte `automation` pertinent et le contexte
  `definition` actif ;
- il reste local au cockpit `automations`.

### Libellé explicite de la date job (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-job-date-label-cadrage.md`.

- la colonne date d'une ligne job précise maintenant si la date affichée est
  une création, une planification, un démarrage ou une fin ;
- un job `PENDING` distingue aussi désormais visuellement un état déjà prêt à
  exécuter d'un simple état programmé plus tard ;
- la même ligne précise aussi explicitement si l'exécution est immédiate,
  déjà échue ou encore future ;
- la zone d'action rappelle aussi désormais qu'un job `PENDING` non prêt reste
  en attente d'échéance ;
- les états sans action locale n'affichent plus un simple tiret muet, mais un
  libellé passif explicite ;
- le résumé batch distingue aussi désormais les jobs déjà prêts des jobs encore
  en attente d'échéance ;
- les libellés mêmes des actions batch reprennent aussi désormais le volume
  visible ciblé directement dans chaque bouton ;
- la lecture locale distingue aussi explicitement l'erreur du job de l'erreur
  éventuelle de la trace email ;
- cette lecture reste locale et n'introduit aucune timeline transverse ;
- elle ne modifie aucune logique d'exécution.

### Retrait rapide du filtre statut actif (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-status-filter-reset-link-cadrage.md`.

- la section jobs rappelle maintenant explicitement le statut actif ;
- elle propose aussi un retrait rapide de ce filtre dans la même zone ;
- cette remise à zéro conserve les contextes `automation` et `definition`
  encore utiles.

### Retrait global des filtres jobs (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-reset-all-job-filters-cadrage.md`.

- la section jobs propose maintenant un retour direct à la vue globale locale ;
- ce retrait simultané efface `automation` + `status` ;
- il conserve le contexte `definition` actif.

### Retrait rapide du filtre définitions (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-definition-filter-reset-link-cadrage.md`.

- la section définitions rappelle maintenant explicitement le filtre actif ;
- elle propose un retrait rapide de ce filtre dans la même zone ;
- ce retrait conserve les contextes jobs encore utiles.

### Réinitialisation globale des filtres de page (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-page-filters-reset-cadrage.md`.

- `/admin/marketing/automations` expose maintenant un bandeau unique quand au
  moins un filtre `definition`, `automation` ou `status` est actif ;
- ce bandeau résume l'état courant et permet de revenir en un clic à la vue
  complète de la page ;
- les retraits locaux déjà présents restent en place pour les ajustements fins.

### Libellés trigger et action sur une ligne job (2026-06-14)

Cf.
`docs/lots/2026-06-14-engagement-automations-job-row-trigger-action-labels-cadrage.md`.

- chaque ligne job explicite maintenant le déclencheur et l'action avec leurs
  libellés métier ;
- cette lecture reste purement locale et n'ajoute aucune nouvelle colonne ;
- elle ne modifie aucune logique d'exécution.

### Exécution automatique bornée des jobs (script + cron) (2026-06-15)

Cf.
`docs/lots/2026-06-15-engagement-automations-run-jobs-script-cadrage.md`.

- un script `scripts/run-automation-jobs.ts` (commande `pnpm run
automations:run-jobs`) sélectionne les jobs `PENDING` dus
  (`AUTOMATION_NEWSLETTER_SUBSCRIBED`, `archivedAt: null`,
  `scheduledAt <= now`), limités à un lot borné, et appelle pour chacun
  l'exécuteur unitaire `executeAutomationJob` ;
- ce script réutilise strictement le claim atomique existant
  (PENDING → RUNNING, `count === 1`), ce qui le rend sûr à rejouer ou à
  chevaucher ;
- destiné à être déclenché périodiquement par un cron système sur le VPS
  cible ; la configuration effective de ce cron reste hors périmètre (suite
  opérationnelle, pas de code) ;
- le cockpit manuel `/admin/marketing/automations` reste inchangé : ce script
  est un complément, pas un remplacement ;
- aucun nouveau modèle Prisma, aucune nouvelle route, aucun retry générique.

Points d'attention persistants :

- reprise manuelle ;
- exécution partielle ;
- divergence entre état interne et outil externe ;
- dépendance à des templates ou providers indisponibles.

Règles minimales :

- la frontière entre définition métier et exécution technique doit rester
  visible ;
- un provider externe ne doit pas devenir la seule trace d'exécution ;
- toute reprise ou annulation opératoire doit être traçable ;
- un échec d'intégration ne doit pas corrompre silencieusement l'état interne.

---

## Observabilité et audit

Le domaine `automations` doit rendre visibles au minimum :

- quelle automation est active ;
- quel déclencheur a été reçu ;
- quelle automation a été exécutée, ignorée, suspendue ou échouée ;
- quel contexte boutique ou cible était concerné ;
- quel écart existe entre définition interne et exécution externe éventuelle.

Le domaine doit rester auditable dès qu'il produit des activations réelles.

---

## Impact de maintenance / exploitation

Le domaine `automations` a un impact d'exploitation moyen à élevé dès qu'il est
activé.

Une attention particulière doit être portée à :

- la lisibilité des déclencheurs supportés ;
- les doublons ou déclenchements intempestifs ;
- la dérive de périmètre vers `workflow` ou `jobs` ;
- les effets de bord sur newsletter, notifications et relation client ;
- la reprise opératoire en cas d'échec provider.

Tant qu'aucun schéma métier n'est posé, le domaine doit rester considéré comme
cadre doctrinal et non comme fonctionnalité opérationnelle aboutie.

---

## Limites du domaine

Le domaine `automations` s'arrête :

- avant la vérité métier des objets source ;
- avant la newsletter comme vérité d'abonnement ;
- avant les notifications transactionnelles ;
- avant l'orchestration générique multi-domaines ;
- avant les intégrations providers complètes ;
- avant le moteur d'exécution technique lui-même ;
- avant l'orchestration externe (n8n).

Le domaine `automations` porte les activations marketing internes reconnues par
le système.
Il ne doit pas devenir un moteur générique de processus ni un doublon des
outils externes.

n8n est l'orchestrateur **externe** auto-hébergé sur le VPS personnel. Il
orchestre des flux autour de Creatyss (notifications, rapports, synchronisations
tierces) sans implémenter de logique métier. Ces deux périmètres sont distincts
et complémentaires — cf.
`../../architecture/40-exploitation/43-infrastructure-observabilite-automatisation.md`.

---

## Questions ouvertes

À trancher explicitement dans le projet :

- la frontière exacte entre `automations` et `marketing` ;
- la frontière exacte entre `automations` et `workflow` ;
- la liste canonique des déclencheurs supportés en V1 ;
- l'existence d'un modèle unique `Automation` ou d'une séparation entre
  définition et exécution ;
- la dépendance exacte à `jobs` pour les délais type panier abandonné ;
- l'articulation avec `newsletter`, `consent` et `template-system`.

Le schéma Prisma et les interfaces admin réelles restent à cadrer avant toute
implémentation métier.

---

## Décisions d'implémentation

### Placeholder pilotable, sans schéma métier (2026-06-14)

Cf. `docs/lots/2026-06-14-engagement-automations-cadrage.md`.

- `engagement.automations` (`FeatureFlag`) est seedé en `DRAFT`, inactif par
  défaut, sans niveaux (`prisma/seed/automations-feature-flag.seed.ts`).
- `/admin/marketing/automations` reste un `AdminComingSoon` volontairement
  borné : aucun schéma Prisma, aucune query métier, aucune exécution
  d'automation n'est introduite dans ce lot.
- Ce premier increment ferme l'écart documentaire et rend le module pilotable
  depuis `settings/advanced` sans inventer une architecture d'exécution non
  tranchée.

### Schéma minimal de définition, sans exécution (2026-06-14)

Cf. `docs/lots/2026-06-14-engagement-automations-schema-cadrage.md`.

- `prisma/optional/engagement/automations.prisma` pose un modèle
  `Automation` centré sur la **définition gouvernée** :
  `code`, `name`, `status`, `triggerType`, `actionType`, `delayMinutes`,
  `templateCode`, `configJson`, `createdByUserId`.
- Les déclencheurs V1 restent bornés à un petit vocabulaire interne
  (`CART_ABANDONED`, `ORDER_PLACED`, `NEWSLETTER_SUBSCRIBED`,
  `CUSTOMER_CREATED`, `MANUAL`, `OTHER`) ; les actions restent elles aussi
  bornées (`EMAIL_MESSAGE`, `NEWSLETTER_CAMPAIGN`, `NOTIFICATION`, `WEBHOOK`,
  `OTHER`).
- **Aucun modèle d'exécution** (`AutomationExecution`, `AutomationRun`,
  retries, journal de jobs) n'est ajouté dans ce lot pour ne pas dupliquer
  `jobs`, `scheduling` ou `workflow`.
- `/admin/marketing/automations` reste volontairement un placeholder : le
  schéma existe désormais, mais aucun CRUD admin ni moteur d'exécution n'est
  introduit ici.

### CRUD admin des définitions, sans runtime (2026-06-14)

Cf. `docs/lots/2026-06-14-engagement-automations-crud-cadrage.md`.

- `/admin/marketing/automations` n'est plus un placeholder : la page expose
  désormais un référentiel admin réel des définitions `Automation`
  (création + liste + activation/désactivation), puis leur édition inline et
  leur archivage local.
- Les champs exposés restent volontairement bornés :
  `code`, `name`, `description`, `triggerType`, `actionType`,
  `delayMinutes`, `templateCode`.
- Toute nouvelle automation est créée en `DRAFT`, puis activable
  explicitement depuis la liste.
- Une définition existante peut aussi être corrigée depuis la même liste sans
  écran détail dédié.
- La suppression opérateur archive la définition et annule ses jobs `PENDING`
  encore liés, afin de ne pas laisser d'exécutions en attente pour une entrée
  retirée du référentiel actif.
- **Aucune exécution runtime** n'est encore branchée : activer une definition
  ne crée ni job, ni run, ni email, ni notification, ni webhook dans ce lot.

## Documents liés

- `marketing.md`
- `workflow.md`
- `newsletter.md`
- `notifications.md`
- `template-system.md`
- `../core/commerce/orders.md`
- `../core/commerce/customers.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/40-exploitation/43-infrastructure-observabilite-automatisation.md`
