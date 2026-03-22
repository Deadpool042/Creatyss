# Domaine newsletter

## Rôle

Le domaine `newsletter` porte la diffusion newsletter du socle.

Il structure les abonnés, les campagnes newsletter, la préparation des envois et leur suivi métier, sans absorber les notifications transactionnelles, les campagnes marketing globales, les abonnements fonctionnels génériques ou les intégrations providers externes.

## Responsabilités

Le domaine `newsletter` prend en charge :

- les abonnés newsletter
- les campagnes newsletter
- la préparation métier des envois newsletter
- la lecture des statuts d’envoi newsletter au niveau métier
- la sélection logique des destinataires selon les règles et abonnements disponibles
- la base newsletter exploitable par l’admin, `marketing`, `crm`, `analytics`, `dashboarding` et d’autres domaines consommateurs

## Ce que le domaine ne doit pas faire

Le domaine `newsletter` ne doit pas :

- porter les notifications transactionnelles, qui relèvent de `notifications`
- porter les campagnes marketing globales, qui relèvent de `marketing`
- porter les abonnements fonctionnels génériques, qui relèvent de `subscriptions`
- porter le template system global, qui relève de `template-system`
- porter directement les providers email externes, ce qui relève de `integrations`
- porter le tracking ou l’analytics eux-mêmes, qui relèvent de `tracking`, `behavior`, `analytics` et `attribution`
- devenir un fourre-tout regroupant toute communication sortante par email

Le domaine `newsletter` porte la diffusion newsletter. Il ne remplace ni `notifications`, ni `marketing`, ni `subscriptions`, ni `integrations`.

## Sous-domaines

- `subscribers` : abonnés newsletter
- `campaigns` : campagnes newsletter
- `delivery` : suivi métier des envois et de leur état

## Entrées

Le domaine reçoit principalement :

- des abonnements newsletter issus d’actions explicites ou de domaines consommateurs autorisés
- des demandes de création ou mise à jour de campagnes newsletter
- des préférences ou états d’abonnement exploitables via `subscriptions` ou des structures propres au domaine
- des objets marketing, contenus, nouveautés produit, nouveautés blog ou événements à relayer
- des demandes de lecture des campagnes, abonnés et états d’envoi

## Sorties

Le domaine expose principalement :

- des abonnés newsletter
- des campagnes newsletter
- des destinataires logiques de campagne
- des statuts métier d’envoi newsletter
- une lecture exploitable par `marketing`, `crm`, `analytics`, `dashboarding`, `social` et l’admin
- des messages préparés pour exécution aval par `integrations` ou `jobs`

## Dépendances vers autres domaines

Le domaine `newsletter` peut dépendre de :

- `subscriptions` pour certains sujets ou préférences d’abonnement
- `customers` pour certains destinataires métier
- `crm` pour segmenter ou cibler les destinataires
- `marketing` pour certaines campagnes ou opérations amont
- `products`, `blog` et `events` pour certains contenus ou nouveautés à diffuser
- `store` pour le contexte boutique et les capabilities actives
- `template-system` pour les gabarits réutilisables si le modèle final l’exige
- `audit` pour tracer les changements sensibles
- `observability` pour expliquer pourquoi une campagne a été préparée, envoyée, ignorée ou bloquée

Les domaines suivants peuvent dépendre de `newsletter` :

- `analytics`
- `dashboarding`
- `marketing`
- `crm`
- `social`
- `notifications` dans certains cas de coordination d’information interne

## Capabilities activables liées

Le domaine `newsletter` est directement lié à :

- `newsletter`
- `marketingCampaigns`
- `conversionFlows`
- `publicEvents`

### Effet si `newsletter` est activée

Le domaine devient pleinement exploitable pour gérer des abonnés, campagnes et envois newsletter.

### Effet si `newsletter` est désactivée

Le domaine reste structurellement présent, mais aucun envoi newsletter ne doit être piloté côté boutique.

### Effet si `marketingCampaigns`, `conversionFlows` ou `publicEvents` est activée

Le domaine peut consommer des objets amont utiles à la construction de campagnes newsletter, sans absorber leur responsabilité métier.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `customer_support` en lecture partielle selon la politique retenue
- `customer` pour certaines préférences ou abonnements selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `newsletter.read`
- `newsletter.write`
- `subscriptions.read`
- `marketing.read`
- `crm.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `newsletter.subscribed`
- `newsletter.unsubscribed`
- `newsletter.campaign.created`
- `newsletter.campaign.updated`
- `newsletter.campaign.scheduled`
- `newsletter.campaign.sent`
- `newsletter.delivery.failed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.published`
- `blog.post.published`
- `event.published`
- `marketing.campaign.activated`
- `conversion.recovery.triggered`
- `subscription.created`
- `subscription.cancelled`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre vérité de campagne et de diffusion newsletter.

## Intégrations externes

Le domaine `newsletter` ne doit pas parler directement aux providers email externes.

Les interactions avec :

- providers email
- plateformes emailing
- outils marketing automation externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `newsletter` reste la source de vérité interne des campagnes et envois newsletter au niveau métier.

## Données sensibles / sécurité

Le domaine `newsletter` manipule des données de communication et de diffusion potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- respect des états d’abonnement et de désabonnement
- séparation claire entre newsletter et notification transactionnelle
- protection des segmentations, listes de destinataires et campagnes
- audit des interventions manuelles importantes

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi un destinataire est inclus ou exclu d’une campagne
- pourquoi une campagne est active, planifiée, envoyée ou bloquée
- quel objet amont a alimenté la campagne
- si un envoi n’a pas été exécuté à cause d’une capability off, d’un état d’abonnement, d’un problème d’intégration ou d’une règle métier

### Audit

Il faut tracer :

- la création d’une campagne newsletter
- la modification d’une campagne newsletter
- la planification ou l’envoi d’une campagne
- les changements significatifs d’état d’abonnement newsletter
- les interventions manuelles importantes sur les listes ou campagnes

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `NewsletterSubscriber` : abonné newsletter
- `NewsletterCampaign` : campagne newsletter
- `NewsletterDelivery` : état métier d’envoi d’une campagne ou d’un lot d’envoi
- `NewsletterAudience` : audience logique d’une campagne
- `NewsletterSubscriptionStatus` : état d’abonnement newsletter

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- un abonné newsletter possède un état d’abonnement explicite
- une campagne newsletter possède un identifiant stable et un état explicite
- `newsletter` ne se confond pas avec `notifications`, `marketing` ou `subscriptions`
- l’envoi provider externe reste distinct de la vérité interne de campagne et de diffusion newsletter
- les autres domaines ne doivent pas recréer leur propre vérité divergente de la diffusion newsletter structurée

## Cas d’usage principaux

1. Abonner un acteur à la newsletter
2. Désabonner un acteur de la newsletter
3. Créer une campagne newsletter
4. Segmenter l’audience logique d’une campagne
5. Planifier ou déclencher une campagne newsletter
6. Diffuser une nouveauté produit, blog ou événement via newsletter
7. Exposer à l’admin une lecture claire des abonnés, campagnes et états d’envoi

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- abonné introuvable
- campagne introuvable
- campagne invalide
- abonnement déjà actif ou déjà inactif
- capability newsletter désactivée
- audience vide ou incohérente
- tentative d’envoi d’une campagne non prête
- échec aval d’intégration provider

## Décisions d’architecture

Les choix structurants du domaine sont :

- `newsletter` porte les campagnes et abonnements newsletter au niveau métier
- `newsletter` est distinct de `notifications`
- `newsletter` est distinct de `marketing`
- `newsletter` est distinct de `subscriptions`
- `newsletter` est distinct de `integrations`
- les providers externes sont appelés via `integrations`, puis les états utiles sont remappés dans le langage interne du domaine
- les campagnes et états d’abonnement sensibles doivent être auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- la diffusion newsletter relève de `newsletter`
- les notifications transactionnelles relèvent de `notifications`
- les campagnes marketing globales relèvent de `marketing`
- les abonnements fonctionnels génériques relèvent de `subscriptions`
- `newsletter` ne remplace ni `notifications`, ni `marketing`, ni `subscriptions`, ni `integrations`
