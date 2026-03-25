# Import

## Rôle

Le domaine `import` porte les imports structurés du système.

Il définit :

- ce qu’est un import du point de vue du système ;
- comment un fichier, flux ou jeu de données externe est validé, analysé, autorisé, appliqué, partiellement appliqué, rejeté, annulé ou expiré ;
- comment ce domaine se distingue des intégrations provider-specific continues, des documents métier durables, des webhooks et de la logique métier des domaines cible ;
- comment le système reste maître de sa vérité interne sur les opérations d’ingestion structurée.

Le domaine existe pour fournir une représentation explicite des imports structurés, distincte :

- des intégrations provider-specific continues portées par `integrations` ;
- des documents métier durables portés par `documents` ;
- des webhooks ;
- de la logique métier complète des domaines cible ;
- des DTO providers externes.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `import` est structurel dès lors qu’une ingestion gouvernée de données externes vers les modèles internes existe dans le système.

---

## Source de vérité

Le domaine `import` est la source de vérité pour :

- les définitions d’import disponibles ;
- les demandes d’import ;
- les paramètres et périmètres d’import ;
- les validations préalables d’un import ;
- les statuts d’import ;
- les artefacts d’import lorsqu’ils sont gouvernés ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `import` n’est pas la source de vérité pour :

- les intégrations provider-specific continues, qui relèvent de `integrations` ;
- les documents métier durables, qui relèvent de `documents` ;
- les notifications sortantes génériques, qui relèvent de `webhooks` ;
- la logique métier complète des domaines cible ;
- les DTO providers externes.

Un import est une opération d’ingestion structurée gouvernée.
Il ne doit pas être confondu avec :

- une synchronisation continue ;
- un document métier durable ;
- un webhook ;
- un simple chargement technique brut en base ;
- une migration opaque hors cadre métier explicite.

---

## Responsabilités

Le domaine `import` est responsable de :

- définir ce qu’est un import dans le système ;
- porter les définitions d’import structurées ;
- porter les demandes d’import et leurs paramètres ;
- porter les validations, pré-contrôles et détections d’erreurs ;
- porter les statuts d’import ;
- exposer une lecture gouvernée des imports passés, en cours, rejetés, appliqués ou annulés ;
- publier les événements significatifs liés à la vie d’un import ;
- protéger le système contre les ingestions implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- imports catalogue ;
- imports clients ;
- imports commandes ;
- imports documentaires ;
- imports événementiels ;
- artefacts source ou rapports d’import ;
- imports par boutique ;
- règles de mapping ou de validation métier ;
- rapports de succès partiels et erreurs.

---

## Non-responsabilités

Le domaine `import` n’est pas responsable de :

- porter les intégrations provider-specific continues ;
- porter les documents métier durables ;
- porter les webhooks ;
- porter la logique métier complète des domaines cible ;
- exécuter les providers externes comme vérité première ;
- devenir un simple chargeur technique brut sans langage métier explicite ;
- absorber toute logique de migration, synchronisation ou mapping externe sans frontière claire.

Le domaine `import` ne doit pas devenir :

- un doublon de `integrations` ;
- un doublon de `documents` ;
- un doublon de `webhooks` ;
- un conteneur flou d’artefacts, mappings et jobs sans structure métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- un import possède un identifiant stable, un périmètre explicite et un statut explicite ;
- un artefact d’import est rattaché à une demande d’import explicite ;
- un import n’applique pas directement des changements massifs sans cadre explicite de validation ou d’autorisation ;
- `import` ne se confond pas avec `integrations` ;
- `import` ne se confond pas avec `documents` ;
- `import` ne se confond pas avec `webhooks` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’import structuré quand le cadre commun `import` existe ;
- un import sensible ne doit pas être applicable hors règle explicite de sécurité, de rôle, de scope et de validation.

Le domaine protège la cohérence des ingestions structurées, pas la vérité métier finale des domaines cible.

---

## Dépendances

### Dépendances métier

Le domaine `import` interagit fortement avec :

- `products`
- `catalog-modeling`
- `bundles`
- `pricing`
- `customers`
- `orders`
- `documents`
- `events`
- `support`
- `stores`

### Dépendances transverses

Le domaine dépend également de :

- `jobs`, pour l’exécution différée ou lourde d’un import sans absorber sa responsabilité
- `approval`, si certains imports sensibles nécessitent validation préalable
- `workflow`, si le cycle de vie d’un import suit un processus structuré
- `audit`
- `observability`

### Dépendances externes

Le domaine peut être relié indirectement à :

- flux externes ;
- fichiers fournis manuellement ;
- référentiels tiers ;
- ERP ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `import` porte les imports structurés.
Il ne doit pas absorber :

- les intégrations continues ;
- les documents durables ;
- les webhooks ;
- la logique métier complète des domaines cible ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `import` publie ou peut publier des événements significatifs tels que :

- import demandé ;
- import validé ;
- import rejeté ;
- import démarré ;
- import appliqué ;
- import partiellement appliqué ;
- import échoué ;
- import annulé ;
- statut d’import modifié.

Le domaine peut consommer des signaux liés à :

- job réussi ;
- job échoué ;
- approbation accordée ;
- workflow terminé ;
- capability boutique modifiée ;
- action administrative structurée de validation, application, annulation ou reprise d’import.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `import` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- demandé ;
- validé ;
- rejeté ;
- démarré ;
- appliqué ;
- échoué ;
- annulé.

Des états supplémentaires peuvent exister :

- partiellement appliqué ;
- expiré ;
- en attente ;
- archivé ;
- suspendu.

Le domaine doit éviter :

- les imports “fantômes” ;
- les changements silencieux de statut ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `import` expose principalement :

- des définitions d’import structurées ;
- des demandes d’import et leur état ;
- des validations et résultats de contrôle d’import ;
- des artefacts d’import et résultats d’application ;
- des lectures exploitables par `dashboarding`, `observability`, `audit`, `integrations` et certaines couches d’administration ;
- des structures importables prêtes à être consommées par les domaines cible ou couches d’exécution autorisées.

Le domaine reçoit principalement :

- des demandes de génération ou de lancement d’import ;
- des fichiers, flux ou jeux de données candidats à l’import ;
- des paramètres de format, de mapping, de périmètre ou d’application ;
- des demandes de validation préalable d’un import ;
- des demandes de lecture d’un import ou de son historique ;
- des contextes de boutique, scope, acteur, langue, domaine cible ou format source ;
- des signaux internes utiles à l’application, l’annulation ou l’expiration d’un import.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `import` peut être exposé à des contraintes telles que :

- imports volumineux ;
- exécution différée ;
- mapping configurable ;
- validation préalable obligatoire ;
- multi-boutiques ;
- imports partiels ;
- synchronisation ponctuelle avec systèmes externes ;
- rétrocompatibilité des formats ou mappings.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des imports reste dans `import` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- un artefact incohérent ne doit pas être appliqué silencieusement ;
- les conflits entre format, périmètre, mapping, rôle et statut doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `import` manipule potentiellement des ensembles de données sensibles et des modifications massives des modèles internes.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- limitation des imports selon le rôle, le scope et le besoin métier ;
- séparation claire entre import structuré, document métier durable et intégration provider continue ;
- protection des artefacts source, résultats de validation et rapports d’erreur sensibles ;
- audit des demandes, validations, applications ou consultations sensibles d’import.

---

## Observabilité et audit

Le domaine `import` doit rendre visibles au minimum :

- quel import a été demandé ;
- quel périmètre, quel format et quel domaine cible ont été retenus ;
- quel statut d’import est en vigueur ;
- pourquoi un import a été validé, rejeté, partiellement appliqué, échoué ou annulé ;
- si un import n’est pas disponible à cause d’une capability inactive, d’un périmètre interdit, d’une policy de sécurité, d’un mapping invalide ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel import a été demandé, validé, appliqué ou annulé ;
- quand ;
- selon quelle origine ;
- avec quel périmètre ou mapping ;
- avec quelle action manuelle significative ;
- avec quel impact sur le domaine cible concerné.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- format non supporté ;
- artefact invalide ;
- mapping incohérent ;
- périmètre interdit ;
- permission insuffisante.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ImportDefinition` : définition structurée d’un import disponible ;
- `ImportRequest` : demande d’import formulée par un acteur autorisé ;
- `ImportArtifact` : artefact ou fichier source associé à l’import ;
- `ImportValidationResult` : résultat de validation ou de pré-contrôle ;
- `ImportStatus` : état courant de l’import ;
- `ImportPolicy` : règle d’éligibilité, de mapping, de sécurité ou d’application ;
- `ImportScope` : périmètre métier de l’import.

---

## Impact de maintenance / exploitation

Le domaine `import` a un impact d’exploitation élevé.

Raisons :

- il touche potentiellement des modifications massives ;
- ses erreurs peuvent corrompre ou dégrader plusieurs domaines cible ;
- il se situe à la frontière entre administration, validation et exécution ;
- il nécessite une forte explicabilité des statuts et résultats ;
- il dépend souvent de formats, mappings et périmètres complexes.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- la qualité des artefacts source ;
- les mappings incohérents ;
- la traçabilité des validations et applications ;
- la cohérence avec les domaines cible ;
- les effets de bord sur intégrations, pilotage admin et reprise de données.

Le domaine doit être considéré comme structurant dès qu’une ingestion gouvernée réelle existe.

---

## Limites du domaine

Le domaine `import` s’arrête :

- avant les intégrations continues ;
- avant les documents métier durables ;
- avant les webhooks ;
- avant la logique métier complète des domaines cible ;
- avant les DTO providers externes.

Le domaine `import` porte les imports structurés du système.
Il ne doit pas devenir un moteur opaque de synchronisation, un simple chargeur technique ou un doublon des domaines cible.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `import` et `integrations` ;
- la frontière exacte entre `import` et `documents` ;
- la part exacte des mappings configurables réellement supportés ;
- la gouvernance des imports partiels ;
- la hiérarchie entre vérité interne et flux externes éventuels ;
- la place exacte des validations manuelles avant application.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `../core/products.md`
- `catalog-modeling.md`
- `bundles.md`
- `pricing.md`
- `../core/customers.md`
- `../core/orders.md`
- `../core/documents.md`
- `events.md`
- `support.md`
- `jobs.md`
- `approval.md`
- `workflow.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `../core/stores.md`
- `../core/integrations.md`
- `webhooks.md`
