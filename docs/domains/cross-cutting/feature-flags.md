# Feature Flags

## Rôle

Le domaine `feature-flags` porte l’activation, la désactivation et la variation contrôlée de comportements ou capacités dans le système.

Il définit :
- ce qu’est un feature flag du point de vue du système ;
- quels périmètres peuvent être gouvernés par flag ;
- comment un flag est évalué ;
- comment il se distingue d’une capability produit, d’une configuration de boutique ou d’un simple booléen technique ;
- comment il permet des activations progressives, ciblées ou temporaires sans contaminer la modélisation métier.

Le domaine existe pour fournir une gouvernance explicite des variations de comportement, distincte :
- des domaines coeur ;
- des capacités optionnelles en tant que classification produit ;
- de la configuration système générique ;
- des rôles et permissions ;
- des règles métier permanentes.

---

## Classification

### Catégorie documentaire
`cross-cutting`

### Criticité architecturale
`transverse non optionnelle`

### Activable
`non`

Le domaine `feature-flags` est structurel dès lors que le système :
- active progressivement des fonctionnalités ;
- pilote des variations par contexte ;
- ou veut éviter de coder des branches implicites dispersées et non gouvernées.

---

## Source de vérité

Le domaine `feature-flags` est la source de vérité pour :
- la définition interne des flags ;
- leur état actif, inactif, ciblé, déprécié ou archivé ;
- les règles d’évaluation associées aux flags ;
- la relation entre un flag, son périmètre et ses cibles ;
- les événements significatifs liés à la vie des flags.

Le domaine `feature-flags` n’est pas la source de vérité pour :
- la doctrine produit globale des capacités optionnelles ;
- la classification documentaire `core / optional / cross-cutting / satellites` ;
- la vérité métier des domaines coeur ;
- la configuration permanente d’une boutique si cette responsabilité relève de `stores` ;
- les rôles et permissions ;
- les campagnes marketing ou expérimentations analytiques externes, sauf si elles utilisent explicitement ce mécanisme.

Un feature flag gouverne une variation contrôlée.  
Il ne doit pas devenir une couche de modélisation produit implicite.

---

## Responsabilités

Le domaine `feature-flags` est responsable de :
- définir ce qu’est un flag dans le système ;
- porter l’état et les règles d’évaluation des flags ;
- exposer une évaluation exploitable aux consommateurs autorisés ;
- encadrer les activations progressives ou ciblées ;
- rendre les variations de comportement explicites et traçables ;
- publier les événements significatifs liés à la vie des flags ;
- protéger le système contre la multiplication de booléens ad hoc et de branches implicites ;
- permettre la désactivation rapide de comportements lorsque cela est explicitement assumé comme responsabilité du domaine.

Selon le périmètre exact du projet, le domaine peut également être responsable de :
- rollout progressif ;
- ciblage par boutique, environnement, cohorte ou utilisateur ;
- dépréciation de flags ;
- expiration de flags temporaires ;
- gouvernance de kill switches ;
- audit minimal des changements d’état.

---

## Non-responsabilités

Le domaine `feature-flags` n’est pas responsable de :
- définir la doctrine produit des capacités optionnelles ;
- remplacer `stores` pour toute configuration de boutique ;
- remplacer `roles` ou `permissions` pour la gouvernance d’accès ;
- porter des règles métier permanentes ;
- masquer une mauvaise modélisation de domaine ;
- remplacer une migration de schéma ou une stratégie de versioning ;
- gouverner les intégrations ou webhooks à lui seul ;
- devenir un dépôt de “switches” sans durée de vie ni propriétaire clair.

Le domaine `feature-flags` ne doit pas devenir :
- une configuration globale sans structure ;
- un substitut de permission ;
- un alibi pour éviter de trancher l’architecture.

---

## Invariants

Les invariants minimaux sont les suivants :

- un flag doit avoir une identité interne stable ;
- un flag doit avoir un objectif explicite ;
- un flag doit avoir un périmètre interprétable ;
- un flag ne doit pas porter une sémantique ambiguë ;
- un flag temporaire doit pouvoir être retiré ;
- deux flags ne doivent pas gouverner silencieusement la même variation sans hiérarchie explicite ;
- une évaluation de flag doit être déterministe à contexte identique ;
- un flag ne doit pas être utilisé comme vérité métier durable sans règle explicite ;
- une mutation de flag doit être traçable.

Le domaine protège la gouvernance de variation, pas la logique métier elle-même.

---

## Dépendances

### Dépendances métier
Le domaine `feature-flags` peut influencer de nombreux domaines, notamment :
- `stores`
- `products`
- `pricing`
- `checkout`
- `orders`
- `users`
- `marketing`
- `search`

### Dépendances transverses
Le domaine dépend également de :
- `audit`
- `observability`
- `jobs`, si certaines activations sont propagées ou recalculées de manière différée
- `integrations`, si certains flags dépendent d’une configuration synchronisée
- éventuellement `tracking` si des variations doivent être observées, sans que le tracking devienne la source de vérité du flag

### Dépendances externes
Le domaine peut interagir avec :
- plateformes de feature flags externes ;
- backoffices ;
- outils d’expérimentation ;
- services de configuration.

### Règle de frontière

Le domaine `feature-flags` gouverne des variations contrôlées.  
Il ne doit pas absorber :
- la doctrine produit ;
- la vérité métier ;
- la gouvernance d’accès ;
- ni la configuration permanente du système sans distinction.

---

## Événements significatifs

Le domaine `feature-flags` publie ou peut publier des événements significatifs tels que :
- flag créé ;
- flag activé ;
- flag désactivé ;
- règle de ciblage modifiée ;
- rollout commencé ;
- rollout terminé ;
- flag déprécié ;
- flag archivé ;
- kill switch activé ;
- évaluation de flag modifiée, si ce changement a une portée structurante.

Le domaine peut consommer des signaux liés à :
- changement de configuration ;
- changement de boutique ou périmètre ;
- synchronisation externe ;
- fin de vie planifiée d’un flag ;
- action opératoire urgente.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `feature-flags` possède un cycle de vie explicite.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :
- créé ;
- actif ;
- inactif ;
- déprécié ;
- archivé.

Des états supplémentaires peuvent exister :
- brouillon ;
- rollout en cours ;
- suspendu ;
- kill switch.

Le domaine doit éviter :
- les flags permanents non assumés ;
- les flags sans propriétaire ;
- les flags sans fin de vie lisible.

---

## Interfaces et échanges

Le domaine `feature-flags` expose principalement :
- des commandes de création et de mutation de flags ;
- des lectures de définition de flags ;
- des évaluations de flags dans un contexte donné ;
- des événements significatifs liés aux changements d’état ou de règle.

Le domaine reçoit principalement :
- des demandes de mutation ;
- des contextes d’évaluation ;
- des synchronisations externes ;
- des actions opératoires ;
- des demandes de désactivation rapide.

Le domaine ne doit pas exposer comme contrat interne canonique le schéma brut d’un provider externe.

---

## Contraintes d’intégration

Le domaine `feature-flags` peut être exposé à des contraintes telles que :
- synchronisation avec une plateforme externe ;
- divergence entre état local et état externe ;
- ciblage contextuel complexe ;
- propagation différée ;
- cache d’évaluation ;
- ordre de réception non garanti ;
- besoin de désactivation immédiate ;
- dette de flags obsolètes.

Règles minimales :
- la hiérarchie d’autorité doit être explicite ;
- l’évaluation doit être déterministe à contexte identique ;
- un provider externe ne doit pas redéfinir silencieusement la sémantique interne ;
- une mutation critique doit être traçable ;
- un flag temporaire doit avoir une stratégie de fin de vie ;
- les traitements rejouables doivent être idempotents ou neutralisés.

---

## Observabilité et audit

Le domaine `feature-flags` doit rendre visibles au minimum :
- les créations et mutations significatives ;
- les activations et désactivations ;
- les rollouts ;
- les kill switches ;
- les erreurs d’évaluation significatives ;
- les divergences avec une source externe ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :
- quel flag a changé ;
- quand ;
- selon quelle origine ;
- sur quel périmètre ;
- avec quel impact attendu ;
- avec quelle stratégie de rollout ou de désactivation.

L’observabilité doit distinguer :
- erreur de modèle ;
- erreur technique ;
- divergence externe ;
- propagation incomplète ;
- flag obsolète encore évalué ;
- variation de comportement inattendue liée à un flag.

---

## Impact de maintenance / exploitation

Le domaine `feature-flags` a un impact d’exploitation élevé.

Raisons :
- il influence directement le comportement du système ;
- il peut masquer des variations importantes si mal gouverné ;
- il peut servir à des activations progressives critiques ;
- ses erreurs peuvent être diffuses, contextuelles et difficiles à diagnostiquer.

En exploitation, une attention particulière doit être portée à :
- la lisibilité du parc de flags ;
- la dette de flags obsolètes ;
- la cohérence entre flags et capacités produit ;
- la traçabilité des mutations ;
- les divergences avec des plateformes externes ;
- les kill switches et rollouts en cours ;
- la fin de vie des flags temporaires.

Le domaine doit être considéré comme critique pour la gouvernance de variation du système.

---

## Limites du domaine

Le domaine `feature-flags` s’arrête :
- avant la doctrine produit des capacités ;
- avant la vérité métier ;
- avant les rôles et permissions ;
- avant la configuration permanente de boutique ou système ;
- avant les intégrations techniques non spécifiques ;
- avant la logique UI en tant que telle.

Le domaine `feature-flags` gouverne la variation contrôlée.  
Il ne doit pas absorber tout changement de comportement ni toute configuration.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `feature-flags` et `stores` ;
- la frontière exacte entre `feature-flags` et les capacités optionnelles du produit ;
- la hiérarchie entre état interne et provider externe ;
- la stratégie de rollout ;
- la politique de kill switch ;
- la stratégie de fin de vie des flags ;
- la gouvernance des flags par environnement, boutique, utilisateur ou cohorte ;
- la part de cache ou de propagation différée autorisée.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../domains/core/stores.md`
- `audit.md`
- `observability.md`
- `jobs.md`
- `tracking.md`
