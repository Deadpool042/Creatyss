# Politique d'exécution des effets externes

## Rôle

Le domaine `execution-policy` porte la décision transverse qui distingue une exécution `TEST` d'une exécution `LIVE` pour tout effet externe du système (email, webhook sortant, paiement, et toute future intégration sortante).

Il existe pour garantir qu'aucun environnement autre que la production réelle ne puisse produire un effet externe irréversible (email transactionnel réel, appel webhook réel, paiement réel), même lorsque les crons et la logique métier tournent réellement partout.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse non optionnelle`

### Activable

`non`

Le domaine est structurel dès lors qu'un effet externe existe dans le système. Il n'a pas de statut d'activation propre — il gouverne l'activation des effets, il n'est pas lui-même une capacité optionnelle.

---

## Source de vérité

Le domaine `execution-policy` est la source de vérité pour :

- la résolution du mode d'exécution (`TEST` ou `LIVE`) applicable à un effet externe donné, à un instant donné.

Il combine deux entrées dont il n'est pas lui-même la source :

- l'environnement technique (`APP_RUNTIME_ENV`, variable serveur immuable au runtime, hors de portée de l'admin) ;
- le mode opérationnel de la boutique (`Store.isProduction`, éditable en admin).

Aucune de ces deux entrées prise seule ne fait autorité sur le mode d'exécution. Seule leur combinaison, calculée par ce domaine, fait autorité.

---

## Responsabilités

Le domaine :

- définit le vocabulaire des environnements techniques, des modes opérationnels boutique, des modes d'exécution et des natures d'effets externes ;
- calcule, de façon pure, le mode d'exécution résultant d'un environnement technique et d'un mode boutique donnés ;
- fournit ce calcul comme unique point de résolution pour tout adaptateur d'infrastructure produisant un effet externe.

---

## Non-responsabilités

Le domaine ne possède pas et ne décide pas :

- l'implémentation des adaptateurs d'infrastructure (email, webhook, paiement) — ceux-ci restent dans `features/email`, `features/webhooks`, `core/payments` ;
- la neutralisation effective d'un effet externe en mode `TEST` (provider simulé, court-circuit réseau) — décidée et implémentée par chaque adaptateur (`SimulatedEmailProvider`, `simulateWebhookDelivery`), pas par ce domaine ;
- la journalisation du mode d'exécution en base (colonne `executionMode`) — décision prise de ne pas en ajouter (email et webhook réutilisent leurs champs existants) ;
- la gouvernance produit des features (`FeatureFlag`, `FEATURE_CATALOG`) — un effet peut être en mode `TEST` alors que sa feature est active, ce sont deux axes orthogonaux.

---

## Invariants

- `LIVE` n'est jamais atteint autrement que par la conjonction stricte : environnement technique `production` **et** mode boutique `production`.
- `APP_RUNTIME_ENV` n'a aucune valeur par défaut : une instance qui démarre sans cette variable, ou avec une valeur hors de l'énumération, échoue immédiatement au parse de la configuration serveur (`core/config/env/server.ts`), avant toute résolution de politique. Aucune ambiguïté ne peut donc atteindre le résolveur.
- Une fois l'environnement technique validé et fourni au résolveur, toute combinaison autre que `production` + boutique `production` résout en mode `TEST` (fail-safe au niveau du calcul, distinct de l'échec au démarrage ci-dessus).
- Le résolveur est une fonction pure : mêmes entrées, même sortie, aucun accès réseau ni base de données.

---

## Dépendances

- Dépendance technique vers `core/config/env/server.ts` : lecture de `APP_RUNTIME_ENV`.
- Dépendance métier vers `Store.isProduction` (modèle `foundation.store`) : lue par l'appelant, jamais par le domaine lui-même (le résolveur reste pur et ne requête pas Prisma).
- Aucune dépendance vers `features/**` : ce domaine est une préoccupation transverse d'infrastructure, pas un domaine métier.

---

## Événements significatifs

Non applicable à ce stade. Le domaine ne publie ni ne consomme d'événement métier — il expose un calcul synchrone consommé directement par les adaptateurs.

---

## Cycle de vie

Non applicable. Le domaine ne porte aucune entité à états ; il calcule une valeur à chaque appel.

---

## Interfaces et échanges

`resolveExecutionPolicy(input)` reste le résolveur pur : il prend l'environnement technique et le mode boutique déjà connus, et retourne une `ExecutionPolicy`. Il n'accède ni à Prisma ni à `serverEnv`.

`resolveStoreExecutionPolicy(input)` est le point de composition réellement consommé par les adaptateurs : il lit `APP_RUNTIME_ENV` via `serverEnv` et combine ce résultat avec le `Store.isProduction` fourni par l'appelant, puis délègue à `resolveExecutionPolicy`. C'est cette fonction que tout adaptateur d'effet externe doit appeler — jamais `resolveExecutionPolicy` directement, sauf test unitaire du résolveur pur lui-même.

Adaptateurs consommant `resolveStoreExecutionPolicy` à ce jour :

- `features/email/**` (email transactionnel, contact, newsletter, automations) ;
- `features/webhooks/**` (livraison automatique et relance manuelle) ;
- `features/commerce/payment/**` et `features/admin/commerce/returns/**` (démarrage de paiement Stripe et remboursement).

---

## Contraintes d'intégration

Non applicable dans ce lot : le domaine n'a, à ce stade, aucune intégration branchée. Les contraintes d'idempotence et de retry relèveront des adaptateurs consommateurs (email, webhook, paiement), pas de ce domaine.

---

## Observabilité et audit

Hors périmètre de ce lot. La traçabilité du mode d'exécution par exécution (journalisation `executionMode` sur `Job`, `WebhookDelivery`, `EmailMessage`) est prévue dans un lot ultérieur du cadrage.

---

## Impact de maintenance / exploitation

Risque majeur si ce domaine était mal utilisé : un appelant qui contournerait `resolveExecutionPolicy` pour décider lui-même du mode recréerait une duplication de logique de sécurité. La règle d'usage est stricte : tout futur adaptateur d'effet externe doit consommer ce résolveur, jamais réimplémenter sa propre condition sur `NODE_ENV` ou `Store.isProduction`.

---

## Limites du domaine

Le domaine expose uniquement le calcul de politique (`resolveExecutionPolicy`, `resolveStoreExecutionPolicy`). Les adaptateurs email, webhook et paiement (Stripe : démarrage de paiement, remboursement) consomment désormais ce calcul et neutralisent leur propre trafic externe en mode `TEST`.

---

## Questions ouvertes

Aucune à ce stade pour le périmètre de ce lot. Les questions ouvertes du cadrage complet (provider simulé, colonne de journalisation, confirmation admin au passage en production) sont hors périmètre et seront traitées dans leurs lots respectifs.

---

## Documents liés

- `docs/architecture/30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
- `docs/exploitation/07-cron-automations.md`
- `core/config/env/server.ts`
- `prisma/core/foundation/store.prisma`
