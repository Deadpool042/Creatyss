# Rôles

## Rôle

Le domaine `roles` porte le modèle de rôles du système.

Il définit :

- comment les rôles sont représentés ;
- quels regroupements de responsabilités ou d’habilitations ils incarnent ;
- comment un rôle peut être attribué à un utilisateur ou à un autre acteur autorisé ;
- comment les rôles structurent l’organisation de l’accès sans se confondre avec les permissions effectives.

Le domaine existe pour fournir une couche intermédiaire stable entre :

- les utilisateurs (`users`) ;
- l’authentification (`auth`) ;
- les permissions (`permissions`) ;
- et l’organisation applicative du système.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `roles` est non optionnel dès lors que le système repose sur un modèle d’accès structuré par rôles.

---

## Source de vérité

Le domaine `roles` est la source de vérité pour :

- l’identité interne des rôles ;
- la définition des rôles reconnus par le système ;
- la structure des rôles ;
- les rattachements explicites entre rôles et acteurs lorsque cette responsabilité est portée ici ;
- l’état actif, inactif ou obsolète d’un rôle.

Le domaine `roles` n’est pas la source de vérité pour :

- l’authentification ;
- les sessions ;
- les credentials ;
- les permissions effectives si celles-ci relèvent de `permissions` ;
- les utilisateurs eux-mêmes ;
- les clients métier ;
- les décisions d’accès purement contextuelles.

Un rôle n’est pas un utilisateur.
Un rôle n’est pas une permission atomique.
Un rôle n’est pas une session.

---

## Responsabilités

Le domaine `roles` est responsable de :

- définir les rôles du système ;
- maintenir leur identité et leur structure ;
- exposer une représentation stable des rôles ;
- encadrer les mutations de rôle ;
- publier les événements significatifs liés aux rôles ;
- porter les affectations de rôle si cette responsabilité n’est pas explicitement située ailleurs ;
- fournir une couche de structuration exploitable par `permissions` et l’exploitation.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- rôles globaux ;
- rôles par store, organisation ou périmètre ;
- hiérarchies de rôles ;
- rôles système vs rôles configurables ;
- rôles temporaires ou contextuels si le modèle le prévoit explicitement.

---

## Non-responsabilités

Le domaine `roles` n’est pas responsable de :

- authentifier un acteur ;
- porter les sessions ;
- porter les utilisateurs eux-mêmes ;
- décider des permissions effectives si cette responsabilité appartient à `permissions` ;
- porter la logique métier du client ;
- exécuter des contrôles d’accès ad hoc dans le code applicatif ;
- gérer les intégrations ;
- gérer les webhooks ;
- porter la sécurité transversale globale.

Le domaine `roles` ne doit pas devenir :

- un doublon de `permissions` ;
- un simple dictionnaire décoratif ;
- un conteneur de logique d’accès implicite dispersée.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un rôle doit avoir une identité interne stable ;
- un rôle doit être interprétable sans ambiguïté ;
- deux rôles distincts ne doivent pas être indiscernables sans justification ;
- une affectation de rôle doit référencer un rôle valide ;
- un rôle supprimé ou désactivé ne doit pas rester implicitement actif ;
- une mutation de rôle doit préserver la cohérence du modèle d’accès ;
- un rôle ne doit pas cumuler des sémantiques contradictoires sans règle explicite.

Le domaine doit protéger la lisibilité structurelle du modèle d’accès.

---

## Dépendances

### Dépendances structurelles

Le domaine `roles` interagit fortement avec :

- `users`
- `auth`
- `permissions`
- `stores`, si le modèle d’accès est contextualisé
- `organizations`, si ce concept existe ailleurs dans le système

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs, si certaines synchronisations d’affectation sont différées ;
- sécurité, selon le périmètre documentaire retenu.

### Dépendances externes

Le domaine peut interagir avec :

- annuaires ;
- IAM externes ;
- outils d’administration ;
- systèmes de gouvernance des accès.

### Règle de frontière

Le domaine `roles` structure l’accès.
Il ne doit pas absorber :

- l’identité authentifiée ;
- la permission atomique ;
- ni la logique métier du domaine consommateur.

---

## Événements significatifs

Le domaine `roles` publie ou peut publier des événements significatifs tels que :

- rôle créé ;
- rôle mis à jour ;
- rôle activé ;
- rôle désactivé ;
- rôle supprimé ;
- rôle attribué ;
- rôle retiré ;
- rattachement de rôle modifié ;
- hiérarchie de rôle modifiée, si applicable.

Le domaine peut consommer des signaux liés à :

- création d’utilisateur ;
- changement de périmètre organisationnel ;
- synchronisation avec un IAM externe ;
- évolution du modèle de permissions.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `roles` possède un cycle de vie structurel.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- inactif ;
- supprimé ou archivé.

Des états supplémentaires peuvent exister :

- brouillon ;
- déprécié ;
- remplacé ;
- en cours de migration.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les rôles implicites non documentés ;
- les états purement techniques ;
- les suppressions silencieuses d’un rôle encore utilisé.

---

## Interfaces et échanges

Le domaine `roles` expose principalement :

- des commandes de création et de mutation de rôle ;
- des lectures du référentiel de rôles ;
- des lectures adaptées à `users` et `permissions` ;
- des événements significatifs liés aux rôles et à leurs affectations.

Le domaine reçoit principalement :

- des demandes de création ou mise à jour ;
- des demandes d’affectation ou de retrait ;
- des synchronisations externes ;
- des mutations de périmètre.

Le domaine ne doit pas exposer un contrat instable calqué directement sur un IAM externe.

---

## Contraintes d’intégration

Le domaine `roles` peut être exposé à des contraintes telles que :

- synchronisation avec un annuaire ou un IAM ;
- rôles hérités d’un système externe ;
- duplication de rôles ;
- collision sémantique entre rôles locaux et externes ;
- migration de modèle d’accès ;
- ordre de réception non garanti ;
- rejouabilité de certaines affectations.

Règles minimales :

- les entrées externes doivent être validées ;
- la hiérarchie d’autorité doit être explicite ;
- un rôle externe ne doit pas écraser silencieusement le modèle interne ;
- les mutations rejouables doivent être idempotentes ou neutralisées ;
- les affectations doivent rester traçables.

---

## Observabilité et audit

Le domaine `roles` doit rendre visibles au minimum :

- la création de rôle ;
- les changements de définition ;
- les activations et désactivations ;
- les affectations et retraits significatifs ;
- les erreurs de validation ;
- les synchronisations externes ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel rôle a changé ;
- quand ;
- selon quelle origine ;
- sur quel périmètre ;
- avec quel impact sur les accès.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- conflit de synchronisation ;
- collision sémantique ;
- affectation invalide.

---

## Impact de maintenance / exploitation

Le domaine `roles` a un impact d’exploitation élevé.

Raisons :

- il structure l’organisation des accès ;
- il influence indirectement les permissions effectives ;
- il peut dépendre de systèmes externes ;
- ses erreurs produisent rapidement des incidents de gouvernance et de sécurité.

En exploitation, une attention particulière doit être portée à :

- la cohérence de la définition des rôles ;
- la traçabilité des affectations ;
- la désactivation ou suppression de rôles ;
- les divergences avec les systèmes IAM externes ;
- les migrations de modèle d’accès.

Le domaine doit être considéré comme critique pour la gouvernance applicative.

---

## Limites du domaine

Le domaine `roles` s’arrête :

- avant l’authentification ;
- avant la permission atomique ;
- avant la décision d’accès contextuelle ;
- avant la logique métier des domaines consommateurs ;
- avant les sessions et tokens ;
- avant les mécanismes de sécurité transverses non directement liés au modèle de rôle.

Le domaine `roles` structure l’accès.
Il ne décide pas, à lui seul, de toute autorisation effective.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `roles` et `permissions` ;
- la localisation canonique des affectations de rôle ;
- l’existence de hiérarchies ou de rôles composés ;
- la contextualisation par store, organisation ou équipe ;
- la hiérarchie entre modèle interne et IAM externe ;
- la gestion des rôles système vs rôles configurables ;
- la stratégie de migration en cas de refonte du modèle d’accès.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../../architecture/10-fondations/11-modele-de-classification.md`
- `../../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `auth.md`
- `users.md`
- `permissions.md`
- `stores.md`
