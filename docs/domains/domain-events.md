# Domaine domain-events

## Rôle

Le domaine `domain-events` porte les événements internes structurés du socle.

Il formalise les faits métier internes déjà validés par les autres domaines, afin de permettre le découplage, l’orchestration de traitements secondaires, la traçabilité et l’alimentation de domaines consommateurs comme `notifications`, `newsletter`, `social`, `tracking`, `jobs`, `analytics` ou certaines `integrations`.

## Responsabilités

Le domaine `domain-events` prend en charge :

- la formalisation des types d’événements internes
- l’enveloppe commune des événements métier internes
- la publication interne de ces événements
- la lecture ou la circulation interne des événements pour les domaines consommateurs
- la distinction explicite entre fait métier validé et simple log technique
- la base de découplage interne entre domaines émetteurs et domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `domain-events` ne doit pas :

- porter les événements publics métier, qui relèvent de `events`
- porter les logs techniques, qui relèvent de l’observabilité ou du monitoring
- porter les webhooks sortants, qui relèvent de `webhooks`
- porter directement les traitements consommateurs, qui relèvent des domaines concernés
- adopter les payloads bruts de providers externes comme langage officiel du socle
- devenir un bus flou sans sémantique métier stable

Le domaine `domain-events` porte les faits métier internes structurés. Il ne remplace ni `events`, ni `jobs`, ni `webhooks`, ni `integrations`.

## Sous-domaines

Le domaine peut rester simple au départ, avec :

- `types` : types d’événements internes
- `envelopes` : enveloppe commune des événements
- `publishing` : publication interne des événements

## Entrées

Le domaine reçoit principalement :

- des faits métier validés issus des domaines coeur et transverses
- des demandes internes de publication d’un événement structuré
- des informations de contexte nécessaires à l’enveloppe de l’événement

## Sorties

Le domaine expose principalement :

- des événements internes structurés
- des types d’événements stables
- une lecture exploitable par les domaines consommateurs internes
- une base de corrélation exploitable par `observability`, `audit`, `jobs`, `tracking`, `notifications`, `newsletter`, `social` et certaines `integrations`

## Dépendances vers autres domaines

Le domaine `domain-events` doit rester central mais léger.

Il peut dépendre de :

- `audit` pour certaines corrélations ou traçabilités si nécessaire
- `observability` pour certaines corrélations techniques et métier

Les domaines suivants peuvent dépendre de `domain-events` :

- `notifications`
- `newsletter`
- `social`
- `tracking`
- `jobs`
- `analytics`
- `integrations`
- `audit`
- `observability`

Et les domaines émetteurs typiques incluent notamment :

- `products`
- `blog`
- `orders`
- `payments`
- `returns`
- `documents`
- `events`
- `marketing`
- `conversion`

## Capabilities activables liées

Le domaine `domain-events` n’est pas une capability métier optionnelle au sens classique.

Il fait partie de l’architecture structurante du socle.

En revanche, certains domaines consommateurs peuvent ou non réagir à ces événements selon les capabilities actives, par exemple :

- `notifications`
- `newsletter`
- `socialPublishing`
- `automaticSocialPosting`
- `tracking`
- `serverSideTracking`

### Règle

Un event interne peut être émis même si un domaine consommateur donné est désactivé.

Exemple :

- `product.published` peut être émis
- si `socialPublishing = false`, le domaine `social` ne réagit pas
- si `newsletter = false`, le domaine `newsletter` ne réagit pas

## Rôles/permissions concernés

### Rôles

Le domaine `domain-events` est principalement gouverné et observé par :

- `platform_owner`
- `platform_engineer`

Les rôles boutique ne doivent pas administrer librement le socle événementiel interne.

### Permissions

Exemples de permissions concernées :

- `audit.read`
- `observability.read`
- `tracking.read`
- `tracking.write`
- `integrations.read`
- `integrations.write`

Selon le niveau de détail retenu plus tard, des permissions plus spécifiques au pilotage technique ou à la lecture événementielle pourront être ajoutées.

## Événements émis

Le domaine `domain-events` ne produit pas des événements métier de sa propre initiative métier comme un domaine fonctionnel classique.

Il formalise et publie des événements tels que :

- `product.created`
- `product.updated`
- `product.published`
- `blog.post.published`
- `order.created`
- `order.cancelled`
- `payment.captured`
- `payment.failed`
- `invoice.generated`
- `event.published`
- `event.registration.created`
- `newsletter.subscribed`

## Événements consommés

Le domaine `domain-events` consomme les faits métier validés en provenance des autres domaines émetteurs pour les transformer en événements internes structurés publiables.

Il n’a pas vocation à consommer les payloads bruts providers comme source de vérité directe.

## Intégrations externes

Le domaine `domain-events` ne parle pas directement aux systèmes externes.

Les usages externes dérivés passent par :

- `webhooks`
- `integrations`
- `jobs`

Le domaine `domain-events` reste la source de vérité interne du langage événementiel métier du socle.

## Données sensibles / sécurité

Le domaine `domain-events` ne porte pas forcément de secrets, mais il structure des signaux internes potentiellement sensibles.

Points de vigilance :

- stabilité des types d’événements
- protection contre l’exposition brute non maîtrisée d’événements internes
- séparation claire entre événement interne, webhook externe et log technique
- absence de dépendance au langage provider externe
- contrôle des usages sensibles côté observability, audit et intégrations

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quel événement a été émis
- par quel domaine émetteur
- pour quel agrégat ou objet métier
- à quel moment
- quels domaines consommateurs ont réagi ou non
- si une réaction a échoué, a été ignorée ou n’était pas applicable

### Audit

Le domaine `domain-events` n’a pas vocation à stocker ou auditer indistinctement tout événement comme un journal de conformité universel.

En revanche, certains événements critiques ou certaines conséquences d’événements doivent pouvoir être corrélés avec `audit`.

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `DomainEventType` : type stable d’événement interne
- `DomainEventEnvelope` : enveloppe commune d’un événement
- `DomainEventPayload` : payload métier structuré
- `DomainEventPublication` : publication interne d’un événement
- `DomainEventSourceRef` : référence vers l’agrégat ou l’objet source

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un domain event exprime un fait métier interne déjà validé
- un domain event possède un type stable et explicite
- un domain event parle le langage du socle, pas celui d’un provider externe
- `domain-events` ne se confond pas avec `events`, `webhooks` ou les logs techniques
- les domaines consommateurs réagissent aux événements sans que les domaines émetteurs absorbent leurs responsabilités
- l’émission d’un event et la réaction à cet event sont deux responsabilités distinctes

## Cas d’usage principaux

1. Publier `product.published` après publication d’un produit
2. Publier `blog.post.published` après publication d’un article
3. Publier `order.created` après création d’une commande
4. Publier `event.published` après publication d’un événement public
5. Permettre à `notifications`, `newsletter` ou `social` de réagir à ces faits métier sans couplage fort
6. Alimenter `jobs`, `tracking`, `observability` ou certaines `integrations` à partir de faits métier internes stables

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- type d’événement inconnu
- enveloppe événementielle invalide
- payload incohérent avec le type d’événement
- tentative d’utiliser un payload provider externe brut comme payload officiel
- confusion entre événement interne et événement public métier
- domaine consommateur indisponible ou non activé

## Décisions d’architecture

Les choix structurants du domaine sont :

- `domain-events` porte le langage événementiel interne du socle
- `domain-events` est distinct de `events`
- `domain-events` est distinct de `webhooks`
- `domain-events` est distinct de `integrations`
- les domaines émetteurs publient des faits métier internes validés
- les domaines consommateurs réagissent à ces événements sans que les domaines émetteurs absorbent leurs responsabilités
- les événements internes restent indépendants des formats providers externes

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les événements internes structurés relèvent de `domain-events`
- les événements publics métier relèvent de `events`
- les webhooks sortants relèvent de `webhooks`
- les appels et formats providers externes relèvent de `integrations`
- `domain-events` ne remplace ni `events`, ni `webhooks`, ni `integrations`, ni les domaines consommateurs comme `notifications`, `newsletter` ou `social`
