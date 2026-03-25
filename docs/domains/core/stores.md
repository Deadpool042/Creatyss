# Boutiques

## Rôle

Le domaine `stores` porte la représentation des boutiques ou espaces de vente du système.

Il définit :

- ce qu’est une boutique du point de vue du système ;
- comment une boutique est identifiée ;
- quel périmètre commercial, organisationnel ou opérationnel elle structure ;
- comment une boutique sert de contexte aux autres domaines ;
- quelles informations structurantes sont associées à une boutique.

Le domaine existe pour fournir un cadre stable de composition commerciale et opérationnelle, distinct :

- du produit ;
- du canal ;
- du client ;
- de la tarification ;
- des intégrations externes.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur`

### Activable

`non`

Le domaine `stores` est non optionnel dès lors que le système distingue plusieurs espaces de vente, plusieurs contextes commerciaux ou plusieurs compositions projet exploitables.

---

## Source de vérité

Le domaine `stores` est la source de vérité pour :

- l’identité interne d’une boutique ;
- la représentation structurelle d’une boutique ;
- les attributs structurants d’une boutique ;
- l’état actif, inactif ou archivé d’une boutique ;
- le rattachement de certains périmètres métier à une boutique lorsque cette responsabilité est portée ici.

Le domaine `stores` n’est pas la source de vérité pour :

- les produits, qui relèvent de `products` ;
- les prix, qui relèvent de `pricing` ;
- la disponibilité vendable, qui relève de `availability` ;
- les commandes, qui relèvent de `orders` ;
- les canaux externes de diffusion, qui peuvent relever de `channels` ;
- les intégrations elles-mêmes ;
- les rôles, permissions ou authentification ;
- les projections éditoriales ou marketing.

Une boutique est un contexte structurant.
Elle ne doit pas être confondue avec un canal externe, un thème UI ou une simple configuration technique.

---

## Responsabilités

Le domaine `stores` est responsable de :

- définir ce qu’est une boutique dans le système ;
- attribuer et maintenir l’identité interne d’une boutique ;
- porter les attributs structurants d’une boutique ;
- exprimer le statut de vie d’une boutique ;
- servir de contexte de composition pour d’autres domaines ;
- exposer une représentation stable et exploitable de la boutique ;
- encadrer les mutations significatives d’une boutique ;
- publier les événements significatifs liés à la vie de la boutique.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- la devise par défaut ;
- certains paramètres de contexte commercial ;
- le rattachement à une organisation ou un tenant, si le modèle le prévoit ;
- certains paramètres de langue ou zone par défaut ;
- certaines capacités activées au niveau boutique si cette gouvernance est réellement portée ici.

---

## Non-responsabilités

Le domaine `stores` n’est pas responsable de :

- définir les produits ;
- calculer les prix ;
- décider de la disponibilité vendable ;
- gérer les commandes ;
- gérer les paiements ;
- gouverner les rôles et permissions ;
- exécuter les intégrations externes ;
- gérer les webhooks ;
- définir la logique d’un canal externe ;
- porter la UI ou le thème applicatif à lui seul ;
- devenir un fourre-tout de configuration globale.

Le domaine `stores` ne doit pas devenir :

- un alias de `channels` ;
- un sac de paramètres hétérogènes ;
- un substitut de multi-tenant non assumé.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une boutique doit avoir une identité interne stable ;
- une boutique doit être interprétable sans ambiguïté ;
- une boutique inactive ne doit pas être traitée comme active sans règle explicite ;
- une mutation structurante de boutique doit être traçable ;
- les contextes exposés par une boutique doivent rester cohérents ;
- deux boutiques distinctes ne doivent pas être indiscernables sans justification explicite ;
- une boutique archivée ne doit pas continuer à servir silencieusement de contexte opérationnel.

Le domaine doit protéger la cohérence du contexte boutique, pas seulement stocker quelques paramètres.

---

## Dépendances

### Dépendances métier

Le domaine `stores` interagit fortement avec :

- `products`
- `pricing`
- `availability`
- `customers`
- `orders`
- `users`
- `roles`
- `permissions`

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs ;
- intégrations ;
- feature flags, si le projet les utilise pour de la gouvernance de boutique ;
- localization, si le contexte boutique porte des paramètres de langue ou zone.

### Dépendances externes

Le domaine peut interagir avec :

- ERP ;
- CMS ;
- canaux de diffusion ;
- systèmes de configuration ;
- systèmes multi-tenant ou backoffice externes.

### Règle de frontière

Le domaine `stores` porte la vérité de la boutique comme contexte structurant.
Il ne doit pas absorber :

- la logique des autres domaines ;
- la vérité d’un canal externe ;
- ni la totalité de la configuration système.

---

## Événements significatifs

Le domaine `stores` publie ou peut publier des événements significatifs tels que :

- boutique créée ;
- boutique mise à jour ;
- boutique activée ;
- boutique désactivée ;
- boutique archivée ;
- contexte de boutique modifié ;
- rattachement de boutique modifié ;
- configuration structurante de boutique modifiée.

Le domaine peut consommer des signaux liés à :

- création d’organisation, si ce concept existe ;
- activation de capacités ;
- synchronisation externe ;
- changement de canal ou de configuration connexe.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `stores` possède un cycle de vie structurel.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- inactive ;
- archivée.

Des états supplémentaires peuvent exister :

- brouillon ;
- en préparation ;
- suspendue ;
- en migration.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les états implicites ;
- les statuts purement techniques ;
- les changements silencieux de contexte.

---

## Interfaces et échanges

Le domaine `stores` expose principalement :

- des commandes de création et de mutation de boutique ;
- des lectures du référentiel de boutiques ;
- des lectures de contexte boutique pour les domaines consommateurs ;
- des événements significatifs liés au cycle de vie des boutiques.

Le domaine reçoit principalement :

- des demandes de création ou de mise à jour ;
- des rattachements ou mutations structurelles ;
- des synchronisations externes ;
- des mutations de contexte organisationnel.

Le domaine ne doit pas exposer un contrat instable dépendant directement d’un système externe.

---

## Contraintes d’intégration

Le domaine `stores` peut être exposé à des contraintes telles que :

- synchronisation avec un référentiel externe ;
- migration de contexte boutique ;
- configuration partiellement externalisée ;
- multi-store ;
- multi-zone ;
- divergence entre configuration interne et externe ;
- rejouabilité de certaines mutations.

Règles minimales :

- les entrées externes doivent être validées ;
- la hiérarchie d’autorité doit être explicite ;
- une mutation rejouable doit être idempotente ou neutralisée ;
- un système externe ne doit pas redéfinir silencieusement la vérité interne de la boutique ;
- une mutation structurante doit être traçable.

---

## Observabilité et audit

Le domaine `stores` doit rendre visibles au minimum :

- la création de boutique ;
- les changements de statut ;
- les mutations structurantes ;
- les synchronisations externes significatives ;
- les erreurs de validation ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quelle boutique a changé ;
- quand ;
- selon quelle origine ;
- avec quel impact structurel ;
- sur quel périmètre métier.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- conflit de synchronisation ;
- dérive de configuration ;
- mutation structurelle critique.

---

## Impact de maintenance / exploitation

Le domaine `stores` a un impact d’exploitation élevé.

Raisons :

- il structure le contexte de plusieurs domaines ;
- ses erreurs contaminent potentiellement produits, prix, disponibilité et accès ;
- il peut être exposé à des synchronisations externes ;
- il peut porter une partie de la composition projet.

En exploitation, une attention particulière doit être portée à :

- la cohérence du statut des boutiques ;
- la traçabilité des mutations ;
- la dérive de configuration ;
- les divergences avec des systèmes externes ;
- les changements de périmètre ou rattachement.

Le domaine doit être considéré comme structurant pour la composition du système.

---

## Limites du domaine

Le domaine `stores` s’arrête :

- avant les produits ;
- avant les prix ;
- avant la disponibilité ;
- avant les commandes ;
- avant les canaux externes ;
- avant les intégrations techniques ;
- avant les rôles et permissions comme modèle autonome ;
- avant la UI et le thème.

Le domaine porte la boutique comme contexte structurant.
Il ne doit pas devenir un conteneur global de configuration non gouvernée.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `stores` et `channels` ;
- la frontière exacte entre `stores` et une éventuelle organisation / tenant ;
- la part de configuration réellement portée par `stores` ;
- la gouvernance des capacités activées par boutique ;
- la hiérarchie entre référentiel interne et configuration externe ;
- la relation entre `stores` et les contextes de prix, disponibilité et accès.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `products.md`
- `pricing.md`
- `availability.md`
- `customers.md`
- `users.md`
- `roles.md`
- `permissions.md`
- `../../domains/satellites/channels.md`
