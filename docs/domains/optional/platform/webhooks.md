# Webhooks

## Rôle

Le domaine `webhooks` porte la livraison sortante de signaux internes vers des endpoints externes abonnés : déclaration des endpoints, sélection des événements souscrits, signature, envoi, retry et traçabilité des livraisons.

Il définit :

- comment un endpoint externe s'abonne à des événements internes ;
- comment un événement interne est transformé en livraison HTTP sortante ;
- comment chaque livraison est signée et authentifiable par le destinataire ;
- comment le système gère les échecs, les retries et l'idempotence des livraisons ;
- comment les livraisons restent observables et auditables de bout en bout.

Le domaine existe pour isoler un mécanisme de sortie exposé et non fiable par nature (endpoints tiers indisponibles, lents ou défaillants), distinct :

- des intégrations au sens large ;
- des domaines métier qui émettent les événements ;
- des clients API ;
- des traitements asynchrones génériques.

La **réception** de webhooks émis par des tiers (PSP, transporteurs, providers) ne relève pas de ce domaine : elle est portée par les routes d'intégration dédiées de chaque fournisseur (ex. la route Stripe), sous la doctrine de `integrations` et des domaines consommateurs (`payments`, `shipping`, …).

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `webhooks` est non optionnel dès lors que le système notifie des consommateurs externes via ce mécanisme. Son exposition applicative est gouvernée par le flag gradué `platform.webhooks`.

---

## Source de vérité

Le domaine `webhooks` est la source de vérité pour :

- le référentiel des endpoints sortants (URL cible, événements souscrits, secret, état) ;
- la politique de signature des livraisons sortantes ;
- la politique de retry et d'échéancement des livraisons ;
- l'historique et les états de chaque livraison ;
- la traçabilité spécifique aux sorties webhook.

Le domaine `webhooks` n'est pas la source de vérité pour :

- la vérité métier des événements émis (commande, paiement, expédition) ;
- la politique générale d'intégration au sens large, qui relève de `integrations` ;
- la réception de webhooks entrants émis par des tiers ;
- les sessions, utilisateurs ou autorisations ;
- l'exécution générique des jobs, qui relève de `jobs`.

Le webhook sortant est un mécanisme de notification.
Il n'est pas, à lui seul, un domaine métier.

---

## Responsabilités

Le domaine `webhooks` est responsable de :

- gérer le cycle de vie des endpoints (création, activation, désactivation) ;
- filtrer les événements internes vers les endpoints abonnés ;
- construire des payloads versionnés et stables pour l'extérieur ;
- signer chaque livraison (HMAC) de façon vérifiable par le destinataire ;
- livrer de façon asynchrone sans bloquer le flux métier émetteur ;
- créer une trace de livraison pour chaque tentative, y compris en échec ;
- retenter les livraisons échouées selon une politique explicite et bornée ;
- exposer l'historique des livraisons et la relance opératoire.

---

## Non-responsabilités

Le domaine `webhooks` n'est pas responsable de :

- définir la logique métier des événements qu'il transporte ;
- recevoir ou normaliser des webhooks entrants de fournisseurs ;
- structurer toute la politique d'intégration du système ;
- gouverner les rôles, permissions ou utilisateurs ;
- porter la vérité métier finale des objets notifiés ;
- garantir le traitement effectué par le destinataire.

Le domaine `webhooks` ne doit pas devenir :

- un bus d'événements généraliste interne ;
- ni un fourre-tout pour "tout ce qui sort vers l'extérieur".

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- toute livraison tentée doit être traçable (`WebhookDelivery` créé même en échec) ;
- la livraison ne doit jamais bloquer le flux applicatif émetteur (asynchrone obligatoire) ;
- chaque livraison doit être signée avec le secret de l'endpoint ; le secret n'est jamais réexposé en clair dans l'UI après création ;
- une même occurrence d'événement ne doit pas produire de double livraison vers un même endpoint (idempotence par clé) ;
- les retries doivent être bornés (`maxAttempts`) et espacés ;
- un endpoint désactivé ne reçoit aucune livraison ;
- les transitions d'état d'une livraison doivent être cohérentes et observables.

Le domaine protège le système contre la fragilité intrinsèque des destinataires externes.

---

## Dépendances

### Dépendances métier

Le domaine `webhooks` consomme des événements émis par les domaines, notamment :

- `orders` (ex. `order.created`)
- `payments`, `shipping`, `fulfillment`, `customers`, selon les événements ouverts

### Dépendances transverses

Le domaine dépend également de :

- jobs (livraison asynchrone et retry) ;
- audit ;
- observabilité ;
- sécurité (secrets, signature) ;
- feature flags (`platform.webhooks`, gradation `read` / `manage` / `retry`).

### Dépendances externes

Les destinataires sont des endpoints HTTP externes arbitraires déclarés par l'exploitant.

### Règle de frontière

Le domaine `webhooks` notifie et trace.
Il n'absorbe ni la vérité métier des événements, ni la relation d'intégration entrante avec les fournisseurs.

---

## Événements significatifs

Le domaine `webhooks` publie ou peut publier des événements significatifs tels que :

- livraison planifiée ;
- livraison réussie ;
- livraison échouée (HTTP, timeout, réseau) ;
- livraison retentée ;
- livraison abandonnée (tentatives épuisées) ;
- endpoint activé / désactivé.

Le domaine consomme les événements métier ouverts à l'abonnement, au format de payload versionné interne (`creatyss.*.v1`).

---

## Cycle de vie

Une livraison doit au minimum distinguer :

- en attente (planifiée) ;
- en cours ;
- réussie ;
- échouée (retentable) ;
- abandonnée (tentatives épuisées) ;
- relancée manuellement.

Le domaine doit éviter :

- les états implicites ;
- les transitions silencieuses ;
- les livraisons "perdues" sans statut observable.

---

## Interfaces et échanges

Le domaine `webhooks` expose principalement :

- l'administration des endpoints (`/admin/settings/webhooks`, gradation `platform.webhooks`) ;
- l'historique des livraisons et la relance opératoire ;
- des livraisons HTTP sortantes signées (`X-Webhook-Signature: sha256=<hex>`, `X-Webhook-Event`).

Le domaine reçoit principalement :

- des événements métier internes à livrer ;
- des demandes opératoires (création d'endpoint, activation, relance).

Le payload livré est un contrat externe versionné : il ne doit pas exposer les modèles internes bruts.

---

## Contraintes d'intégration

Le domaine `webhooks` est exposé à des contraintes fortes et spécifiques :

- endpoints indisponibles, lents ou définitivement morts ;
- réponses d'erreur arbitraires ;
- besoin d'idempotence côté destinataire (livraisons rejouées) ;
- confidentialité du secret de signature ;
- volumétrie de retries sur endpoint défaillant.

Règles minimales :

- chaque livraison est signée et horodatée ;
- les retries sont bornés et espacés (backoff) ;
- les erreurs sont visibles dans l'historique ;
- la relance manuelle est possible mais tracée ;
- un endpoint en échec permanent ne doit pas générer un volume de tentatives non borné.

---

## Observabilité et audit

Le domaine `webhooks` doit rendre visibles au minimum :

- les livraisons tentées, réussies, échouées, abandonnées ;
- le nombre de tentatives par livraison ;
- la requête envoyée et la réponse reçue (tronquée) ;
- les relances manuelles ;
- l'état de santé par endpoint (derniers succès/échec).

L'audit doit permettre de répondre à des questions comme :

- quel événement a été livré, à quel endpoint, quand ;
- avec quel statut et combien de tentatives ;
- avec quel payload et quelle réponse ;
- avec quelle intervention opératoire éventuelle.

---

## Impact de maintenance / exploitation

Le domaine `webhooks` a un impact d'exploitation élevé.

Raisons :

- il dépend de destinataires externes non fiables ;
- ses échecs sont silencieux pour le métier si la traçabilité est faible ;
- il peut générer une volumétrie de retries significative ;
- ses secrets exigent une discipline stricte.

En exploitation, une attention particulière doit être portée à :

- les files d'échec et les livraisons abandonnées ;
- les endpoints en échec permanent ;
- la rotation des secrets ;
- les relances manuelles.

---

## Limites du domaine

Le domaine `webhooks` s'arrête :

- avant la vérité métier des domaines émetteurs ;
- avant la politique d'intégration globale (`integrations`) ;
- avant la réception entrante des webhooks fournisseurs (routes d'intégration dédiées) ;
- avant l'exécution générique des jobs (`jobs`) ;
- avant les mécanismes de sécurité non spécifiques aux webhooks.

Le domaine `webhooks` gouverne un mécanisme de sortie.
Il ne doit pas absorber toute la relation d'intégration du système.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- l'ouverture d'événements au-delà de `order.created` (ex. `order.shipped`, sans point d'émission observé à ce jour) ;
- le chiffrement réversible du secret d'endpoint (stockage V1 en clair documenté, service de chiffrement inexistant dans le repo — cadrage séparé) ;
- un éventuel circuit-breaker par endpoint au-delà du plafond `maxAttempts` par livraison ;
- la politique de rotation des secrets.

---

## Decisions d'implementation

### Cadrage 2026-06-14 (cf. `docs/lots/2026-06-14-platform-webhooks-cadrage.md`)

- **Point d'entree admin** : page discrète `/admin/settings/webhooks`,
  reliee au `FeatureFlag` actif dans `/admin/settings/advanced`.
- **Perimetre du lot** : seed `FeatureFlag`, gating et lecture admin seule du
  referentiel Prisma actuel `WebhookEndpoint` / `WebhookDelivery`.
- **Divergence majeure constatee** : la doctrine initiale de ce document decrivait un
  pipeline de **webhooks entrants** (reception, validation, normalisation),
  tandis que le modele Prisma decrit un mecanisme de **delivery vers endpoints**.
  Divergence documentee a cette date, resolue le 2026-07-05 (voir plus bas).

### Bilan d'execution (2026-06-14)

Premier increment runnable livre :

- seed `FeatureFlag` DRAFT via `prisma/seed/webhooks-feature-flag.seed.ts` ;
- query de gating `isWebhooksFeatureActive()` ;
- lecture admin `getAdminWebhooksSnapshot()` :
  compteurs + derniers endpoints + dernieres deliveries ;
- page `/admin/settings/webhooks` ;
- lien « Reglages » ajoute depuis `/admin/settings/advanced` quand la feature est active.

### Gradation 2026-07-03

`platform.webhooks` est gradué dans `FEATURE_CATALOG` parce que le code expose
trois paliers distincts sur le modèle réel `WebhookEndpoint` / `WebhookDelivery` :

- `read` : lecture admin des endpoints et deliveries via
  `getAdminWebhooksSnapshot()`.
- `manage` : création d'endpoint et activation/désactivation via
  `createWebhookEndpointAction()` et `toggleWebhookEndpointAction()`.
- `retry` : relance manuelle d'une delivery en échec via
  `retryWebhookDeliveryAction()`.

### Décision de sémantique 2026-07-05 (cf. `docs/lots/2026-07-05-platform-webhooks-semantique.md`)

La divergence entrants/sortants est tranchée en faveur du **modèle observé** :
`platform.webhooks` est le domaine des **webhooks sortants (delivery)**. La
doctrine ci-dessus est réécrite en conséquence. La réception entrante reste
portée par les routes d'intégration dédiées par fournisseur (ex.
`app/api/stripe/webhook`), sous `integrations.md` et les domaines
consommateurs. Aucun redesign Prisma n'est requis.

---

## Documents liés

- `../../../architecture/30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
- `../../../architecture/30-execution/33-modele-de-defaillance-et-idempotence.md`
- `integrations.md`
- `../commerce/payments.md`
- `../../core/commerce/orders.md`
- `../commerce/shipping.md`
- `../../cross-cutting/jobs.md`
- `../../cross-cutting/observability.md`
