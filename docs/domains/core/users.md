# Utilisateurs

## Rôle

Le domaine `users` porte la représentation interne des utilisateurs du système en tant qu’acteurs applicatifs.

Il définit :

- qui sont les utilisateurs reconnus par le système ;
- comment ils sont représentés en interne ;
- quelles informations structurelles sont portées à leur sujet ;
- comment ils se distinguent des clients métier et des identités d’authentification ;
- comment ils sont reliés aux mécanismes d’accès, de rôles et de permissions sans se confondre avec eux.

Le domaine existe pour fournir une entité utilisateur stable, exploitable par le système, distincte :

- de l’authentification (`auth`) ;
- du client métier (`customers`) ;
- des permissions (`permissions`) ;
- des rôles (`roles`).

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`non`

Le domaine `users` est non optionnel dès lors que le système possède :

- des comptes internes ;
- des opérateurs ;
- des administrateurs ;
- ou des acteurs applicatifs identifiés distincts des seuls clients métier.

---

## Source de vérité

Le domaine `users` est la source de vérité pour :

- l’identité applicative interne de l’utilisateur ;
- la représentation structurelle d’un utilisateur dans le système ;
- le rattachement éventuel à des rôles ou à des espaces d’organisation, selon le modèle retenu ;
- les informations structurelles nécessaires à l’exploitation de l’utilisateur comme acteur interne ou applicatif ;
- le statut de l’utilisateur au sens applicatif.

Le domaine `users` n’est pas la source de vérité pour :

- l’authentification, qui relève de `auth` ;
- la décision d’autorisation, qui relève de `permissions` ;
- la structuration des rôles, qui relève de `roles` ;
- la vérité métier du client, qui relève de `customers` ;
- les sessions, tokens ou credentials ;
- les projections externes CRM ou marketing ;
- les données analytiques ou purement opérationnelles périphériques.

Un utilisateur n’est pas une session.
Un utilisateur n’est pas un client métier par défaut.
Un utilisateur n’est pas un ensemble de permissions.

---

## Responsabilités

Le domaine `users` est responsable de :

- définir ce qu’est un utilisateur du point de vue applicatif ;
- attribuer et maintenir l’identité interne de l’utilisateur ;
- porter les attributs structurels de l’utilisateur ;
- exprimer le statut applicatif d’un utilisateur ;
- exposer une représentation interne exploitable par les autres domaines ;
- encadrer les mutations de l’utilisateur ;
- publier les événements significatifs liés à la vie de l’utilisateur ;
- servir de point de rattachement aux rôles, permissions, organisations ou espaces applicatifs, selon le modèle retenu.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- l’appartenance à une organisation, un store ou une équipe ;
- certaines préférences applicatives structurantes ;
- le statut actif / suspendu / désactivé ;
- le lien entre un utilisateur et une identité d’authentification ;
- le lien éventuel entre un utilisateur et un client métier lorsque le système autorise ce rattachement.

---

## Non-responsabilités

Le domaine `users` n’est pas responsable de :

- authentifier un utilisateur ;
- gérer les sessions ;
- gérer les tokens ;
- décider des permissions effectives ;
- définir les rôles ;
- porter la vérité métier du client ;
- gérer les commandes ;
- gérer les paiements ;
- gérer les intégrations ;
- gouverner les webhooks ;
- porter les mécanismes de sécurité globaux ;
- porter les projections marketing, CRM ou analytics.

Le domaine `users` ne doit pas devenir :

- un alias de `auth` ;
- un doublon de `customers` ;
- un conteneur de droits implicites ;
- un sac de métadonnées sans frontière claire.

---

## Invariants

Les invariants minimaux du domaine sont les suivants :

- un utilisateur doit avoir une identité interne stable ;
- un utilisateur doit être identifiable sans ambiguïté ;
- un utilisateur ne doit pas être simultanément actif et supprimé ;
- une mutation de statut utilisateur doit rester cohérente ;
- un utilisateur ne doit pas dépendre d’une session active pour exister ;
- le lien entre utilisateur et identité d’authentification doit être cohérent lorsqu’il existe ;
- une duplication d’utilisateur ne doit pas être introduite silencieusement ;
- les rattachements structurels portés par le domaine doivent rester interprétables.

Le domaine `users` doit exprimer une cohérence structurelle, pas seulement stocker des profils techniques.

---

## Dépendances

### Dépendances métier et structurelles

Le domaine `users` interagit fortement avec :

- `auth`
- `roles`
- `permissions`
- `stores`, si l’utilisateur est rattaché à un périmètre applicatif
- `customers`, si un lien explicite existe entre les deux

### Dépendances transverses

Le domaine dépend également de :

- audit ;
- observabilité ;
- jobs, si certaines synchronisations ou réconciliations sont différées ;
- consent, selon le modèle ;
- notifications, selon le périmètre.

### Dépendances externes

Le domaine peut interagir avec :

- identity providers ;
- annuaires externes ;
- outils IAM ;
- systèmes d’administration ou de gouvernance.

### Règle de frontière

Le domaine `users` porte la représentation applicative de l’utilisateur.
Il ne doit pas absorber :

- l’authentification ;
- l’autorisation ;
- la vérité métier du client ;
- les mécanismes techniques de session.

---

## Événements significatifs

Le domaine `users` publie ou peut publier des événements significatifs tels que :

- utilisateur créé ;
- utilisateur mis à jour ;
- utilisateur activé ;
- utilisateur suspendu ;
- utilisateur désactivé ;
- utilisateur supprimé ;
- utilisateur rattaché à une organisation, un store ou un périmètre ;
- lien utilisateur-identité modifié ;
- rôle utilisateur modifié, si ce fait métier est porté ici comme projection structurée.

Le domaine peut consommer des signaux liés à :

- authentification réussie ;
- création ou rattachement d’identité ;
- changements de rôle ;
- changements de permissions ;
- synchronisations avec un annuaire externe.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `users` possède un cycle de vie structurel.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- actif ;
- suspendu ;
- désactivé ;
- supprimé ou archivé.

Des états supplémentaires peuvent exister :

- en attente d’activation ;
- invité ;
- verrouillé ;
- fusionné, si le modèle autorise des réconciliations d’identité.

Les transitions doivent être explicites et traçables.

Le domaine doit éviter :

- les états purement techniques ;
- les états déduits implicitement d’un token ou d’une session.

---

## Interfaces et échanges

Le domaine `users` expose principalement :

- des commandes de création et de mutation utilisateur ;
- des lectures du référentiel utilisateur ;
- des lectures structurées pour `auth`, `roles`, `permissions` et l’exploitation ;
- des événements significatifs liés au cycle de vie utilisateur.

Le domaine reçoit principalement :

- des demandes de création ou de mise à jour ;
- des rattachements structurels ;
- des signaux issus d’`auth` ou d’annuaires externes ;
- des mutations liées aux rôles et périmètres si le modèle le prévoit.

Le domaine ne doit pas exposer comme contrat public une structure trop dépendante :

- d’un provider d’identité ;
- d’un moteur de permissions ;
- d’une session courante.

---

## Contraintes d’intégration

Le domaine `users` peut être exposé à des contraintes telles que :

- synchronisation d’annuaires ;
- liaison avec des identity providers ;
- duplication de profils ;
- fusion d’utilisateurs ;
- désactivation ou suspension en masse ;
- ordre de réception non garanti ;
- divergence entre système interne et source externe ;
- rejouabilité de certaines mutations.

Règles minimales :

- toute entrée externe doit être validée ;
- la hiérarchie d’autorité doit être explicite ;
- une duplication doit être contrôlée ;
- une fusion doit être traçable ;
- un système externe ne doit pas écraser silencieusement la vérité interne ;
- les mutations rejouables doivent être idempotentes ou neutralisées.

---

## Observabilité et audit

Le domaine `users` doit rendre visibles au minimum :

- la création d’utilisateur ;
- les changements de statut ;
- les rattachements structurels significatifs ;
- les suspensions et désactivations ;
- les erreurs de validation ;
- les synchronisations externes ;
- les événements significatifs publiés.

L’audit doit permettre de répondre à des questions comme :

- quel utilisateur a changé ;
- quand ;
- selon quelle origine ;
- avec quel impact structurel ;
- à la suite de quelle action ;
- avec quel lien vers l’authentification ou l’autorisation lorsque pertinent.

L’observabilité doit distinguer :

- erreur métier ou structurelle ;
- erreur technique ;
- conflit de données ;
- duplication ;
- divergence annuaire / système interne.

---

## Impact de maintenance / exploitation

Le domaine `users` a un impact d’exploitation élevé.

Raisons :

- il structure l’accès applicatif ;
- il alimente `auth`, `roles` et `permissions` ;
- il peut dépendre d’annuaires ou providers externes ;
- ses erreurs produisent rapidement des incidents d’accès ou de gouvernance.

En exploitation, une attention particulière doit être portée à :

- la cohérence du statut utilisateur ;
- les rattachements structurels ;
- la traçabilité des mutations ;
- les synchronisations externes ;
- les opérations sensibles comme suspension, désactivation ou suppression ;
- la séparation correcte entre problèmes d’utilisateur, d’authentification et d’autorisation.

Le domaine doit être considéré comme critique pour la gouvernance applicative.

---

## Limites du domaine

Le domaine `users` s’arrête :

- avant l’authentification (`auth`) ;
- avant les permissions effectives (`permissions`) ;
- avant les rôles comme modèle normatif (`roles`) ;
- avant la vérité métier du client (`customers`) ;
- avant les sessions, tokens et credentials ;
- avant les mécanismes de sécurité transverses ;
- avant les projections externes non structurelles.

Le domaine `users` porte l’utilisateur comme acteur applicatif structuré.
Il ne doit pas devenir le conteneur de toute information relative à une personne ou à son accès.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `users` et `customers` ;
- la frontière exacte entre `users` et `auth` ;
- le lien exact entre utilisateur, rôle et permission ;
- le rattachement éventuel à un store, une organisation ou une équipe ;
- la politique de fusion ou de déduplication ;
- la hiérarchie entre référentiel interne et annuaire externe ;
- la gestion des comptes invités ou temporaires ;
- le niveau de couplage autorisé avec les systèmes IAM externes.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/10-principes-d-architecture.md`
- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `auth.md`
- `roles.md`
- `permissions.md`
- `customers.md`
- `stores.md`
