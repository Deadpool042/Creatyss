# Permissions

## Rôle

Le domaine `permissions` porte le modèle d’autorisations effectives du système.

Il définit :

- quelles actions, accès ou opérations sont autorisés ;
- comment ces autorisations sont représentées ;
- comment elles sont évaluées ou agrégées à partir du modèle d’accès retenu ;
- comment elles se distinguent des rôles, de l’authentification et de la logique métier locale ;
- comment le système exprime une capacité d’action autorisée de manière stable et exploitable.

Le domaine existe pour fournir une vérité explicite sur le **droit d’agir**, distincte :

- de l’identité authentifiée (`auth`) ;
- de l’acteur applicatif (`users`) ;
- du regroupement organisationnel ou normatif (`roles`) ;
- des règles métier locales propres à chaque domaine consommateur.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `permissions` est non optionnel dès lors que le système ne se limite pas à un accès binaire trivial.

Sans lui, le système ne peut pas exprimer proprement :

- qui peut faire quoi ;
- sur quel périmètre ;
- avec quelles limites.

---

## Source de vérité

Le domaine `permissions` est la source de vérité pour :

- la représentation interne des permissions ;
- la définition des autorisations reconnues par le système ;
- l’évaluation ou la projection des autorisations effectives, selon le modèle retenu ;
- les relations explicites entre rôles, permissions et périmètres lorsque cette responsabilité est portée ici ;
- l’état actif, inactif, déprécié ou remplacé d’une permission.

Le domaine `permissions` n’est pas la source de vérité pour :

- l’authentification, qui relève de `auth` ;
- l’existence d’un utilisateur, qui relève de `users` ;
- la définition des rôles, qui relève de `roles` ;
- la décision métier locale propre à un domaine coeur ;
- les sessions, tokens ou credentials ;
- les règles de sécurité transverses non directement liées au modèle d’autorisation ;
- les politiques d’intégration externes.

Une permission n’est pas un rôle.
Une permission n’est pas une identité.
Une permission n’est pas, à elle seule, une règle métier locale.

---

## Responsabilités

Le domaine `permissions` est responsable de :

- définir le vocabulaire des permissions du système ;
- maintenir l’identité et la structure des permissions ;
- exposer une représentation stable des autorisations ;
- porter les relations explicites entre permissions, rôles et périmètres si le modèle les centralise ici ;
- exprimer les autorisations effectives ou calculables dans un langage cohérent ;
- encadrer les mutations du modèle d’autorisation ;
- publier les événements significatifs liés aux permissions ;
- fournir une base exploitable aux domaines consommateurs lorsqu’ils doivent vérifier une capacité d’action.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- permissions globales ;
- permissions contextualisées par store, organisation, équipe ou ressource ;
- permissions système vs permissions configurables ;
- permissions déléguées ou héritées ;
- agrégation de permissions à partir des rôles.

---

## Non-responsabilités

Le domaine `permissions` n’est pas responsable de :

- authentifier un acteur ;
- définir les utilisateurs ;
- définir les rôles comme objets structurants ;
- porter les sessions ;
- décider seul d’une règle métier locale ;
- implémenter partout les contrôles d’accès dans le code ;
- gouverner les intégrations ;
- gérer les webhooks ;
- porter l’observabilité globale du système ;
- définir la sécurité réseau, infra ou cryptographique.

Le domaine `permissions` ne doit pas devenir :

- un doublon de `roles` ;
- une liste décorative sans effet clair ;
- un conteneur de logique métier cachée ;
- une accumulation de flags opaques non gouvernés.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- une permission doit avoir une identité interne stable ;
- une permission doit être interprétable sans ambiguïté ;
- une permission active doit correspondre à une capacité d’action clairement définie ;
- deux permissions distinctes ne doivent pas être sémantiquement indiscernables sans justification ;
- une permission supprimée ou désactivée ne doit pas rester implicitement active ;
- une affectation ou agrégation de permission doit rester cohérente avec le modèle d’accès ;
- une mutation de permission ne doit pas casser silencieusement les contrôles d’accès qui en dépendent ;
- une permission ne doit pas transporter une règle métier locale qui n’a pas vocation à être mutualisée.

Le domaine doit protéger la cohérence du modèle d’autorisation, pas seulement stocker des étiquettes.

---

## Dépendances

### Dépendances structurelles

Le domaine `permissions` interagit fortement avec :

- `auth`
- `users`
- `roles`
- `stores`, si l’autorisation est contextualisée
- `organizations`, si ce concept existe ailleurs dans le système

### Dépendances métier

Le domaine est consommé par les domaines qui ont besoin d’une décision d’accès, notamment :

- administration ;
- backoffice ;
- opérations ;
- certains domaines coeur exposant des actions protégées.

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs, si certaines synchronisations ou recalculs sont différés ;
- sécurité, selon le périmètre documentaire retenu.

### Dépendances externes

Le domaine peut interagir avec :

- IAM externes ;
- annuaires ;
- systèmes de gouvernance des accès ;
- outils d’administration.

### Règle de frontière

Le domaine `permissions` exprime la capacité d’action autorisée.
Il ne doit pas absorber :

- l’identité ;
- le rôle ;
- ni la logique métier propre à chaque domaine consommateur.

---

## Événements significatifs

Le domaine `permissions` publie ou peut publier des événements significatifs tels que :

- permission créée ;
- permission mise à jour ;
- permission activée ;
- permission désactivée ;
- permission supprimée ;
- permission attribuée ;
- permission retirée ;
- relation rôle-permission modifiée ;
- modèle d’autorisation recalculé, si cette responsabilité est portée ici.

Le domaine peut consommer des signaux liés à :

- création ou mutation de rôle ;
- création ou mutation d’utilisateur ;
- changement de périmètre organisationnel ;
- synchronisation IAM externe ;
- migration du modèle d’accès.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `permissions` possède un cycle de vie structurel.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créée ;
- active ;
- inactive ;
- supprimée ou archivée.

Des états supplémentaires peuvent exister :

- brouillon ;
- dépréciée ;
- remplacée ;
- en cours de migration.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les permissions implicites non documentées ;
- les suppressions silencieuses ;
- les changements de sens non gouvernés.

---

## Interfaces et échanges

Le domaine `permissions` expose principalement :

- des commandes de création et de mutation de permission ;
- des lectures du référentiel de permissions ;
- des lectures adaptées à `roles`, `users` et aux consommateurs de contrôle d’accès ;
- des résultats d’évaluation ou d’agrégation, si cette responsabilité est portée ici ;
- des événements significatifs liés aux permissions.

Le domaine reçoit principalement :

- des demandes de création ou de mutation ;
- des rattachements à des rôles ou périmètres ;
- des synchronisations externes ;
- des mutations du modèle d’accès global.

Le domaine ne doit pas exposer un contrat instable ou dépendant d’un fournisseur IAM externe.

---

## Contraintes d’intégration

Le domaine `permissions` peut être exposé à des contraintes telles que :

- synchronisation avec un IAM ou annuaire externe ;
- modèles d’autorisation hérités ;
- collisions sémantiques entre permissions internes et externes ;
- recalcul différé d’autorisations ;
- migration du modèle de permissions ;
- ordre de réception non garanti ;
- rejouabilité de certaines affectations ;
- divergence entre modèle local et système externe.

Règles minimales :

- toute entrée externe doit être validée ;
- la hiérarchie d’autorité doit être explicite ;
- un système externe ne doit pas redéfinir silencieusement le modèle interne ;
- les mutations rejouables doivent être idempotentes ou neutralisées ;
- les changements critiques doivent être traçables et auditables.

---

## Observabilité et audit

Le domaine `permissions` doit rendre visibles au minimum :

- la création de permission ;
- les changements de définition ;
- les activations et désactivations ;
- les affectations significatives ;
- les erreurs de validation ;
- les recalculs ou synchronisations critiques ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quelle permission a changé ;
- quand ;
- selon quelle origine ;
- sur quel périmètre ;
- avec quel impact sur les accès ;
- à la suite de quelle mutation de rôle, d’utilisateur ou de modèle.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- conflit de synchronisation ;
- collision sémantique ;
- affectation invalide ;
- recalcul incomplet.

---

## Impact de maintenance / exploitation

Le domaine `permissions` a un impact d’exploitation très élevé.

Raisons :

- il conditionne les autorisations effectives ;
- il influence directement la sécurité applicative ;
- il dépend potentiellement d’autres blocs structurels et de systèmes externes ;
- ses erreurs produisent des incidents d’accès critiques ou des failles de gouvernance.

En exploitation, une attention particulière doit être portée à :

- la lisibilité des permissions ;
- la traçabilité des mutations ;
- les divergences avec les systèmes externes ;
- les recalculs de modèle ;
- les affectations erronées ;
- les suppressions ou remplacements de permissions.

Le domaine doit être considéré comme critique pour la gouvernance des accès.

---

## Limites du domaine

Le domaine `permissions` s’arrête :

- avant l’authentification ;
- avant la définition des utilisateurs ;
- avant la définition des rôles ;
- avant la logique métier locale d’un domaine consommateur ;
- avant les sessions et tokens ;
- avant les mécanismes de sécurité transverses non directement liés au modèle d’autorisation ;
- avant les politiques IAM externes en tant que telles.

Le domaine `permissions` exprime l’autorisation.
Il ne doit pas absorber l’identité, la hiérarchie des rôles ou la logique métier applicative locale.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `permissions` et `roles` ;
- la localisation canonique de l’évaluation d’autorisation ;
- l’existence de permissions globales vs contextualisées ;
- la hiérarchie entre modèle interne et IAM externe ;
- la stratégie de migration du modèle d’autorisation ;
- la part d’agrégation portée par `permissions` vs `roles` ;
- la place exacte des contrôles contextuels dépendants d’un domaine métier.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../../architecture/10-fondations/11-modele-de-classification.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `auth.md`
- `users.md`
- `roles.md`
- `stores.md`
