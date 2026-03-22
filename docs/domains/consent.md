# Domaine consent

## Rôle

Le domaine `consent` porte les consentements et préférences réglementées du socle.

Il structure l’expression, la preuve, l’état et le périmètre des consentements qu’un acteur donne, retire ou refuse pour certains usages sensibles, notamment liés à la mesure, au marketing ou à certaines communications, sans absorber les abonnements fonctionnels, la newsletter, les notifications transactionnelles ou le tracking lui-même.

## Responsabilités

Le domaine `consent` prend en charge :

- les consentements explicites
- les refus explicites
- les retraits de consentement
- les preuves de consentement
- les catégories de consentement
- les états de consentement par acteur, contexte et finalité
- la lecture exploitable des consentements applicables
- la base réglementée consommable par `tracking`, `attribution`, `newsletter`, `marketing`, `integrations` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `consent` ne doit pas :

- porter les abonnements fonctionnels, qui relèvent de `subscriptions`
- porter la newsletter elle-même, qui relève de `newsletter`
- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter les signaux de tracking, qui relèvent de `tracking`
- porter les campagnes marketing, qui relèvent de `marketing`
- devenir un fourre-tout de toutes les préférences utilisateur, même lorsqu’elles ne sont pas de nature réglementée ou sensible

Le domaine `consent` porte les consentements réglementés ou sensibles. Il ne remplace ni `subscriptions`, ni `newsletter`, ni `notifications`, ni `tracking`.

## Sous-domaines

- `categories` : catégories ou finalités de consentement
- `records` : enregistrements de consentement, refus ou retrait
- `proofs` : preuves et métadonnées de recueil
- `policies` : règles d’application et de lecture du consentement

## Entrées

Le domaine reçoit principalement :

- des demandes de recueil de consentement
- des refus explicites
- des retraits de consentement
- des demandes de lecture du consentement applicable à une finalité donnée
- un contexte acteur, boutique, canal, finalité et instant de référence
- des demandes de consultation de preuve ou d’historique de consentement

## Sorties

Le domaine expose principalement :

- des états de consentement structurés
- des catégories de consentement
- des preuves de consentement ou de retrait
- une lecture exploitable par `tracking`, `attribution`, `newsletter`, `marketing`, `integrations`, `audit` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `consent` peut dépendre de :

- `users` pour certains acteurs authentifiés
- `customers` pour certains acteurs métier non strictement assimilés à un compte utilisateur
- `store` pour le contexte boutique et certaines politiques locales
- `audit` pour tracer les changements sensibles ou consultations critiques
- `observability` pour expliquer pourquoi un traitement sensible a été autorisé, bloqué ou neutralisé

Les domaines suivants peuvent dépendre de `consent` :

- `tracking`
- `attribution`
- `newsletter`
- `marketing`
- `integrations`
- `dashboarding`
- certaines couches d’administration

## Capabilities activables liées

Le domaine `consent` n’est pas une capability métier optionnelle au sens classique.

Il fait partie de l’architecture transverse de gouvernance des traitements sensibles.

En revanche, ses usages deviennent particulièrement importants lorsque certaines capabilities sont actives, par exemple :

- `tracking`
- `analytics`
- `attribution`
- `marketingPixels`
- `serverSideTracking`
- `newsletter`
- `marketingCampaigns`
- `behavioralAnalytics`
- `clickTracking`
- `productViewTracking`

### Règle

Le domaine `consent` reste présent même si certains traitements sensibles sont désactivés.

Il constitue la base commune de gouvernance des finalités soumises à consentement ou à refus explicite.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager` en lecture partielle selon la politique retenue
- `customer_support` en lecture très encadrée selon la politique retenue
- `customer` pour ses propres consentements selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `consent.read`
- `consent.write`
- `customers.read`
- `newsletter.read`
- `tracking.read`
- `marketing.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `consent.given`
- `consent.refused`
- `consent.withdrawn`
- `consent.record.updated`
- `consent.policy.updated`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `customer.created`
- `user.created`
- `store.capabilities.updated`
- certaines actions structurées de recueil ou de retrait issues des couches applicatives

Il doit toutefois rester maître de sa propre vérité de consentement.

## Intégrations externes

Le domaine `consent` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consulté par `integrations` pour savoir si un traitement externe sensible est autorisé, mais :

- la vérité du consentement reste dans `consent`
- les DTO providers externes restent dans `integrations`
- les abonnements fonctionnels restent dans `subscriptions`

## Données sensibles / sécurité

Le domaine `consent` manipule des données hautement sensibles de gouvernance réglementée.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- conservation d’une preuve suffisante du recueil, refus ou retrait
- séparation claire entre consentement réglementé, abonnement fonctionnel et préférence non sensible
- limitation de l’exposition des détails selon le rôle, le scope et la finalité
- audit des consultations ou modifications sensibles si la politique retenue l’exige

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel consentement a été donné, refusé ou retiré
- pour quelle finalité et dans quel contexte
- quelle preuve ou quel mode de recueil a été retenu
- pourquoi un traitement sensible a été autorisé, bloqué ou neutralisé
- si une absence de traitement vient d’un refus, d’un retrait, d’une absence de recueil ou d’une règle de politique applicable

### Audit

Il faut tracer :

- le recueil d’un consentement
- le refus d’un consentement
- le retrait d’un consentement
- les changements sensibles de politique de consentement
- certaines consultations sensibles si le modèle final les retient explicitement

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ConsentCategory` : catégorie ou finalité de consentement
- `ConsentRecord` : enregistrement de consentement, refus ou retrait
- `ConsentStatus` : état du consentement pour une finalité donnée
- `ConsentProof` : preuve ou métadonnée de recueil
- `ConsentScope` : périmètre d’application du consentement
- `ConsentActorRef` : référence vers l’acteur concerné

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un consentement est rattaché à une finalité explicite
- un consentement est rattaché à un acteur explicite lorsque cela est possible
- un consentement possède un état explicite
- `consent` ne se confond pas avec `subscriptions`
- `consent` ne se confond pas avec `newsletter`, `notifications` ou `tracking`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente du consentement quand le cadre commun `consent` existe
- une absence de consentement applicable peut neutraliser un traitement sensible sans supprimer la structure du domaine consommateur

## Cas d’usage principaux

1. Recueillir un consentement pour une finalité de tracking
2. Enregistrer un refus de consentement marketing
3. Retirer un consentement précédemment donné
4. Vérifier si une finalité donnée est autorisée pour un acteur donné
5. Fournir à `tracking`, `attribution` ou `newsletter` une lecture fiable du consentement applicable
6. Exposer à l’admin une lecture claire et gouvernée des états de consentement

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- catégorie de consentement introuvable
- acteur introuvable
- preuve absente ou invalide selon la politique retenue
- tentative de traitement sensible sans consentement applicable
- conflit entre état de consentement et autre règle réglementée plus forte
- tentative d’exposition d’un détail sensible dans un contexte non autorisé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `consent` porte les consentements réglementés ou sensibles du socle
- `consent` est distinct de `subscriptions`
- `consent` est distinct de `newsletter`
- `consent` est distinct de `notifications`
- `consent` est distinct de `tracking`
- les domaines consommateurs lisent la vérité du consentement via `consent`, sans la recréer localement
- les preuves, états et consultations sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les consentements réglementés ou sensibles relèvent de `consent`
- les abonnements fonctionnels relèvent de `subscriptions`
- la newsletter relève de `newsletter`
- les notifications transactionnelles relèvent de `notifications`
- les signaux de mesure relèvent de `tracking`
- `consent` ne remplace ni `subscriptions`, ni `newsletter`, ni `notifications`, ni `tracking`, ni `integrations`
