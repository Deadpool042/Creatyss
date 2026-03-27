# Juridique

## Rôle

Le domaine `legal` porte les contraintes, obligations et cadres juridiques explicitement reconnus par le système.

Il définit :

- quelles obligations juridiques doivent être respectées ;
- quels objets, parcours ou usages sont soumis à ces obligations ;
- quelles règles doivent être rendues opposables, traçables ou vérifiables ;
- comment le système distingue une contrainte juridique d’une simple règle métier ou d’une préférence produit ;
- comment les exigences juridiques s’articulent avec les autres domaines.

Le domaine existe pour fournir un cadre juridique explicite et exploitable, distinct :

- du consentement ;
- de l’audit ;
- de l’authentification ;
- des campagnes marketing ;
- des intégrations externes.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse critique`

### Activable

`non`

Le domaine `legal` est structurel dès lors que le système :

- collecte ou traite des données personnelles ;
- exécute des parcours contractuels ou transactionnels ;
- doit respecter des obligations réglementaires, contractuelles ou d’information.

---

## Source de vérité

Le domaine `legal` est la source de vérité pour :

- la représentation interne des exigences juridiques explicitement portées par le système ;
- la structuration des obligations opposables ou vérifiables dans le produit ;
- la relation entre une obligation, son périmètre et ses effets sur le comportement du système ;
- la version interne des artefacts juridiques lorsque cette responsabilité est portée ici.

Le domaine `legal` n’est pas la source de vérité pour :

- l’identité du client, qui relève de `customers` ;
- l’authentification, qui relève de `auth` ;
- le consentement comme expression de volonté, qui relève de `consent` ;
- l’audit global du système ;
- la logique métier commerciale ;
- le contenu exhaustif d’un outil juridique externe, sauf s’il est explicitement intégré comme source d’autorité.

Le domaine `legal` porte le cadre juridique applicable dans le système.
Il ne remplace ni le métier, ni l’audit, ni le consentement.

---

## Responsabilités

Le domaine `legal` est responsable de :

- définir les exigences juridiques explicitement portées par le système ;
- structurer les obligations applicables aux parcours critiques ;
- exprimer les dépendances juridiques entre certains usages et certaines conditions ;
- exposer un cadre exploitable aux domaines consommateurs ;
- encadrer la version et l’opposabilité des artefacts juridiques si cette responsabilité est portée ici ;
- publier les événements significatifs liés aux changements juridiques structurants ;
- protéger le système contre l’application implicite ou floue d’obligations juridiques.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- version de CGV / CGU ;
- version de politique de confidentialité ;
- règles d’information précontractuelle ;
- cadres de conservation ou suppression ;
- obligations d’information sur cookies ou tracking ;
- dépendances juridiques conditionnant certains parcours.

---

## Non-responsabilités

Le domaine `legal` n’est pas responsable de :

- recueillir le consentement lui-même ;
- authentifier un utilisateur ;
- gérer les rôles et permissions ;
- implémenter seul l’audit ;
- porter le contenu marketing ;
- exécuter les campagnes ou traitements aval ;
- gouverner les intégrations externes ;
- remplacer une expertise juridique humaine ;
- devenir un dépôt passif de documents PDF non reliés au comportement système.

Le domaine `legal` ne doit pas devenir :

- un simple dossier documentaire sans impact opérationnel ;
- un substitut à `consent` ;
- un prétexte pour disperser des règles légales dans tous les domaines sans gouvernance.

---

## Invariants

Les invariants minimaux sont les suivants :

- une obligation juridique portée par le système doit avoir un périmètre explicite ;
- une contrainte juridique ne doit pas être ambiguë sur ce qu’elle conditionne ;
- une version juridique opposable doit être identifiable ;
- un changement juridique structurant doit être traçable ;
- une exigence légale portée par le système ne doit pas rester implicite si elle conditionne un parcours ;
- un domaine consommateur ne doit pas appliquer silencieusement une règle juridique non gouvernée ;
- une obligation expirée, remplacée ou obsolète ne doit pas être utilisée comme si elle était toujours en vigueur sans règle explicite.

Le domaine protège la lisibilité et l’opposabilité du cadre juridique porté par le système.

---

## Dépendances

### Dépendances métier

Le domaine `legal` interagit fortement avec :

- `customers`
- `checkout`
- `orders`
- `payments`
- `consent`
- `newsletter`
- `tracking`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `jobs`, si certaines mises à jour ou propagations sont différées
- `integrations`, si certaines obligations doivent être synchronisées vers l’extérieur

### Dépendances externes

Le domaine peut interagir avec :

- outils de gestion juridique ;
- CMS ou référentiels documentaires ;
- plateformes de consentement ;
- CRM ;
- systèmes d’archivage ou de conservation.

### Règle de frontière

Le domaine `legal` porte les contraintes juridiques reconnues par le système.
Il ne doit pas absorber :

- l’expression du consentement ;
- la logique métier complète ;
- l’audit global ;
- ni la gouvernance complète des outils externes.

---

## Événements significatifs

Le domaine `legal` publie ou peut publier des événements significatifs tels que :

- version juridique publiée ;
- version juridique remplacée ;
- obligation juridique activée ;
- obligation juridique retirée ;
- politique mise à jour ;
- cadre contractuel modifié ;
- exigence d’acceptation modifiée ;
- exigence de conservation modifiée.

Le domaine peut consommer des signaux liés à :

- publication de nouveaux textes ;
- changement réglementaire intégré au système ;
- changement de périmètre produit ;
- évolution du consentement ;
- synchronisation documentaire externe.

Les noms exacts doivent rester compréhensibles dans le langage interne du système.

---

## Cycle de vie

Le domaine `legal` possède un cycle de vie partiel au niveau des artefacts ou règles juridiques qu’il porte.

Le cycle exact dépend du modèle retenu, mais il doit au minimum distinguer :

- brouillon, si pertinent ;
- publié ;
- actif ;
- remplacé ;
- archivé.

Le domaine doit éviter :

- les versions “fantômes” ;
- les remplacements silencieux ;
- l’absence de repère temporel sur ce qui était applicable à un moment donné.

---

## Interfaces et échanges

Le domaine `legal` expose principalement :

- des lectures de cadre juridique applicable ;
- des lectures de versions opposables ;
- des signaux structurants liés aux changements juridiques ;
- des informations exploitables par `checkout`, `orders`, `consent` ou d’autres domaines consommateurs.

Le domaine reçoit principalement :

- des mises à jour de textes ou de versions ;
- des décisions de publication ;
- des synchronisations externes ;
- des changements de périmètre produit impliquant une requalification juridique.

Le domaine ne doit pas exposer un contrat flou où “juridique”, “consentement”, “préférences” et “audit” sont confondus.

---

## Contraintes d’intégration

Le domaine `legal` peut être exposé à des contraintes telles que :

- versionnement ;
- opposabilité temporelle ;
- synchronisation avec outils externes ;
- divergence entre référentiels ;
- propagation différée ;
- conservation ;
- besoin d’historique ;
- rattachement tardif d’un acteur à une version applicable.

Règles minimales :

- toute mutation structurante doit être traçable ;
- la hiérarchie d’autorité doit être explicite ;
- un système externe ne doit pas écraser silencieusement la vérité interne ;
- une version applicable doit être identifiable ;
- un changement juridique critique ne doit pas rester invisible pour les domaines consommateurs ;
- les traitements rejouables doivent être idempotents ou neutralisés.

---

## Observabilité et audit

Le domaine `legal` doit rendre visibles au minimum :

- les publications de versions ;
- les remplacements ;
- les erreurs de synchronisation ;
- les divergences externes ;
- les événements significatifs publiés ;
- les échecs de propagation vers les domaines consommateurs.

L’audit doit permettre de répondre à des questions comme :

- quelle version était applicable ;
- quand elle a été publiée ou remplacée ;
- sur quel périmètre ;
- avec quel impact sur les parcours ;
- avec quelle origine ;
- avec quel lien vers les consentements ou acceptations concernés lorsque pertinent.

L’observabilité doit distinguer :

- erreur de modèle juridique ;
- erreur technique ;
- divergence de version ;
- absence de propagation ;
- incohérence entre cadre juridique et comportement système.

---

## Impact de maintenance / exploitation

Le domaine `legal` a un impact d’exploitation élevé.

Raisons :

- il influence directement des parcours critiques ;
- il peut avoir des implications contractuelles et réglementaires fortes ;
- il doit souvent s’articuler avec plusieurs outils ou domaines ;
- ses erreurs peuvent rester discrètes mais produire des risques importants.

En exploitation, une attention particulière doit être portée à :

- la cohérence des versions ;
- la traçabilité des publications ;
- les divergences avec des référentiels externes ;
- les impacts sur les parcours de consentement, checkout et commande ;
- la lisibilité de ce qui est applicable à un instant donné.

Le domaine doit être considéré comme critique pour la conformité opérationnelle et contractuelle.

---

## Limites du domaine

Le domaine `legal` s’arrête :

- avant l’expression du consentement ;
- avant l’audit global ;
- avant l’authentification ;
- avant la logique métier commerciale ;
- avant l’exécution des campagnes marketing ;
- avant les intégrations techniques non spécifiques.

Le domaine `legal` porte le cadre juridique applicable dans le système.
Il ne doit pas absorber toute la conformité, toute la documentation ni toute la gouvernance du produit.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `legal` et `consent` ;
- la frontière exacte entre `legal` et `audit` ;
- la liste canonique des artefacts juridiques réellement portés par le système ;
- la stratégie de versionnement ;
- la hiérarchie entre référentiel interne et outil externe ;
- la politique de conservation ;
- la relation exacte entre version juridique, consentement et acceptation contractuelle.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `consent.md`
- `audit.md`
- `observability.md`
- `../core/commerce/checkout.md`
- `../core/commerce/orders.md`
- `../core/commerce/customers.md`
- `newsletter.md`
- `tracking.md`
