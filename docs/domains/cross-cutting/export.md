# Export

## Rôle

Le domaine `export` porte les exportations structurées du système.

Il définit :

- ce qu’est un export du point de vue du système ;
- comment un fichier, flux ou jeu de données exportable est demandé, préparé, généré, mis à disposition, expiré, annulé ou échoué ;
- comment ce domaine se distingue des documents métier durables, des intégrations provider-specific, des webhooks et de l’analytics elle-même ;
- comment le système reste maître de sa vérité interne sur les opérations d’export structurées.

Le domaine existe pour fournir une représentation explicite des exports structurés, distincte :

- des documents métier durables portés par `documents` ;
- des intégrations provider-specific portées par `integrations` ;
- des webhooks ;
- de l’analytics consolidée portée par `analytics` ;
- des DTO providers externes.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `export` est structurel dès lors qu’une extraction gouvernée de données internes existe dans le système.

---

## Source de vérité

Le domaine `export` est la source de vérité pour :

- les définitions d’export disponibles ;
- les demandes d’export ;
- les paramètres, périmètres et formats d’export ;
- les statuts d’export ;
- les artefacts d’export produits lorsqu’ils sont gouvernés ici ;
- les politiques de sécurité, de rétention ou d’exposition des exports lorsqu’elles sont portées ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `export` n’est pas la source de vérité pour :

- les documents métier durables, qui relèvent de `documents` ;
- les intégrations provider-specific, qui relèvent de `integrations` ;
- les notifications sortantes génériques, qui relèvent de `webhooks` ;
- l’analytics consolidée, qui relève de `analytics` ;
- les DTO providers externes.

Un export est une opération d’extraction structurée gouvernée.
Il ne doit pas être confondu avec :

- un document métier durable ;
- un provider externe ;
- un webhook ;
- une vue analytique ;
- un dump brut de base sans langage métier explicite.

---

## Responsabilités

Le domaine `export` est responsable de :

- définir ce qu’est un export dans le système ;
- porter les définitions d’exports structurés ;
- porter les demandes d’export et leurs paramètres ;
- porter les statuts d’export ;
- porter les artefacts d’export produits ;
- exposer une lecture gouvernée des exports disponibles, passés, expirés, annulés ou échoués ;
- publier les événements significatifs liés à la vie d’un export ;
- protéger le système contre les extractions implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- exports de commandes ;
- exports clients ;
- exports catalogue ;
- exports documentaires ;
- exports analytiques cadrés ;
- exports par période ou périmètre métier ;
- rétention ou expiration d’artefacts ;
- règles locales par boutique ;
- exposition contrôlée pour téléchargement ou échange cadré.

---

## Non-responsabilités

Le domaine `export` n’est pas responsable de :

- porter les documents métier durables ;
- porter les intégrations providers externes ;
- porter les notifications sortantes génériques ;
- porter l’analytics consolidée ;
- exécuter les providers externes comme vérité première ;
- devenir un simple dump technique brut de base de données sans langage métier explicite ;
- absorber toute logique de reporting ou tout format externe sans frontière claire.

Le domaine `export` ne doit pas devenir :

- un doublon de `documents` ;
- un doublon de `integrations` ;
- un doublon de `webhooks` ;
- un doublon de `analytics` ;
- un conteneur flou d’artefacts sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un export possède un identifiant stable, un périmètre explicite et un statut explicite ;
- un artefact d’export est rattaché à une demande d’export explicite ;
- `export` ne se confond pas avec `documents` ;
- `export` ne se confond pas avec `integrations` ;
- `export` ne se confond pas avec `webhooks` ;
- `export` ne se confond pas avec `analytics` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’export structuré quand le cadre commun `export` existe ;
- un export sensible ne doit pas être accessible hors règle explicite de sécurité, de rôle et de scope ;
- un artefact expiré ou annulé ne doit pas être traité comme disponible sans règle explicite.

Le domaine protège la cohérence des extractions structurées, pas la vérité primaire des domaines source.

---

## Dépendances

### Dépendances métier

Le domaine `export` interagit fortement avec :

- `orders`
- `customers`
- `products`
- `documents`
- `analytics`
- `events`
- `support`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `jobs`, pour l’exécution différée ou lourde d’un export sans absorber sa responsabilité
- `audit`
- `observability`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- outils BI ;
- systèmes d’échange externes ;
- ERP ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `export` porte les exportations structurées.
Il ne doit pas absorber :

- les documents durables ;
- les intégrations providers ;
- les webhooks ;
- l’analytics consolidée ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `export` publie ou peut publier des événements significatifs tels que :

- export demandé ;
- export démarré ;
- export généré ;
- export échoué ;
- export expiré ;
- export annulé ;
- statut d’export modifié.

Le domaine peut consommer des signaux liés à :

- job réussi ;
- job échoué ;
- capability boutique modifiée ;
- action administrative structurée de génération, expiration ou annulation d’export.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `export` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- demandé ;
- démarré ;
- généré ;
- échoué ;
- expiré ;
- annulé.

Des états supplémentaires peuvent exister :

- en attente ;
- archivé ;
- restreint ;
- supprimé logiquement.

Le domaine doit éviter :

- les exports “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `export` expose principalement :

- des définitions d’export structurées ;
- des demandes d’export et leur état ;
- des artefacts d’export produits ;
- des lectures exploitables par `dashboarding`, `observability`, `audit`, `integrations` et certaines couches d’administration ;
- des structures exportables prêtes à être consommées par des couches d’exécution ou de téléchargement autorisées.

Le domaine reçoit principalement :

- des demandes de génération d’export ;
- des paramètres de filtrage, période, périmètre ou format d’export ;
- des demandes de lecture d’un export disponible ou de son historique ;
- des changements de statut d’un export en cours de préparation ;
- des contextes de boutique, scope, acteur, langue ou format cible ;
- des signaux internes utiles à l’activation, l’expiration ou l’annulation d’un export.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `export` peut être exposé à des contraintes telles que :

- exports volumineux ;
- exécution différée ;
- formats multiples ;
- multi-boutiques ;
- exports analytiques cadrés ;
- rétention limitée ;
- exposition contrôlée pour téléchargement ;
- projection vers systèmes externes ;
- rétrocompatibilité des formats ou périmètres.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des exports reste dans `export` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un export incohérent ne doit pas être promu silencieusement ;
- les conflits entre format, périmètre, rétention, rôle et statut doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `export` manipule potentiellement des ensembles de données sensibles à large périmètre.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- limitation des exports selon le rôle, le scope et le besoin métier ;
- séparation claire entre export structuré, document métier durable et échange externe provider-specific ;
- protection des artefacts d’export sensibles, expirables ou à accès restreint ;
- audit des demandes, téléchargements ou consultations sensibles si le modèle final les retient.

---

## Observabilité et audit

Le domaine `export` doit rendre visibles au minimum :

- quel export a été demandé ;
- quel périmètre et quel format ont été retenus ;
- quel statut d’export est en vigueur ;
- pourquoi un export a été différé, échoué, expiré ou annulé ;
- si un export n’est pas disponible à cause d’une capability inactive, d’un périmètre interdit, d’une policy de sécurité ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel export a été demandé, généré, expiré ou annulé ;
- quand ;
- selon quelle origine ;
- avec quel périmètre ;
- avec quelle action manuelle significative ;
- avec quel impact d’exposition ou de téléchargement.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- format non supporté ;
- artefact indisponible ;
- périmètre interdit ;
- export expiré ;
- permission insuffisante.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ExportDefinition` : définition structurée d’un export disponible ;
- `ExportRequest` : demande d’export formulée par un acteur autorisé ;
- `ExportArtifact` : artefact ou fichier produit par l’export ;
- `ExportStatus` : état courant de l’export ;
- `ExportPolicy` : règle d’éligibilité, de rétention ou de sécurité ;
- `ExportScope` : périmètre métier de l’export.

---

## Impact de maintenance / exploitation

Le domaine `export` a un impact d’exploitation moyen à élevé.

Raisons :

- il touche potentiellement des extractions sensibles à large périmètre ;
- ses erreurs dégradent exploitation, partage de données et conformité ;
- il se situe à la frontière entre administration, sécurité et exécution ;
- il nécessite une forte explicabilité des statuts et périmètres ;
- il dépend souvent de formats, rétentions et règles d’accès variés.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la validité des périmètres ;
- la traçabilité des demandes et téléchargements ;
- la cohérence avec les domaines source ;
- les effets de bord sur dashboarding, intégrations et usages admin ;
- l’expiration correcte des artefacts sensibles.

Le domaine doit être considéré comme structurant dès qu’une extraction gouvernée réelle existe.

---

## Limites du domaine

Le domaine `export` s’arrête :

- avant les documents métier durables ;
- avant les intégrations providers ;
- avant les webhooks ;
- avant l’analytics consolidée ;
- avant les DTO providers externes.

Le domaine `export` porte les exportations structurées du système.
Il ne doit pas devenir un moteur de reporting global, un simple dump technique ou un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `export` et `documents` ;
- la frontière exacte entre `export` et `analytics` ;
- la part exacte des artefacts réellement persistés ;
- la gouvernance des téléchargements et expirations ;
- la hiérarchie entre vérité interne et systèmes externes de consommation éventuels ;
- la place exacte des exports analytiques vs opérationnels.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/commerce/orders.md`
- `../core/commerce/customers.md`
- `../core/catalog/products.md`
- `../satellites/documents.md`
- `analytics.md`
- `events.md`
- `support.md`
- `jobs.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `../core/foundation/stores.md`
- `../optional/platform/integrations.md`
- `webhooks.md`
