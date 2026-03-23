# Domaine `<domain-name>`

## Objectif

Ce document décrit le domaine `<domain-name>` dans la doctrine courante du socle.

Il précise :

- le rôle du domaine ;
- sa place dans la modularité du socle ;
- sa source de vérité ;
- ses capacités activables ;
- ses niveaux éventuels ;
- ses objets métier ;
- ses invariants ;
- son cycle de vie ;
- ses règles de cohérence ;
- ses frontières externes ;
- ses implications de maintenance et d’exploitation.

Ce document n’est pas un simple descriptif.
Il sert de référence d’architecture, de build, d’exploitation et de cadrage.

---

## Position dans la doctrine de modularité

Le domaine `<domain-name>` est classé comme :

- `domaine coeur non toggleable`
- `domaine coeur à capabilities toggleables`
- `domaine optionnel toggleable`

### Ce qui n’est jamais désactivé

Décrire ici ce qui constitue le noyau incompressible du domaine.

### Ce qui est activable / désactivable par capability

Lister ici les capabilities liées au domaine.

Exemples :

- `...`
- `...`
- `...`

### Ce qui relève d’un niveau

Si le domaine porte des niveaux de sophistication, les expliciter ici.

Exemples :

- niveau 1 : ...
- niveau 2 : ...
- niveau 3 : ...
- niveau 4 : ...

### Ce qui relève d’un provider ou d’une intégration externe

Lister ici ce qui ne relève pas du coeur du domaine mais d’un connecteur ou d’une frontière externe.

Exemples :

- `...`
- `...`
- `...`

---

## Rôle

Le domaine `<domain-name>` porte `...`.

Il constitue la source de vérité interne de `...`, distincte de `...`.

---

## Responsabilités

Le domaine `<domain-name>` prend en charge :

- ...
- ...
- ...
- ...

---

## Ce que le domaine ne doit pas faire

Le domaine `<domain-name>` ne doit pas :

- ...
- ...
- ...
- ...

---

## Source de vérité

Le domaine `<domain-name>` est la source de vérité pour :

- ...
- ...
- ...

Le domaine n’est pas la source de vérité pour :

- ...
- ...
- ...

---

## Objets métier principaux

Les principaux objets métier portés par le domaine sont :

- `...`
- `...`
- `...`

---

## Capabilities activables liées

Le domaine `<domain-name>` est lié aux capabilities suivantes :

- `...`
- `...`
- `...`

### Effet si la capability est activée

Décrire l’impact sur le comportement du domaine.

### Effet si la capability est désactivée

Décrire la version plus simple ou la restriction métier.

---

## Niveaux de sophistication du domaine

Si le domaine porte des niveaux, les décrire ici.

### Niveau 1 — essentiel

...

### Niveau 2 — standard

...

### Niveau 3 — avancé

...

### Niveau 4 — expert / réglementé / multi-contraintes

...

---

## Entrées

Le domaine reçoit principalement :

- ...
- ...
- ...
- ...

---

## Sorties

Le domaine expose principalement :

- ...
- ...
- ...
- ...

---

## Dépendances vers autres domaines

Le domaine `<domain-name>` dépend de :

- `<domain-a>` pour ...
- `<domain-b>` pour ...
- `<domain-c>` pour ...

Les domaines suivants dépendent de `<domain-name>` :

- `...`
- `...`
- `...`

---

## Dépendances vers providers / intégrations

Si le domaine dépend d’une frontière externe, préciser ici la règle.

Le domaine `<domain-name>` :

- ne parle pas directement au provider si cela relève de `integrations`
- n’utilise jamais un schéma provider brut comme langage métier interne
- ne laisse pas un callback ou un résultat externe court-circuiter ses invariants métier

Détailler ensuite les cas précis si nécessaire.

---

## Rôles / permissions concernés

### Rôles

Les rôles principalement concernés sont :

- ...
- ...
- ...

### Permissions

Exemples de permissions concernées :

- `...`
- `...`
- `...`

---

## Événements émis

Le domaine émet les domain events internes suivants :

- `...`
- `...`
- `...`

---

## Événements consommés

Le domaine consomme les domain events internes suivants :

- `...`
- `...`
- `...`

---

## Données sensibles / sécurité

Le domaine `<domain-name>` porte une donnée métier de niveau `...`.

Points de vigilance :

- ...
- ...
- ...
- ...

---

## Observability / audit

### Observability

Il faut pouvoir comprendre :

- ...
- ...
- ...
- ...

### Audit

Il faut tracer :

- ...
- ...
- ...
- ...

---

## Invariants métier

Les règles suivantes doivent toujours rester vraies :

- ...
- ...
- ...
- ...
- ...

---

## Lifecycle et gouvernance des données

### États principaux

Lister les états de cycle de vie du ou des objets principaux du domaine.

Exemples :

- `ACTIVE`
- `DISABLED`
- `ARCHIVED`
- `EXPIRED`

### Transitions autorisées

Lister les transitions autorisées.

Exemples :

- `ACTIVE -> DISABLED`
- `ACTIVE -> COMPLETED`
- `PENDING -> FAILED`

### Transitions interdites

Lister les transitions interdites ou non supportées.

### Règles de conservation / archivage / suppression

Préciser :

- ce qui est conservé ;
- ce qui est archivé ;
- ce qui peut être purgé ;
- ce qui ne doit pas être supprimé implicitement.

---

## Transactions / cohérence / concurrence

### Ce qui doit être atomique

Lister les écritures qui doivent réussir ou échouer ensemble.

- ...
- ...
- ...
- ...

### Ce qui peut être eventual consistency

Lister les traitements pouvant partir après commit.

- ...
- ...
- ...
- ...

### Stratégie de concurrence

Documenter comment le domaine protège ses invariants :

- garde métier ;
- contrainte unique ;
- version ;
- ordre strict ;
- clé d’idempotence ;
- autre.

Décrire aussi les conflits attendus :

- ...
- ...
- ...

### Idempotence

Lister les commandes métier qui doivent être idempotentes.

Pour chacune, préciser :

- la commande ;
- la clé d’intention ;
- le comportement attendu en cas de retry ;
- le comportement attendu si l’opération est déjà appliquée.

### Domain events écrits dans la même transaction

Lister les events durables écrits avec la mutation source :

- `...`
- `...`
- `...`

### Effets secondaires après commit

Lister ce qui ne doit jamais être exécuté dans la transaction principale :

- ...
- ...
- ...
- ...

---

## Impact maintenance / exploitation

### Niveau de maintenance minimal recommandé

Préciser le niveau minimal recommandé :

- `M1`
- `M2`
- `M3`
- `M4`

### Pourquoi

Expliquer le lien entre la criticité du domaine et le niveau de maintenance minimal.

### Points d’exploitation à surveiller

- ...
- ...
- ...
- ...

---

## Impact coût / complexité

Décrire ce qui fait monter le coût dans ce domaine :

- capabilities supplémentaires ;
- niveaux plus élevés ;
- providers supplémentaires ;
- contraintes réglementaires ;
- exigence d’exploitation.

Qualifier si utile en :

- `C1`
- `C2`
- `C3`
- `C4`

---

## Cas d’usage principaux

1. ...
2. ...
3. ...
4. ...
5. ...

---

## Cas limites / erreurs métier

Quelques cas d’erreur typiques :

- ...
- ...
- ...
- ...
- ...

---

## Décisions d’architecture

Les choix structurants du domaine sont :

- ...
- ...
- ...
- ...
- ...

---

## Questions explicitement closes

Les points suivants sont considérés comme décidés :

- ...
- ...
- ...
- ...
- ...
