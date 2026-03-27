# Approval

## Rôle

Le domaine `approval` porte les validations explicites et approbations gouvernées du système.

Il définit :

- ce qu’est une approbation du point de vue du système ;
- comment une demande d’approbation est créée, instruite, acceptée, refusée, renvoyée en révision ou clôturée ;
- comment ce domaine se distingue du workflow complet, de l’audit sensible, des permissions fines et de la vérité métier des domaines source ;
- comment le système reste maître de sa vérité interne de validation préalable.

Le domaine existe pour fournir une représentation explicite des décisions de validation, distincte :

- du workflow porté par `workflow` ;
- de l’audit porté par `audit` ;
- des permissions portées par `permissions` ;
- des rôles portés par `roles` ;
- de la vérité métier complète des domaines source ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `approval` est structurel dès lors que certaines actions sensibles, publications ou opérations ne doivent pas être exécutées immédiatement sans contrôle préalable.

---

## Source de vérité

Le domaine `approval` est la source de vérité pour :

- la définition interne d’une demande d’approbation ;
- ses statuts ;
- ses décisions d’acceptation, de refus ou de révision ;
- ses étapes d’approbation lorsqu’elles sont modélisées ici ;
- ses acteurs demandeurs ou approbateurs lorsqu’ils sont rattachés ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `approval` n’est pas la source de vérité pour :

- le workflow complet d’exécution, qui relève de `workflow` ;
- l’audit sensible, qui relève de `audit` ;
- les permissions fines, qui relèvent de `permissions` ;
- la vérité métier complète des domaines source ;
- les DTO providers externes, qui relèvent de `integrations`.

Une approbation est une décision gouvernée de validation préalable.
Elle ne doit pas être confondue avec :

- un workflow complet ;
- un droit ou une permission ;
- un audit trail ;
- une simple case booléenne locale ;
- une exécution métier effective.

---

## Responsabilités

Le domaine `approval` est responsable de :

- définir ce qu’est une approbation dans le système ;
- porter les demandes d’approbation ;
- porter les décisions d’acceptation, de refus ou de révision ;
- porter les statuts d’approbation ;
- porter les étapes de validation si le modèle retenu en prévoit plusieurs ;
- exposer une lecture gouvernée de l’état d’une approbation ;
- publier les événements significatifs liés à la vie d’une approbation ;
- protéger le système contre les validations implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- approbations de publication ;
- approbations produit ;
- approbations marketing ;
- approbations documentaires ;
- validations multi-acteurs ;
- politiques locales par boutique ;
- motifs d’acceptation, de refus ou de retour en révision ;
- restrictions de délégation d’approbation.

---

## Non-responsabilités

Le domaine `approval` n’est pas responsable de :

- porter le workflow complet d’exécution ;
- porter l’audit sensible ;
- porter les permissions fines ;
- porter la logique métier complète des domaines source ;
- exécuter les intégrations provider-specific ;
- devenir un système RH ou organisationnel généraliste sans lien avec les validations du système.

Le domaine `approval` ne doit pas devenir :

- un doublon de `workflow` ;
- un doublon de `audit` ;
- un doublon de `permissions` ;
- un simple statut booléen recopié localement partout sans langage commun.

---

## Invariants

Les invariants minimaux sont les suivants :

- une demande d’approbation possède un identifiant stable et un statut explicite ;
- une décision d’approbation est rattachée à une demande explicite ;
- une action nécessitant approbation peut rester bloquée tant qu’aucune décision valable n’a été rendue ;
- `approval` ne se confond pas avec `workflow` ;
- `approval` ne se confond pas avec `audit` ;
- `approval` ne se confond pas avec `permissions` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente d’approbation quand le cadre commun `approval` existe ;
- une décision invalide pour le statut courant ne doit pas être acceptée silencieusement.

Le domaine protège la cohérence de la validation préalable, pas l’exécution métier complète.

---

## Dépendances

### Dépendances métier

Le domaine `approval` interagit fortement avec :

- `users`
- `roles`
- `permissions`
- `stores`
- `workflow`
- `products`
- `marketing`
- `events`
- `documents`
- `integrations`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- systèmes de validation externes ;
- annuaires d’acteurs ;
- moteurs de gouvernance ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `approval` porte la décision gouvernée de validation préalable.
Il ne doit pas absorber :

- le workflow complet ;
- l’audit sensible ;
- les permissions fines ;
- la vérité métier des domaines source ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `approval` publie ou peut publier des événements significatifs tels que :

- approbation demandée ;
- approbation accordée ;
- approbation refusée ;
- approbation renvoyée en révision ;
- politique d’approbation mise à jour ;
- statut d’approbation modifié.

Le domaine peut consommer des signaux liés à :

- action source soumise à approbation ;
- capability boutique modifiée ;
- politique locale modifiée ;
- action administrative structurée ;
- changement de rôle ou de permission affectant la capacité d’approbation.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `approval` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- demandée ;
- en revue ;
- approuvée ;
- refusée ;
- renvoyée en révision ;
- clôturée, si pertinent.

Des états supplémentaires peuvent exister :

- expirée ;
- annulée ;
- suspendue ;
- archivée.

Le domaine doit éviter :

- les approbations “fantômes” ;
- les décisions silencieuses ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `approval` expose principalement :

- des demandes d’approbation structurées ;
- des décisions d’approbation ;
- des statuts d’approbation ;
- des lectures exploitables par `workflow`, `audit`, `observability`, `dashboarding` et les couches d’administration ;
- des résultats de validation préalable consommables par les domaines source.

Le domaine reçoit principalement :

- des demandes d’approbation émises par des domaines source ;
- des décisions d’acceptation, refus ou retour en révision ;
- des demandes de lecture d’état d’approbation ;
- des contextes acteur, ressource, boutique, scope, politique et instant de décision ;
- des changements de politique d’approbation.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `approval` peut être exposé à des contraintes telles que :

- validations multi-acteurs ;
- politiques locales par boutique ;
- dépendance à rôles et permissions ;
- expiration de demandes ;
- révision demandée ;
- délégation encadrée ;
- projection vers systèmes externes ;
- rétrocompatibilité des statuts ou politiques.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des approbations reste dans `approval` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une décision incohérente ne doit pas être promue silencieusement ;
- les conflits entre statut, acteur, politique et objet soumis doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `approval` manipule des décisions de gouvernance potentiellement sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre demandeur, approbateur et exécuteur ;
- protection des décisions, motifs et statuts sensibles ;
- traçabilité des approbations critiques ;
- limitation de l’exposition selon le rôle, le scope et la nature de la demande.

---

## Observabilité et audit

Le domaine `approval` doit rendre visibles au minimum :

- quelle demande d’approbation est en cours ;
- quel acteur a soumis ou décidé ;
- quel statut est en vigueur ;
- pourquoi une approbation a été accordée, refusée ou renvoyée en révision ;
- si une action source reste bloquée à cause d’une absence d’approbation, d’un refus ou d’une politique applicable.

L’audit doit permettre de répondre à des questions comme :

- quelle demande d’approbation a été créée ou modifiée ;
- quand ;
- selon quelle origine ;
- avec quelle décision rendue ;
- avec quelle politique appliquée ;
- avec quel impact sur l’action source concernée.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- approbateur non autorisé ;
- politique incohérente ;
- décision invalide pour le statut courant ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `ApprovalRequest` : demande d’approbation structurée ;
- `ApprovalDecision` : décision prise sur la demande ;
- `ApprovalStatus` : état courant de la demande ;
- `ApprovalStage` : étape de validation si applicable ;
- `ApprovalPolicy` : règle d’approbation applicable ;
- `ApprovalActorRef` : référence vers le demandeur ou l’approbateur ;
- `ApprovalSubjectRef` : référence vers l’objet ou l’action soumis à approbation.

---

## Impact de maintenance / exploitation

Le domaine `approval` a un impact d’exploitation moyen à élevé.

Raisons :

- il gouverne des validations sensibles ;
- ses erreurs peuvent bloquer ou autoriser indûment des actions à fort impact ;
- il se situe à la frontière entre rôles, permissions, workflow et domaines source ;
- il nécessite une forte explicabilité des décisions ;
- il interagit avec audit et observabilité de façon structurante.

En exploitation, une attention particulière doit être portée à :

- la cohérence des statuts ;
- les approbations bloquées ;
- les décisions sensibles ;
- la traçabilité des changements ;
- la cohérence avec rôles, permissions et domaines source ;
- les effets de bord sur workflow, publication et intégrations.

Le domaine doit être considéré comme structurant dès qu’une validation préalable gouvernée existe réellement.

---

## Limites du domaine

Le domaine `approval` s’arrête :

- avant le workflow complet ;
- avant l’audit sensible ;
- avant les permissions fines ;
- avant la logique métier complète des domaines source ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `approval` porte la validation préalable gouvernée.
Il ne doit pas devenir un moteur d’exécution, un système RH ou un doublon des domaines de sécurité.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `approval` et `workflow` ;
- la frontière exacte entre `approval` et `permissions` ;
- la part exacte des validations multi-étapes réellement supportées ;
- la gouvernance des délégations d’approbation ;
- la hiérarchie entre vérité interne et système externe de validation éventuel ;
- la place exacte des politiques locales par boutique.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `workflow.md`
- `audit.md`
- `permissions.md`
- `roles.md`
- `../core/foundation/users.md`
- `../core/foundation/stores.md`
- `../core/catalog/products.md`
- `../satellites/documents.md`
- `../optional/events.md`
- `../optional/platform/integrations.md`
- `observability.md`
- `dashboarding.md`
