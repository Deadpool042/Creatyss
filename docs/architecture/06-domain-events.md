# Domain events

## Objectif

Ce document fixe le rôle des domain events dans le socle e-commerce premium+++.

Les domain events sont les événements internes structurés émis par les domaines du socle pour signaler qu’un fait métier significatif s’est produit.

Ils servent à :

- découpler les domaines
- déclencher des traitements secondaires
- alimenter les notifications
- alimenter la newsletter
- alimenter le tracking
- alimenter l’observability
- alimenter les jobs
- alimenter certaines intégrations externes

Ils ne doivent pas être confondus avec :

- les événements publics du domaine `events`
- les événements bruts des providers externes
- les logs techniques
- les webhooks sortants

## Principe fondamental

Un domain event exprime un fait métier interne déjà validé par le socle.

Exemples :

- un produit a été publié
- un article de blog a été publié
- une commande a été créée
- une inscription newsletter a été confirmée
- un événement public a été publié

Le domain event n’est pas une intention.
Ce n’est pas non plus un simple log.
C’est l’expression structurée d’un fait métier avéré dans le runtime interne.

## Pourquoi les domain events existent

Sans domain events, les domaines finissent par s’appeler directement les uns les autres pour des traitements secondaires.

Exemple de dérive :

- `products` publie un produit
- `products` envoie lui-même des notifications
- `products` poste sur les réseaux sociaux
- `products` envoie une newsletter
- `products` pousse un tracking marketing

Cela crée :

- du couplage fort
- des responsabilités mélangées
- un domaine coeur qui devient monolithique
- des effets de bord difficiles à superviser

Avec des domain events :

1. le domaine coeur valide son opération
2. il émet un événement interne structuré
3. d’autres domaines réagissent à cet événement
4. certains traitements peuvent devenir asynchrones via `jobs`

## Domain events vs autres notions

### Domain events

Faits métier internes du socle.

Exemples :

- `product.published`
- `blog.post.published`
- `order.created`
- `newsletter.subscribed`
- `event.published`

### Événements publics (`events`)

Événements business visibles par les utilisateurs.

Exemples :

- marché artisanal
- salon
- atelier
- événement boutique

### Logs techniques

Traces techniques à vocation diagnostic.
Ils ne remplacent pas les domain events.

### Webhooks

Notifications sortantes vers des systèmes externes.
Ils peuvent être déclenchés à partir de domain events, mais ils ne sont pas les domain events eux-mêmes.

### Événements providers externes

Réponses ou callbacks venant d’un PSP, d’un ERP, d’un provider email, etc.
Ils doivent être interprétés, mappés et éventuellement transformés en signaux internes, mais ils ne doivent pas être adoptés tels quels comme domain events officiels du socle.

## Caractéristiques d’un domain event

Un domain event doit être :

- interne au socle
- typé
- explicite
- stable
- exprimé dans le langage métier du socle
- suffisamment riche pour être exploitable
- indépendant des formats provider externes

Il doit contenir au minimum :

- un type d’événement
- un identifiant d’événement
- une date/heure d’émission
- le contexte boutique si pertinent
- l’identifiant de l’objet métier concerné
- un payload métier structuré minimal

## Modèle conceptuel

```ts
export type DomainEventType =
  | "product.published"
  | "blog.post.published"
  | "order.created"
  | "newsletter.subscribed"
  | "event.published"
  | "event.registration.created";

export type DomainEvent<TPayload> = {
  id: string;
  type: DomainEventType;
  occurredAt: Date;
  storeCode: string | null;
  aggregateId: string;
  payload: TPayload;
};
```

## Règles de conception

### 1. Le domain event est émis après validation métier

Le domaine doit avoir validé et appliqué son changement interne avant émission.

### 2. Le domain event reste interne

Il n’est pas exposé automatiquement à l’extérieur.

### 3. Le domain event ne transporte pas tout l’objet complet par défaut

Il doit porter un payload utile, pas une copie massive et fragile de tout l’état.

### 4. Le domain event parle le langage du socle

Pas le langage d’un provider externe.

### 5. Les effets secondaires ne doivent pas être câblés directement au domaine coeur

Ils doivent passer par la consommation d’événements.

## Domaines émetteurs typiques

Les domaines suivants ont naturellement vocation à émettre des domain events :

### `products`

Exemples :

- `product.created`
- `product.updated`
- `product.published`
- `product.archived`

### `blog`

Exemples :

- `blog.post.created`
- `blog.post.updated`
- `blog.post.published`

### `orders`

Exemples :

- `order.created`
- `order.cancelled`
- `order.paid`

### `newsletter`

Exemples :

- `newsletter.subscribed`
- `newsletter.unsubscribed`

### `events`

Exemples :

- `event.published`
- `event.registration.created`
- `event.reservation.created`

### `documents`

Exemples :

- `invoice.generated`
- `credit_note.generated`

## Domaines consommateurs typiques

### `notifications`

Pour produire des notifications in-app ou email.

### `newsletter`

Pour déclencher certains envois ou campagnes automatiques.

### `social`

Pour déclencher des publications sociales automatiques.

### `tracking`

Pour envoyer des événements internes vers les destinations tracking.

### `observability`

Pour tracer et expliquer le comportement du système.

### `audit`

Pour conserver certaines traces d’actions significatives si nécessaire.

### `jobs`

Pour déporter des traitements longs ou externes.

### `integrations`

Pour pousser certains objets vers l’extérieur, via une couche dédiée.

## Exemples de chaînes correctes

### Nouveau produit publié

1. `products` publie le produit
2. `products` émet `product.published`
3. `notifications` peut produire une notification in-app
4. `newsletter` peut préparer une campagne ou un envoi
5. `social` peut publier sur les réseaux si activé
6. `tracking` peut émettre un signal interne ou provider
7. `jobs` peut exécuter les traitements asynchrones nécessaires

### Nouvel article de blog publié

1. `blog` publie l’article
2. `blog` émet `blog.post.published`
3. `notifications` informe les utilisateurs concernés
4. `newsletter` prépare les envois
5. `social` déclenche une publication si autorisé

### Événement public publié

1. `events` publie l’événement
2. `events` émet `event.published`
3. `notifications` informe les utilisateurs abonnés
4. `newsletter` peut envoyer une campagne ciblée
5. `social` peut publier l’annonce

## Domain events et asynchronisme

Tous les domain events n’impliquent pas un traitement asynchrone.

Mais ils rendent possible une architecture propre où :

- le domaine coeur termine vite son travail principal
- les réactions secondaires sont traitées ensuite

Quand un traitement est :

- coûteux
- externe
- potentiellement instable
- non critique pour la validation immédiate

Il doit souvent être pris en charge via `jobs` après émission du domain event.

## Domain events et capabilities

La capacité d’un domaine consommateur à réagir à un domain event dépend des capabilities actives.

Exemples :

- `product.published` peut être émis même si `socialPublishing = false`
- dans ce cas, `social` ne réagit pas

Autre exemple :

- `blog.post.published` peut être émis même si `newsletter = false`
- dans ce cas, aucune réaction newsletter n’est exécutée

Donc :

- l’événement métier interne existe
- la réaction dépend des capabilities et des permissions pertinentes

## Domain events, audit et observability

### Observability

Doit permettre de comprendre :

- quel event a été émis
- par quel domaine
- pour quel objet
- quelles réactions ont été déclenchées
- lesquelles ont échoué
- lesquelles ont été ignorées pour cause de capability off ou règle métier

### Audit

L’audit ne doit pas forcément enregistrer tous les domain events de façon brute.
Mais certaines actions critiques liées à leur émission ou à leurs conséquences doivent pouvoir être tracées.

## Anti-patterns interdits

### 1. Utiliser un domain event comme simple log

Un domain event n’est pas un message de debug.

### 2. Émettre des events trop vagues

Exemple interdit :

- `entity.changed`

Préférer :

- `product.published`
- `order.created`
- `event.registration.created`

### 3. Mettre tout le traitement secondaire dans le domaine émetteur

Le domaine coeur ne doit pas reprendre toutes les responsabilités des consommateurs.

### 4. Utiliser le payload provider externe comme payload officiel

Le payload d’un domain event doit rester interne au socle.

### 5. Coupler les domain events à un unique provider

Un domain event ne doit pas être défini pour satisfaire directement Google, Meta, EBP ou un pixel provider.

## Invariants

- un domain event exprime un fait métier interne validé
- il parle le langage du socle
- il ne remplace ni un log, ni un webhook, ni un callback provider
- il peut déclencher des réactions multiples sans coupler fortement les domaines
- les traitements externes ou coûteux déclenchés par ces événements peuvent être déportés dans `jobs`

## Décisions closes

- les domain events sont distincts du domaine `events` public
- les domain events sont internes au socle
- ils servent de point de découplage entre le coeur métier et les traitements secondaires
- ils ne doivent pas adopter le modèle des providers externes
- ils sont un mécanisme structurant pour notifications, newsletter, social, tracking, jobs, observability et certaines intégrations
