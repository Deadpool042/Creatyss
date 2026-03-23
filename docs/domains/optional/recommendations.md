# Domaine recommendations

## Rôle

Le domaine `recommendations` porte les recommandations structurées du socle.

Il organise les suggestions de produits, contenus, événements ou objets pertinents à proposer dans un contexte donné, selon des règles explicites de relation, de complémentarité, de similarité, de comportement observé ou de stratégie commerciale, sans absorber le catalogue source, la conversion, le marketing, le comportement ou l’analytics.

## Responsabilités

Le domaine `recommendations` prend en charge :

- les recommandations produit
- les recommandations de contenus ou d’objets liés
- les recommandations contextuelles liées à un panier, un produit, une catégorie, un parcours ou un profil
- les règles explicites de similarité, complémentarité ou pertinence
- les listes de recommandations calculées ou sélectionnées
- la lecture gouvernée des recommandations applicables dans un contexte donné
- la base de suggestion consommable par `conversion`, `marketing`, `cart`, `checkout`, `events`, `dashboarding` et certaines couches d’administration

## Ce que le domaine ne doit pas faire

Le domaine `recommendations` ne doit pas :

- porter le catalogue source, qui relève de `products`
- porter les dispositifs de conversion, qui relèvent de `conversion`
- porter les campagnes marketing, qui relèvent de `marketing`
- porter les lectures comportementales, qui relèvent de `behavior`
- porter l’analytics consolidée, qui relève de `analytics`
- devenir un moteur opaque mélangeant scoring, règles métier, tracking et merchandising sans langage clair
- se substituer aux règles de vendabilité, qui relèvent de `sales-policy`

Le domaine `recommendations` porte la suggestion structurée. Il ne remplace ni `products`, ni `conversion`, ni `marketing`, ni `behavior`, ni `sales-policy`.

## Sous-domaines

- `product-links` : relations explicites entre produits ou variantes
- `contextual` : recommandations liées à un contexte de panier, produit, catégorie ou parcours
- `content-links` : recommandations vers contenus, événements ou autres objets liés
- `policies` : règles de calcul, filtrage, priorisation ou exposition des recommandations

## Entrées

Le domaine reçoit principalement :

- des objets source issus de `products`, `categories`, `blog`, `events` ou d’autres domaines recommandables
- des contextes de panier, produit, catégorie, session, parcours ou acteur
- des lectures comportementales issues de `behavior` lorsqu’elles sont autorisées
- des demandes de lecture de recommandations dans un contexte donné
- des demandes de définition ou mise à jour de liens explicites de recommandation
- des politiques de filtrage, tri, priorité ou exposition

## Sorties

Le domaine expose principalement :

- des listes de recommandations structurées
- des liens explicites entre objets recommandés et contexte source
- des recommandations filtrées et priorisées
- des lectures exploitables par `conversion`, `marketing`, `cart`, `checkout`, `events`, `dashboarding` et certaines couches d’administration

## Dépendances vers autres domaines

Le domaine `recommendations` peut dépendre de :

- `products` pour le catalogue source et les objets principaux à recommander
- `categories` pour certaines relations ou proximités de catalogue
- `behavior` pour certains enrichissements contextuels ou comportementaux si autorisés
- `sales-policy` pour filtrer les suggestions non vendables dans un contexte donné
- `stores` pour le contexte boutique et certaines politiques locales de recommandation
- `audit` pour tracer certains changements sensibles de règles ou de liaisons explicites
- `observability` pour expliquer pourquoi une recommandation a été produite, filtrée ou neutralisée

Les domaines suivants peuvent dépendre de `recommendations` :

- `conversion`
- `marketing`
- `cart`
- `checkout`
- `events`
- `analytics`
- `dashboarding`
- certaines couches storefront et d’administration

## Capabilities activables liées

Le domaine `recommendations` est directement ou indirectement lié à :

- `recommendations`
- `conversionFlows`
- `behavioralAnalytics`
- `marketingCampaigns`
- `productViewTracking`
- `clickTracking`

### Effet si `recommendations` est activée

Le domaine devient pleinement exploitable pour produire des suggestions structurées dans les contextes autorisés.

### Effet si `recommendations` est désactivée

Le domaine reste structurellement présent, mais aucune recommandation enrichie non indispensable ne doit être exposée côté boutique.

### Effet si `behavioralAnalytics` est activée

Le domaine peut enrichir certaines suggestions à partir de lectures comportementales, sans absorber la responsabilité de `behavior`.

### Effet si `conversionFlows` ou `marketingCampaigns` est activée

Le domaine peut alimenter plus finement les usages aval de merchandising, de cross-sell ou de mise en avant, sans absorber la responsabilité des domaines consommateurs.

## Rôles/permissions concernés

### Rôles

Les rôles principalement concernés sont :

- `platform_owner`
- `platform_engineer`
- `store_owner`
- `store_manager`
- `marketing_manager`
- `catalog_manager`
- certains rôles analytiques ou d’observation en lecture selon le scope retenu

### Permissions

Exemples de permissions concernées :

- `recommendations.read`
- `recommendations.write`
- `catalog.read`
- `marketing.read`
- `behavior.read`
- `analytics.read`
- `audit.read`

## Événements émis

Le domaine peut émettre des domain events internes du type :

- `recommendation.link.created`
- `recommendation.link.updated`
- `recommendation.list.generated`
- `recommendation.policy.updated`
- `recommendation.result.filtered`

## Événements consommés

Le domaine peut consommer certains événements internes du type :

- `product.updated`
- `product.published`
- `category.updated`
- `behavior.profile.updated`
- `cart.updated`
- `event.published`
- `store.capabilities.updated`
- certaines actions structurées de recalcul ou de réévaluation de recommandations

Il doit toutefois rester maître de sa propre logique de suggestion.

## Intégrations externes

Le domaine `recommendations` ne doit pas devenir un domaine d’intégration provider-specific.

Il peut être consulté par `integrations` ou par des couches UI pour enrichir certains flux autorisés, mais :

- la vérité des recommandations internes reste dans `recommendations`
- les DTO providers externes restent dans `integrations`
- les signaux bruts restent dans `tracking`
- les lectures comportementales restent dans `behavior`

## Données sensibles / sécurité

Le domaine `recommendations` peut manipuler des priorisations commerciales et des enrichissements contextuels sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture
- séparation claire entre objet source, règle de recommandation et résultat exposé
- respect des filtrages de vendabilité et des cadres de consentement applicables quand des enrichissements comportementaux existent
- limitation de l’exposition selon le rôle, le scope et la sensibilité
- audit des changements sensibles de règles ou de liaisons explicites

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- quelle recommandation a été produite
- à partir de quel contexte source
- quelles règles ou priorités ont été utilisées
- pourquoi une suggestion a été filtrée, retenue ou neutralisée
- si une absence de recommandation vient d’une capability off, d’un filtre de vendabilité, d’un signal insuffisant ou d’une règle applicable

### Audit

Il faut tracer :

- les changements significatifs de politiques de recommandation
- les modifications de liens explicites entre objets recommandés
- certaines consultations sensibles si le modèle final les retient explicitement
- certaines interventions manuelles importantes de merchandising ou de priorisation

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `RecommendationContext` : contexte source de la recommandation
- `RecommendationItem` : objet recommandé structuré
- `RecommendationList` : liste ordonnée de suggestions
- `RecommendationLink` : relation explicite entre deux objets recommandables
- `RecommendationPolicy` : règle de calcul, filtrage ou exposition
- `RecommendationReason` : justification explicite de la suggestion si le modèle final l’expose

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- une recommandation est rattachée à un contexte explicite
- une recommandation ne se substitue pas à la vérité du catalogue source
- `recommendations` ne se confond pas avec `products`
- `recommendations` ne se confond pas avec `conversion`
- `recommendations` ne se confond pas avec `marketing`
- `recommendations` ne se confond pas avec `behavior`
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de recommandation quand le cadre commun `recommendations` existe
- une suggestion peut être neutralisée par les règles de capability, de vendabilité, de consentement ou d’exposition sans supprimer la structure du domaine

## Cas d’usage principaux

1. Proposer des produits complémentaires sur une fiche produit
2. Proposer des suggestions dans le panier ou au checkout
3. Mettre en avant des objets liés à un événement ou à un contenu éditorial
4. Alimenter `conversion` avec des suggestions de cross-sell ou de contexte
5. Fournir à `marketing` une lecture structurée des suggestions merchandising autorisées
6. Exposer à l’admin une lecture claire des règles et résultats de recommandation

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- contexte de recommandation introuvable ou invalide
- objet source introuvable
- recommandation impossible ou vide
- capability recommendations désactivée
- filtre de vendabilité bloquant toutes les suggestions
- tentative d’exposition d’une recommandation dans un contexte non autorisé
- conflit entre plusieurs règles de recommandation ou de priorité

## Décisions d’architecture

Les choix structurants du domaine sont :

- `recommendations` porte les suggestions structurées du socle
- `recommendations` est distinct de `products`
- `recommendations` est distinct de `conversion`
- `recommendations` est distinct de `marketing`
- `recommendations` est distinct de `behavior`
- les domaines consommateurs lisent la vérité de recommandation via `recommendations`, sans la recréer localement
- les règles, priorités et liaisons explicites sensibles doivent être observables et auditables

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- les suggestions structurées relèvent de `recommendations`
- le catalogue source relève de `products`
- les dispositifs de conversion relèvent de `conversion`
- les campagnes marketing relèvent de `marketing`
- les lectures comportementales relèvent de `behavior`
- `recommendations` ne remplace ni `products`, ni `conversion`, ni `marketing`, ni `behavior`, ni `integrations`
