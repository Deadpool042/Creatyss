# Documents

## Rôle

Le domaine `documents` porte les documents métier explicitement modélisés dans le système.

Il définit :

- ce qu’est un document du point de vue du système ;
- comment un document est généré, validé, publié, distribué, archivé ou rendu disponible ;
- comment ce domaine se distingue des médias bruts, des pages éditoriales, des emails, des exports techniques et des intégrations provider-specific ;
- comment le système reste maître de sa vérité interne sur les documents métier.

Le domaine existe pour fournir une représentation explicite des documents métier, distincte :

- des actifs média bruts portés par `media` ;
- des pages éditoriales portées par `pages` ;
- des emails portés par `email` ;
- des exports techniques portés par `export` ;
- des DTO provider-specific portés par `integrations`.

---

## Classification

### Catégorie documentaire

`core`

### Criticité architecturale

`coeur structurel`

### Activable

`oui`

Le domaine `documents` est activable.
Lorsqu’il est activé, il devient structurant pour les pièces métier générées ou gouvernées par le système, leur cycle de vie, leur traçabilité et leur disponibilité.

---

## Source de vérité

Le domaine `documents` est la source de vérité pour :

- la définition interne d’un document métier ;
- son identité ;
- son statut ;
- son type documentaire ;
- son rattachement à un objet métier source lorsque cette relation est portée ici ;
- sa version ou son exemplaire gouverné si le modèle les expose ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `documents` n’est pas la source de vérité pour :

- les médias source, qui relèvent de `media` ;
- les contenus éditoriaux de page, qui relèvent de `pages` ;
- les emails, qui relèvent de `email` ;
- les exports techniques, qui relèvent de `export` ;
- les DTO providers externes, qui relèvent de `integrations`.

Un document est un artefact métier gouverné.
Il ne doit pas être confondu avec :

- un simple fichier brut ;
- une pièce jointe email isolée ;
- un export technique ;
- une page web ;
- un média sans sémantique métier explicite.

---

## Responsabilités

Le domaine `documents` est responsable de :

- définir ce qu’est un document dans le système ;
- porter les documents métier structurés ;
- porter leurs statuts ;
- porter leurs types documentaires ;
- exposer une lecture gouvernée des documents actifs, distribuables, archivés ou restreints ;
- publier les événements significatifs liés à la vie d’un document ;
- protéger le système contre les documents implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- factures ;
- avoirs documentaires ;
- confirmations documentaires ;
- pièces contractuelles ;
- documents clients ;
- documents opératoires ;
- versionnement documentaire ;
- politiques de rétention ou d’archivage ;
- distribution contrôlée d’un document vers email, download ou intégration.

---

## Non-responsabilités

Le domaine `documents` n’est pas responsable de :

- définir les médias bruts ;
- définir les pages éditoriales ;
- porter les emails ;
- porter les exports techniques ;
- exécuter les intégrations provider-specific ;
- devenir un DAM universel ou un GED globale sans frontières métier explicites.

Le domaine `documents` ne doit pas devenir :

- un doublon de `media` ;
- un doublon de `email` ;
- un doublon de `export` ;
- un conteneur flou de fichiers ou PDF sans modèle métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un document possède une identité stable ;
- un document possède un type explicite ;
- un document possède un statut explicite ;
- un document archivé ou révoqué ne doit pas être traité comme actif sans règle explicite ;
- une mutation significative de statut, version, rattachement ou disponibilité doit être traçable ;
- un document ne se confond pas avec son média de rendu éventuel ;
- les domaines consommateurs ne doivent pas recréer librement leur propre vérité divergente de document quand le cadre commun existe ;
- un document distribué ou exposé doit rester rattachable à sa vérité métier interne.

Le domaine protège la cohérence des documents métier gouvernés.

---

## Dépendances

### Dépendances métier

Le domaine `documents` interagit fortement avec :

- `orders`
- `customers`
- `payments`
- `returns`
- `users`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `legal`
- `email`, comme canal de distribution lorsqu’applicable
- `media`, lorsque certains rendus ou fichiers sont stockés comme actifs liés
- `jobs`, si certaines générations, distributions ou archivages sont différés

### Dépendances externes

Le domaine peut être relié à :

- services de génération PDF ;
- services de signature ;
- coffres documentaires ;
- ERP ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `documents` porte les documents métier gouvernés.
Il ne doit pas absorber :

- les médias bruts ;
- les emails ;
- les exports techniques ;
- les providers externes ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `documents` publie ou peut publier des événements significatifs tels que :

- document créé ;
- document généré ;
- document validé ;
- document distribué ;
- document archivé ;
- document révoqué ;
- version de document créée ;
- rattachement de document modifié.

Le domaine peut consommer des signaux liés à :

- commande confirmée ;
- paiement confirmé ;
- retour validé ;
- action administrative structurée ;
- politique légale modifiée ;
- génération ou stockage technique validé.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `documents` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- créé ;
- généré ;
- actif ;
- archivé.

Des états supplémentaires peuvent exister :

- en attente ;
- validé ;
- distribué ;
- révoqué ;
- expiré ;
- restreint.

Le domaine doit éviter :

- les documents “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `documents` expose principalement :

- des lectures de documents structurés ;
- des lectures de statut et type documentaire ;
- des lectures de disponibilité ou distribution ;
- des lectures exploitables par `orders`, `customers`, `payments`, `email`, `audit` et certaines couches d’administration ;
- des structures prêtes à être consommées par les domaines autorisés.

Le domaine reçoit principalement :

- des créations ou mises à jour de documents ;
- des demandes de génération, validation, distribution ou archivage ;
- des demandes de lecture d’un document ;
- des contextes de commande, client, paiement, boutique ou usage ;
- des signaux internes utiles à l’évolution du cycle de vie.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `documents` peut être exposé à des contraintes telles que :

- génération différée ;
- multi-boutiques ;
- multi-langues ;
- distribution par email ou download ;
- archivage légal ;
- versionnement ;
- signature ;
- projection vers systèmes externes ;
- rétrocompatibilité des formats ou types.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des documents reste dans `documents` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un document incohérent ne doit pas être promu silencieusement ;
- les conflits entre statut, version, rattachement et distribution doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `documents` peut manipuler des données personnelles, contractuelles, financières ou opératoires sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre génération, validation, distribution et archivage ;
- protection des documents restreints ou non publics ;
- limitation de l’exposition selon le rôle, le scope et le besoin métier ;
- audit des changements significatifs de statut, contenu, version ou disponibilité ;
- prudence sur la rétention, l’accès et la suppression.

---

## Observabilité et audit

Le domaine `documents` doit rendre visibles au minimum :

- quel document existe pour quel objet métier ;
- quel statut est en vigueur ;
- quel type documentaire est concerné ;
- pourquoi un document est disponible, restreint, archivé, révoqué ou absent ;
- si une évolution est bloquée à cause d’une règle, d’un statut ou d’une incohérence ;
- si une génération ou distribution a modifié la disponibilité effective.

L’audit doit permettre de répondre à des questions comme :

- quel document a été créé, généré, distribué ou archivé ;
- quand ;
- selon quelle origine ;
- avec quel changement de statut, version ou rattachement ;
- avec quelle validation ou action humaine ;
- avec quel impact sur le parcours métier concerné.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- document introuvable ;
- type invalide ;
- statut incohérent ;
- évolution non autorisée ;
- distribution échouée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `Document` : document métier structuré ;
- `DocumentType` : type documentaire explicite ;
- `DocumentStatus` : état du document ;
- `DocumentVersion` : version gouvernée si ce modèle est porté ;
- `DocumentDistribution` : distribution ou disponibilité contrôlée ;
- `DocumentPolicy` : règle de gouvernance, de rétention ou de distribution.

---

## Impact de maintenance / exploitation

Le domaine `documents` a un impact d’exploitation élevé lorsqu’il est activé.

Raisons :

- il touche des pièces métier sensibles ;
- ses erreurs peuvent affecter clients, opérations, comptabilité ou conformité ;
- il nécessite une forte traçabilité ;
- il dépend souvent de génération, stockage, distribution et archivage ;
- il interagit avec plusieurs domaines coeur.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la disponibilité des documents attendus ;
- la traçabilité des générations et distributions ;
- la cohérence avec commandes, paiements et clients ;
- les effets de bord sur email, support et conformité ;
- la rétention et l’archivage.

Le domaine doit être considéré comme sensible dès qu’un flux documentaire métier réel existe.

---

## Limites du domaine

Le domaine `documents` s’arrête :

- avant les médias bruts ;
- avant les emails ;
- avant les exports techniques ;
- avant les providers externes ;
- avant les DTO providers externes.

Le domaine `documents` porte les documents métier gouvernés.
Il ne doit pas devenir un DAM universel, un système email ou un conteneur générique de fichiers.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `documents` et `media` ;
- la frontière exacte entre `documents` et `email` ;
- la frontière exacte entre `documents` et `export` ;
- la part exacte des versions réellement supportées ;
- la gouvernance de l’archivage légal ;
- la hiérarchie entre vérité interne et coffre documentaire externe éventuel ;
- la place exacte des documents générés par paiement, commande ou retour.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/commerce/orders.md`
- `../core/commerce/customers.md`
- `../optional/commerce/payments.md`
- `../optional/returns.md`
- `../core/foundation/users.md`
- `../core/foundation/stores.md`
- `../satellites/media.md`
- `../cross-cutting/email.md`
- `../cross-cutting/export.md`
- `../cross-cutting/audit.md`
- `../cross-cutting/observability.md`
- `../cross-cutting/legal.md`
- `../optional/platform/integrations.md`
