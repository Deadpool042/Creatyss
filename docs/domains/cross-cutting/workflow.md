# Workflow

## Rôle

Le domaine `workflow` porte l’orchestration structurée des processus métier du système.

Il définit :

- ce qu’est un workflow du point de vue du système ;
- comment des étapes, transitions, blocages, préconditions et états de progression sont modélisés ;
- comment plusieurs actions métier sont coordonnées dans un ordre explicite ;
- comment ce domaine se distingue des approbations, des jobs asynchrones, des domain events internes et de la vérité métier des domaines source ;
- comment le système reste maître de sa vérité interne d’orchestration.

Le domaine existe pour fournir une représentation explicite des processus multi-étapes, distincte :

- des approbations portées par `approval` ;
- des jobs asynchrones portés par `jobs` ;
- des domain events internes ;
- de la vérité métier des domaines source ;
- des intégrations provider-specific portées par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `workflow` est structurel dès lors que plusieurs processus métier nécessitent une coordination explicite entre étapes, validations, blocages et transitions.

---

## Source de vérité

Le domaine `workflow` est la source de vérité pour :

- la définition interne d’un workflow ;
- ses étapes ;
- ses transitions ;
- ses gardes, préconditions et blocages ;
- ses instances d’exécution ;
- ses statuts de progression ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `workflow` n’est pas la source de vérité pour :

- les décisions d’approbation, qui relèvent de `approval` ;
- l’exécution asynchrone rejouable, qui relève de `jobs` ;
- les faits métier internes, qui relèvent de `domain-events` ;
- la vérité métier de l’objet orchestré, qui reste dans le domaine source ;
- les DTO providers externes, qui relèvent de `integrations`.

Un workflow est une orchestration structurée.
Il ne doit pas être confondu avec :

- une approbation ;
- un job technique ;
- un domain event ;
- une simple checklist UI ;
- la vérité métier complète du domaine source.

---

## Responsabilités

Le domaine `workflow` est responsable de :

- définir ce qu’est un workflow dans le système ;
- porter les définitions de workflow ;
- porter les instances concrètes d’exécution ;
- porter les étapes, transitions et blocages explicites ;
- exposer une lecture gouvernée des workflows en cours, bloqués, terminés ou annulés ;
- publier les événements significatifs liés à la vie d’un workflow ;
- protéger le système contre les orchestrations implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- workflows de publication ;
- workflows documentaires ;
- workflows marketing ;
- workflows de validation croisée ;
- reprises manuelles ;
- transitions conditionnelles ;
- règles locales par boutique ou contexte ;
- orchestration de processus sensibles à plusieurs acteurs.

---

## Non-responsabilités

Le domaine `workflow` n’est pas responsable de :

- porter les décisions d’approbation ;
- porter l’exécution asynchrone ou la file technique ;
- porter les domain events internes ;
- porter la vérité métier complète du domaine source ;
- exécuter les intégrations provider-specific ;
- devenir un moteur générique opaque où toute logique applicative est déplacée sans langage métier clair.

Le domaine `workflow` ne doit pas devenir :

- un doublon de `approval` ;
- un doublon de `jobs` ;
- un doublon de `domain-events` ;
- un conteneur flou de transitions sans sémantique métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une instance de workflow possède un identifiant stable et un statut explicite ;
- une transition de workflow est rattachée à une instance et à des étapes explicites ;
- une étape ne peut progresser que si ses préconditions et règles applicables sont satisfaites ;
- `workflow` ne se confond pas avec `approval` ;
- `workflow` ne se confond pas avec `jobs` ;
- `workflow` ne se confond pas avec `domain-events` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de coordination multi-étapes quand le cadre commun `workflow` existe ;
- un workflow bloqué ou terminé ne doit pas être traité comme librement progressable sans règle explicite.

Le domaine protège la cohérence de l’orchestration, pas la vérité métier des objets orchestrés.

---

## Dépendances

### Dépendances métier

Le domaine `workflow` interagit fortement avec :

- `approval`
- `stores`
- `products`
- `marketing`
- `events`
- `documents`
- `integrations`

### Dépendances transverses

Le domaine dépend également de :

- `domain-events`
- `audit`
- `observability`
- `jobs`, comme exécution technique aval quand nécessaire
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- moteurs de workflow externes ;
- orchestrateurs techniques ;
- systèmes de validation ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `workflow` porte l’orchestration structurée.
Il ne doit pas absorber :

- les décisions d’approbation ;
- l’exécution asynchrone ;
- les domain events internes ;
- la vérité métier des domaines source ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `workflow` publie ou peut publier des événements significatifs tels que :

- workflow démarré ;
- étape de workflow entrée ;
- transition de workflow complétée ;
- workflow bloqué ;
- workflow terminé ;
- workflow échoué ;
- statut de workflow modifié.

Le domaine peut consommer des signaux liés à :

- approbation accordée ;
- approbation rejetée ;
- événement métier source déclencheur ;
- capability boutique modifiée ;
- action administrative structurée ;
- reprise manuelle autorisée.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `workflow` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- démarré ;
- en cours ;
- bloqué ;
- terminé ;
- échoué ;
- annulé, si pertinent.

Des états supplémentaires peuvent exister :

- en attente ;
- suspendu ;
- en reprise ;
- archivé.

Le domaine doit éviter :

- les workflows “fantômes” ;
- les transitions silencieuses ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `workflow` expose principalement :

- des définitions de workflow ;
- des instances de workflow et leurs états ;
- des étapes, transitions et blocages explicites ;
- des lectures exploitables par `approval`, `audit`, `observability`, `dashboarding` et les domaines source consommateurs ;
- des déclenchements d’actions ou d’étapes suivantes consommables par les autres couches du système.

Le domaine reçoit principalement :

- des demandes de démarrage de workflow ;
- des événements internes ou actions source déclenchant une transition ;
- des décisions d’approbation consommables depuis `approval` ;
- des demandes de lecture de l’état d’un workflow ou d’une instance ;
- des contextes acteur, ressource, boutique, scope et instant d’exécution ;
- des demandes de reprise ou d’avancement manuel si la politique retenue l’autorise.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `workflow` peut être exposé à des contraintes telles que :

- processus multi-étapes ;
- transitions conditionnelles ;
- dépendance à approbation ;
- exécution différée de certaines actions ;
- orchestration multi-acteurs ;
- règles locales par boutique ;
- reprise manuelle ;
- rétrocompatibilité des définitions de workflow.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité interne des workflows reste dans `workflow` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une transition incohérente ne doit pas être promue silencieusement ;
- les conflits entre état, garde, approbation et action source doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `workflow` manipule des états de processus et parfois des décisions de progression sensibles.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre définition, instance, transition et action source ;
- protection des avancements manuels, forçages ou reprises sensibles ;
- traçabilité des transitions critiques ;
- limitation de l’exposition selon le rôle, le scope et la nature du processus.

---

## Observabilité et audit

Le domaine `workflow` doit rendre visibles au minimum :

- quel workflow est en cours ;
- quelle étape est active ;
- pourquoi une transition a été autorisée, refusée ou bloquée ;
- quel événement, quelle approbation ou quelle action a déclenché l’avancement ;
- si un workflow reste bloqué à cause d’une précondition non satisfaite, d’un refus d’approbation ou d’une règle applicable.

L’audit doit permettre de répondre à des questions comme :

- quel workflow a été démarré, bloqué, repris ou terminé ;
- quand ;
- selon quelle origine ;
- avec quelle transition significative ;
- avec quelle action manuelle éventuelle ;
- avec quel impact sur le processus source.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- transition invalide ;
- précondition non satisfaite ;
- approbation manquante ou refusée ;
- évolution non autorisée.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `WorkflowDefinition` : définition structurée d’un workflow ;
- `WorkflowInstance` : instance concrète d’exécution ;
- `WorkflowStep` : étape du processus ;
- `WorkflowTransition` : passage autorisé entre deux étapes ;
- `WorkflowStatus` : état courant du workflow ;
- `WorkflowGuard` : précondition ou règle bloquante ;
- `WorkflowSubjectRef` : référence vers l’objet ou l’action orchestré.

---

## Impact de maintenance / exploitation

Le domaine `workflow` a un impact d’exploitation moyen à élevé.

Raisons :

- il structure les processus multi-étapes sensibles ;
- ses erreurs créent blocages, incohérences d’avancement ou perte de lisibilité opératoire ;
- il se situe à la frontière entre plusieurs domaines ;
- il nécessite une forte explicabilité des transitions ;
- il interagit souvent avec approbation, audit, observabilité et parfois jobs.

En exploitation, une attention particulière doit être portée à :

- la cohérence des transitions ;
- les workflows bloqués ;
- les reprises manuelles ;
- la traçabilité des changements ;
- la cohérence avec les domaines source ;
- les effets de bord sur approbation, intégrations et pilotage opératoire.

Le domaine doit être considéré comme structurant dès qu’une orchestration explicite de processus existe réellement.

---

## Limites du domaine

Le domaine `workflow` s’arrête :

- avant les décisions d’approbation ;
- avant l’exécution asynchrone ;
- avant les domain events internes ;
- avant la vérité métier des domaines source ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `workflow` porte l’orchestration structurée des processus.
Il ne doit pas devenir un moteur applicatif opaque ni un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `workflow` et `approval` ;
- la frontière exacte entre `workflow` et `jobs` ;
- la frontière exacte entre `workflow` et `domain-events` ;
- la part exacte des reprises manuelles autorisées ;
- la gouvernance des définitions de workflow ;
- la hiérarchie entre vérité interne et orchestrateur externe éventuel.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `approval.md`
- `domain-events.md`
- `jobs.md`
- `audit.md`
- `observability.md`
- `dashboarding.md`
- `../core/stores.md`
- `../optional/events.md`
- `../core/documents.md`
- `../core/products.md`
- `../core/integrations.md`
