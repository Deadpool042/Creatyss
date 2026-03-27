# Recommandations

## Rôle

Le domaine `recommendations` porte les suggestions produit ou offre explicitement modélisées dans le système.

Il définit :

- ce qu’est une recommandation du point de vue du système ;
- comment des produits, variantes, bundles ou offres sont suggérés dans un contexte donné ;
- comment ce domaine se distingue du search, du merchandising éditorial, du marketing et du CRM ;
- comment le système reste maître de sa vérité interne sur les recommandations exposées.

Le domaine existe pour fournir une représentation explicite des recommandations, distincte :

- de la recherche portée par `search` ;
- du merchandising éditorial porté par d’autres domaines ;
- du marketing porté par `marketing` ;
- de la relation client structurée portée par `crm` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`optional`

### Criticité architecturale

`optionnel structurant`

### Activable

`oui`

Le domaine `recommendations` est activable.
Lorsqu’il est activé, il devient structurant pour certains parcours storefront, panier, détail produit, CRM et marketing relationnel.

---

## Source de vérité

Le domaine `recommendations` est la source de vérité pour :

- la définition interne d’une recommandation ;
- ses statuts ;
- ses contextes d’éligibilité ou d’exposition ;
- ses liens explicites avec les objets recommandés ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `recommendations` n’est pas la source de vérité pour :

- les produits publiés, qui relèvent de `products` ;
- la recherche, qui relève de `search` ;
- les segments CRM, qui relèvent de `crm` ;
- les campagnes marketing, qui relèvent de `marketing` ;
- le pricing, qui relève de `pricing` ;
- la vendabilité, qui relève de `sales-policy` ;
- les DTO providers externes, qui relèvent de `integrations`.

Une recommandation est une suggestion structurée.
Elle ne doit pas être confondue avec :

- un résultat de recherche ;
- une bannière éditoriale ;
- une campagne marketing ;
- un simple tri catalogue ;
- un flag UI local sans modèle métier.

---

## Responsabilités

Le domaine `recommendations` est responsable de :

- définir ce qu’est une recommandation dans le système ;
- porter les suggestions explicites ;
- porter les contextes d’exposition des recommandations ;
- exposer une lecture gouvernée des recommandations actives, inactives ou non exposables ;
- publier les événements significatifs liés à la vie d’une recommandation ;
- protéger le système contre les suggestions implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- recommandations liées produit ;
- cross-sell ;
- upsell ;
- recommandations contextuelles panier ;
- recommandations homepage ;
- recommandations personnalisées si ce modèle est explicitement porté ici ;
- exclusions ou règles de priorité entre recommandations.

---

## Non-responsabilités

Le domaine `recommendations` n’est pas responsable de :

- définir le catalogue produit ;
- définir la recherche ;
- définir les prix ;
- définir la vendabilité ;
- définir les campagnes marketing ;
- porter la logique complète de personnalisation CRM ;
- exécuter les intégrations provider-specific ;
- devenir un moteur générique de ranking pour tout le système.

Le domaine `recommendations` ne doit pas devenir :

- un doublon de `search` ;
- un doublon de `marketing` ;
- un doublon de `crm` ;
- un conteneur flou de suggestions sans explicabilité.

---

## Invariants

Les invariants minimaux sont les suivants :

- une recommandation possède une identité stable ;
- une recommandation possède un statut explicite ;
- un objet recommandé doit être rattaché explicitement ;
- une recommandation non exposable ne doit pas être servie comme active sans règle explicite ;
- une mutation significative de cible, statut ou priorité doit être traçable ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de recommandation quand le cadre commun existe.

Le domaine protège la cohérence des suggestions explicites du système.

---

## Dépendances

### Dépendances métier

Le domaine `recommendations` interagit fortement avec :

- `products`
- `bundles`
- `search`
- `marketing`
- `crm`
- `stores`
- `sales-policy`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines suggestions sont recalculées ou projetées de façon différée
- `tracking`, si certains signaux alimentent les recommandations
- `analytics`, si certaines performances sont lues ou consolidées

### Dépendances externes

Le domaine peut être projeté vers :

- moteurs de recommandations externes ;
- CRM ;
- plateformes marketing ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `recommendations` porte les suggestions explicites.
Il ne doit pas absorber :

- la recherche ;
- le marketing ;
- le CRM complet ;
- la vendabilité ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `recommendations` publie ou peut publier des événements significatifs tels que :

- recommandation créée ;
- recommandation mise à jour ;
- recommandation activée ;
- recommandation désactivée ;
- cible recommandée modifiée ;
- contexte de recommandation modifié ;
- priorité de recommandation modifiée.

Le domaine peut consommer des signaux liés à :

- produit mis à jour ;
- bundle mis à jour ;
- statut CRM modifié ;
- signal tracking consolidé ;
- capability boutique modifiée ;
- action administrative structurée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `recommendations` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- inactive ;
- archivée.

Des états supplémentaires peuvent exister :

- brouillon ;
- planifiée ;
- suspendue ;
- expirée.

Le domaine doit éviter :

- les recommandations “fantômes” ;
- les changements silencieux de cible ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `recommendations` expose principalement :

- des lectures de recommandations structurées ;
- des cibles recommandées ;
- des contextes d’exposition ;
- des lectures exploitables par `storefront`, `cart`, `marketing`, `crm` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de recommandations ;
- des changements de cible, contexte ou priorité ;
- des demandes de lecture d’un ensemble de recommandations ;
- des contextes de boutique, client, produit, panier ou usage ;
- des signaux internes utiles à l’évolution des recommandations.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `recommendations` peut être exposé à des contraintes telles que :

- boutiques multiples ;
- recommandations contextuelles ;
- personnalisation partielle ;
- recalcul différé ;
- projection vers systèmes externes ;
- exclusions de catalogue ;
- dépendance à la vendabilité ;
- besoin de rétrocompatibilité des règles d’exposition.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des recommandations reste dans `recommendations` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une recommandation incohérente ne doit pas être promue silencieusement ;
- les conflits entre cible, contexte et statut doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `recommendations` peut manipuler des données commerciales sensibles, notamment lorsqu’il dépend de signaux clients ou comportementaux.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre recommandation, tracking, CRM et marketing ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de cible, priorité ou logique d’exposition ;
- prudence sur les usages personnalisés ou dérivés de signaux clients.

---

## Observabilité et audit

Le domaine `recommendations` doit rendre visibles au minimum :

- quelle recommandation est active ;
- quelle cible est exposée ;
- pourquoi une recommandation est utilisable, bloquée, filtrée ou archivée ;
- si une exposition est refusée à cause d’un statut, d’un contexte ou d’une incohérence ;
- si une évolution est bloquée par une règle ou un conflit de priorité.

L’audit doit permettre de répondre à des questions comme :

- quelle recommandation a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quelle cible ou priorité affectée ;
- avec quel changement de statut ;
- avec quel impact sur storefront, panier ou marketing.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- cible invalide ;
- contexte incompatible ;
- recommandation inactive ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Recommendation` : suggestion structurée ;
- `RecommendationTarget` : objet recommandé ;
- `RecommendationContext` : contexte d’exposition ;
- `RecommendationPriority` : ordre ou priorité explicite ;
- `RecommendationPolicy` : règle de gouvernance ou d’exposition.

---

## Impact de maintenance / exploitation

Le domaine `recommendations` a un impact d’exploitation moyen lorsqu’il est activé.

Raisons :

- il influence l’expérience storefront ;
- il affecte merchandising, panier, CRM et marketing ;
- ses erreurs dégradent pertinence, lisibilité et confiance ;
- il nécessite une explicabilité correcte des cibles et statuts ;
- il peut dépendre de signaux multiples.

En exploitation, une attention particulière doit être portée à :

- la cohérence des cibles ;
- la stabilité des statuts ;
- la traçabilité des changements ;
- la cohérence avec vendabilité et catalogue ;
- les effets de bord sur CRM, marketing et storefront.

Le domaine doit être considéré comme sensible dès qu’un système de recommandations réel existe.

---

## Limites du domaine

Le domaine `recommendations` s’arrête :

- avant la recherche ;
- avant le marketing ;
- avant le CRM complet ;
- avant le pricing ;
- avant la vendabilité ;
- avant les DTO providers externes.

Le domaine `recommendations` porte les suggestions explicites.
Il ne doit pas devenir un doublon de recherche, de marketing ou de personnalisation générique non gouvernée.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `recommendations` et `search` ;
- la frontière exacte entre `recommendations` et `marketing` ;
- la frontière exacte entre `recommendations` et `crm` ;
- la part exacte des recommandations personnalisées ;
- la gouvernance des signaux issus de `tracking` ;
- la hiérarchie entre vérité interne et moteur externe éventuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/catalog/products.md`
- `../satellites/bundles.md`
- `../cross-cutting/search.md`
- `../cross-cutting/marketing.md`
- `../cross-cutting/crm.md`
- `../cross-cutting/tracking.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../optional/platform/integrations.md`
