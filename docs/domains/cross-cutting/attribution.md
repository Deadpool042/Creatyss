# Domaine attribution

## Rôle

Le domaine `attribution` porte l’attribution marketing et commerciale du socle.

Il structure la lecture de provenance, de contribution et de crédit entre sources, canaux, campagnes ou interactions, afin d’expliquer comment une visite, un lead, une inscription ou une commande peut être relié à des actions marketing ou à des parcours d’acquisition, sans absorber le tracking brut, l’analytics consolidée, les campagnes marketing elles-mêmes ou les providers externes.

## Responsabilités

Le domaine `attribution` prend en charge :

- la lecture d’origine d’un parcours
- la lecture de canal d’acquisition
- la lecture de campagne contributrice
- les règles d’attribution retenues par le socle
- la consolidation d’un crédit d’attribution sur des événements métier pertinents
- la base d’attribution exploitable par `analytics`, `marketing`, `conversion`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `attribution` ne doit pas :

- porter les signaux bruts de mesure, qui relèvent de `tracking`
- porter les vues analytiques consolidées, qui relèvent de `analytics`
- porter les campagnes marketing elles-mêmes, qui relèvent de `marketing`
- porter les providers publicitaires ou analytics externes, qui relèvent de `integrations`
- devenir un moteur opaque mélangeant heuristiques, reporting et tracking sans langage métier clair
- redéfinir les vérités métier source des domaines coeur

Le domaine `attribution` porte la lecture d’attribution. Il ne remplace ni `tracking`, ni `analytics`, ni `marketing`, ni `integrations`.

## Sous-domaines

- `sources` : sources et canaux d’acquisition
- `models` : modèles d’attribution retenus par le socle
- `credit` : crédit d’attribution appliqué à un événement métier pertinent

## Entrées

Le domaine reçoit principalement :

- des signaux structurés issus de `tracking`
- des contextes de parcours, session, campagne ou canal
- des événements métier pertinents comme une commande, une inscription newsletter ou une inscription à un événement
- des demandes de lecture d’attribution par période, canal, campagne ou objet métier
- les capabilities actives et le contexte boutique

## Sorties

Le domaine expose principalement :

- des lectures d’attribution structurées
- des sources et canaux attribués
- des crédits d’attribution consolidés
- des vues exploitables par `analytics`, `marketing`, `conversion`, `dashboarding` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `attribution` peut dépendre de :

- `tracking` pour les signaux de mesure structurés
- `orders` pour certains événements de conversion marchande
- `newsletter` pour certains événements d’inscription ou de campagne
- `events` pour certaines inscriptions ou réservations événementielles
- `marketing` pour relier l’attribution à des campagnes ou opérations amont
- `store` pour le contexte boutique et les capabilities actives
- `audit` pour certaines corrélations sensibles si nécessaire
- `observability` pour expliquer pourquoi une attribution a été retenue, neutralisée ou laissée indéterminée

Les domaines suivants peuvent dépendre de `attribution` :

- `analytics`
- `marketing`
- `conversion`
- `dashboarding`
- certaines couches d’administration plateforme ou boutique

## Capabilities activables liées

Le domaine `attribution` est directement ou indirectement lié à :

- `attribution`
- `tracking`
- `analytics`
- `marketingCampaigns`
- `conversionFlows`
- `marketingPixels`
- `serverSideTracking`

### Effet si `attribution` est activée

Le domaine devient pleinement exploitable pour produire des lectures d’attribution structurées.

### Effet si `attribution` est désactivée

Le domaine reste structurellement présent, mais aucune lecture d’attribution métier non indispensable ne doit être exposée côté boutique.

### Effet si `tracking` est activée

Le domaine peut s’appuyer sur les signaux de mesure structurés nécessaires à ses modèles.

### Effet si `marketingCampaigns`, `conversionFlows`, `marketingPixels` ou `serverSideTracking` est activée

Le domaine peut enrichir la provenance et la contribution des canaux ou campagnes dans ses lectures d’attribution.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- certains rôles de pilotage en lecture selon la politique retenue

### Permissions

Exemples de permissions concernées :

- `attribution.read`
- `analytics.read`
- `tracking.read`
- `marketing.read`
- `dashboarding.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `attribution.model.updated`
- `attribution.credit.assigned`
- `attribution.view.refreshed`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `tracking.event.created`
- `order.created`
- `newsletter.subscribed`
- `event.registration.created`
- `marketing.campaign.activated`
- `store.capabilities.updated`

Il doit toutefois rester maître de sa propre logique d’attribution.

## Intégrations externes

Le domaine `attribution` ne doit pas parler directement aux providers externes comme source de vérité principale.

Les échanges avec :

- plateformes publicitaires
- outils analytics externes
- outils de marketing automation externes
- data warehouses externes

relèvent de :

- `integrations`
- éventuellement `jobs`

Le domaine `attribution` reste la source de vérité interne des lectures d’attribution du socle.

## Données sensibles / sécurité

Le domaine `attribution` manipule des données potentiellement sensibles de parcours, de source et de performance marketing.

Points de vigilance :

- contrôle strict des droits de lecture
- respect des capabilities actives et du cadre de consentement applicable
- séparation claire entre signal brut, modèle d’attribution et projection externe
- limitation des expositions selon le rôle et le scope
- audit des changements sensibles de modèles ou de règles d’attribution

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- pourquoi une source, un canal ou une campagne a été attribué
- quel modèle d’attribution a été utilisé
- quelles sources amont ont été prises en compte
- si une attribution est absente à cause d’une capability off, d’un signal manquant, d’une règle métier ou d’un cadre de consentement restrictif

### Audit

Il faut tracer :

- les changements significatifs de modèles d’attribution
- les modifications manuelles importantes des règles de crédit
- certaines régénérations ou corrections sensibles de lectures d’attribution

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `AttributionSource` : source ou canal d’acquisition
- `AttributionModel` : modèle d’attribution retenu
- `AttributionCredit` : crédit attribué à une source ou campagne
- `AttributionView` : lecture consolidée d’attribution
- `AttributionScope` : périmètre de lecture ou d’application de l’attribution

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une lecture d’attribution s’appuie sur des sources identifiées et explicites
- `attribution` ne se confond pas avec `tracking`
- `attribution` ne se confond pas avec `analytics`
- `attribution` ne se confond pas avec `marketing`
- les crédits d’attribution ne doivent pas redéfinir de manière divergente les vérités métier source
- les autres domaines ne doivent pas recréer leur propre vérité divergente des lectures d’attribution lorsqu’une lecture commune existe

## Cas d’usage principaux

1. Attribuer une commande à une source ou campagne d’acquisition
2. Attribuer une inscription newsletter à un canal ou une campagne
3. Lire la contribution d’un canal marketing sur une période
4. Comparer les performances attribuées par campagne ou source
5. Alimenter `analytics` et `dashboarding` avec des lectures d’attribution consolidées
6. Exposer à l’admin boutique ou plateforme une lecture claire des sources d’acquisition et de leur contribution

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- source d’attribution inconnue
- modèle d’attribution introuvable ou invalide
- capability attribution désactivée
- signaux de tracking insuffisants ou incohérents
- scope de lecture non autorisé
- attribution impossible ou indéterminée à partir des données disponibles

## Décisions d’architecture

Les choix structurants du domaine sont :

- `attribution` porte les lectures d’attribution du socle
- `attribution` est distinct de `tracking`
- `attribution` est distinct de `analytics`
- `attribution` est distinct de `marketing`
- `attribution` est distinct de `integrations`
- les lectures d’attribution sont construites à partir de signaux et de sources identifiés, sans absorber la responsabilité des domaines source
- les modèles et crédits d’attribution sensibles doivent être contrôlés, auditables et observables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les lectures d’attribution relèvent de `attribution`
- les signaux de mesure relèvent de `tracking`
- l’analytics consolidée relève de `analytics`
- les campagnes relèvent de `marketing`
- les providers externes relèvent de `integrations`
- `attribution` ne remplace ni `tracking`, ni `analytics`, ni `marketing`, ni `integrations`
