# Scheduling

## Rôle

Le domaine `scheduling` porte la planification métier temporelle du système.

Il définit :

- ce qu’est une planification du point de vue du système ;
- comment sont structurées les dates d’effet, fenêtres temporelles, occurrences, activations différées et échéances métier ;
- comment ce domaine se distingue de l’exécution asynchrone, des workflows, des événements publics et des intégrations providers externes ;
- comment le système reste maître de sa vérité interne sur les intentions temporelles métier.

Le domaine existe pour fournir une représentation explicite de la temporalité métier, distincte :

- de l’exécution asynchrone portée par `jobs` ;
- de l’orchestration de processus portée par `workflow` ;
- des événements publics portés par `events` ;
- des publications sociales portées par `social` ;
- des campagnes newsletter portées par `newsletter` ;
- des DTO providers externes portés par `integrations`.

---

## Classification

### Catégorie documentaire

`cross-cutting`

### Criticité architecturale

`transverse structurant`

### Activable

`non`

Le domaine `scheduling` est structurel dès lors qu’une sémantique temporelle métier gouvernée existe dans le système.

---

## Source de vérité

Le domaine `scheduling` est la source de vérité pour :

- les planifications métier structurées ;
- les dates d’activation ou de désactivation différées ;
- les fenêtres temporelles d’exposition ou de validité ;
- les occurrences ou échéances planifiées ;
- les statuts temporels des objets planifiés lorsqu’ils sont portés ici ;
- ses lectures structurées consommables par les domaines autorisés.

Le domaine `scheduling` n’est pas la source de vérité pour :

- l’exécution asynchrone, qui relève de `jobs` ;
- l’orchestration complète des processus, qui relève de `workflow` ;
- les événements publics métier, qui relèvent de `events` ;
- les publications sociales elles-mêmes, qui relèvent de `social` ;
- les campagnes newsletter elles-mêmes, qui relèvent de `newsletter` ;
- les DTO providers externes.

Une planification est une intention temporelle métier gouvernée.
Elle ne doit pas être confondue avec :

- un job ;
- un cron technique ;
- un workflow ;
- un événement public ;
- une campagne elle-même ;
- un calendrier universel sans langage métier.

---

## Responsabilités

Le domaine `scheduling` est responsable de :

- définir ce qu’est une planification dans le système ;
- porter les planifications métier structurées ;
- porter les fenêtres temporelles d’activation, d’exposition ou de validité ;
- porter les occurrences ou dates d’effet ;
- exposer une lecture gouvernée de ce qui est actif, à venir, expiré ou inactif ;
- publier les événements significatifs liés à la vie d’une planification ;
- protéger le système contre les sémantiques temporelles implicites, opaques ou contradictoires.

Selon le périmètre exact du projet, le domaine peut également être responsable de :

- activations différées de campagnes ;
- ouvertures ou fermetures temporelles ;
- planifications newsletter ;
- planifications sociales ;
- fenêtres d’exposition événementielle ;
- échéances métiers ;
- règles locales par boutique ou fuseau ;
- replanifications et déprogrammations.

---

## Non-responsabilités

Le domaine `scheduling` n’est pas responsable de :

- porter l’exécution asynchrone ;
- porter l’orchestration complète des processus ;
- porter les événements publics métier ;
- porter les publications sociales elles-mêmes ;
- porter les campagnes newsletter elles-mêmes ;
- exécuter les intégrations provider-specific ;
- devenir un simple cron technique ou un moteur de file d’attente masqué ;
- devenir un calendrier universel sans langage métier explicite.

Le domaine `scheduling` ne doit pas devenir :

- un doublon de `jobs` ;
- un doublon de `workflow` ;
- un doublon de `events` ;
- un conteneur flou de dates et occurrences sans gouvernance métier.

---

## Invariants

Les invariants minimaux sont les suivants :

- une planification possède un identifiant stable et un statut explicite ;
- une occurrence ou une fenêtre est rattachée à un sujet explicite ;
- `scheduling` ne se confond pas avec `jobs` ;
- `scheduling` ne se confond pas avec `workflow` ;
- `scheduling` ne se confond pas avec `events` ;
- les autres domaines ne doivent pas recréer librement leur propre vérité divergente de planification métier quand le cadre commun `scheduling` existe ;
- une action ne devient temporellement exécutable que si ses règles de fenêtre, de date d’effet et de contexte sont satisfaites ;
- une planification annulée ou expirée ne doit pas être traitée comme active sans règle explicite.

Le domaine protège la cohérence de la temporalité métier, pas l’exécution effective des traitements.

---

## Dépendances

### Dépendances métier

Le domaine `scheduling` interagit fortement avec :

- `stores`
- `marketing`
- `newsletter`
- `social`
- `events`
- `workflow`
- `jobs`

### Dépendances transverses

Le domaine dépend également de :

- `audit`
- `observability`
- `dashboarding`

### Dépendances externes

Le domaine peut être relié indirectement à :

- calendriers externes ;
- orchestrateurs temporels ;
- systèmes de diffusion différée ;
- autres systèmes via `integrations`.

### Règle de frontière

Le domaine `scheduling` porte l’intention temporelle métier.
Il ne doit pas absorber :

- l’exécution asynchrone ;
- les workflows ;
- les événements publics ;
- les campagnes ou publications elles-mêmes ;
- ni les DTO providers externes.

---

## Événements significatifs

Le domaine `scheduling` publie ou peut publier des événements significatifs tels que :

- planification créée ;
- planification mise à jour ;
- planification annulée ;
- fenêtre temporelle ouverte ;
- fenêtre temporelle fermée ;
- occurrence atteinte ;
- statut de planification modifié.

Le domaine peut consommer des signaux liés à :

- campagne marketing créée ;
- campagne newsletter créée ;
- publication sociale créée ;
- événement créé ;
- workflow démarré ;
- capability boutique modifiée ;
- action administrative structurée de planification ou replanification.

Les noms exacts doivent rester dans le langage interne du système.

---

## Cycle de vie

Le domaine `scheduling` possède un cycle de vie explicite.

Le cycle exact dépend du projet, mais il doit au minimum distinguer :

- planifié ;
- actif ;
- à venir ;
- expiré ;
- annulé.

Des états supplémentaires peuvent exister :

- brouillon ;
- suspendu ;
- archivé ;
- en attente ;
- restreint.

Le domaine doit éviter :

- les planifications “fantômes” ;
- les changements silencieux de date d’effet ;
- les états purement techniques non interprétables métier.

---

## Interfaces et échanges

Le domaine `scheduling` expose principalement :

- des planifications structurées ;
- des fenêtres temporelles explicites ;
- des occurrences ou échéances ;
- des lectures exploitables par `jobs`, `workflow`, `marketing`, `newsletter`, `social`, `events`, `dashboarding` et certaines couches d’administration ;
- des signaux logiques indiquant qu’un objet devient actif, expiré, planifié ou non encore exécutable.

Le domaine reçoit principalement :

- des demandes de planification ou déplanification d’une action métier ;
- des demandes de lecture de l’état temporel d’un objet ou d’une campagne ;
- des changements de fenêtre de validité ou de date d’effet ;
- des contextes boutique, fuseau, scope, acteur et calendrier utiles à l’interprétation ;
- des demandes d’évaluation de ce qui est actif, à venir, expiré ou hors fenêtre.

Le domaine ne doit pas exposer un contrat canonique dicté par un provider externe.

---

## Contraintes d’intégration

Le domaine `scheduling` peut être exposé à des contraintes telles que :

- fuseaux multiples ;
- multi-boutiques ;
- fenêtres d’exposition ;
- activations différées ;
- replanifications ;
- dépendance à des capabilities activables ;
- exécution via jobs ;
- projection vers systèmes externes ;
- rétrocompatibilité des règles temporelles.

Règles minimales :

- la hiérarchie d’autorité doit être explicite ;
- la vérité de la planification reste dans `scheduling` ;
- les DTO providers restent dans `integrations` ;
- les traitements rejouables doivent être idempotents ou neutralisés ;
- une planification incohérente ne doit pas être promue silencieusement ;
- les conflits entre fenêtre, date d’effet, fuseau, capability et sujet planifié doivent être explicables.

---

## Données sensibles / sécurité

Le domaine `scheduling` manipule des informations de calendrier, de fenêtres d’activation et parfois de diffusion sensible.

Points de vigilance :

- contrôle strict des droits de lecture et d’écriture ;
- séparation claire entre intention temporelle et exécution effective ;
- protection des modifications sensibles de dates, fenêtres et occurrences ;
- prise en compte explicite du fuseau et du contexte boutique ;
- audit des replanifications et changements sensibles.

---

## Observabilité et audit

Le domaine `scheduling` doit rendre visibles au minimum :

- quelle planification est en vigueur ;
- quelle fenêtre temporelle s’applique ;
- pourquoi un objet est actif, à venir, expiré ou inactif ;
- quel changement a modifié la date d’effet ;
- si une activation n’a pas eu lieu à cause d’une fenêtre non ouverte, d’une capability inactive ou d’une autre règle métier.

L’audit doit permettre de répondre à des questions comme :

- quelle planification a été créée, modifiée, replanifiée ou annulée ;
- quand ;
- selon quelle origine ;
- avec quelle fenêtre ou occurrence affectée ;
- avec quelle action manuelle significative ;
- avec quel impact sur le sujet planifié.

L’observabilité doit distinguer :

- erreur de modèle ;
- erreur technique ;
- fenêtre incohérente ;
- occurrence invalide ;
- fuseau incohérent ;
- action non autorisée ;
- exposition interdite d’un détail sensible.

---

## Modèle de données conceptuel

Les principaux objets métier conceptuels du domaine sont :

- `SchedulePlan` : planification métier structurée ;
- `ScheduleWindow` : fenêtre temporelle d’activation ou de validité ;
- `ScheduleOccurrence` : occurrence ou date d’effet planifiée ;
- `ScheduleStatus` : état temporel courant de la planification ;
- `SchedulePolicy` : règle d’interprétation temporelle ;
- `ScheduleSubjectRef` : référence vers l’objet ou l’action planifié.

---

## Impact de maintenance / exploitation

Le domaine `scheduling` a un impact d’exploitation moyen à élevé.

Raisons :

- il gouverne l’activation temporelle d’objets sensibles ;
- ses erreurs dégradent cohérence, diffusion et exécution des intentions métier ;
- il se situe à la frontière entre plusieurs domaines consommateurs ;
- il nécessite une forte explicabilité des dates d’effet et fenêtres ;
- il dépend souvent de fuseaux, contexts boutique et capabilities.

En exploitation, une attention particulière doit être portée à :

- la cohérence des fenêtres ;
- la qualité des occurrences ;
- la traçabilité des replanifications ;
- la cohérence avec jobs, workflow et domaines source ;
- les effets de bord sur marketing, newsletter, social et événements ;
- les déprogrammations ou expirations sensibles.

Le domaine doit être considéré comme structurant dès qu’une temporalité métier gouvernée réelle existe.

---

## Limites du domaine

Le domaine `scheduling` s’arrête :

- avant l’exécution asynchrone ;
- avant l’orchestration de processus ;
- avant les événements publics ;
- avant les campagnes ou publications elles-mêmes ;
- avant les intégrations externes ;
- avant les DTO providers externes.

Le domaine `scheduling` porte la planification temporelle métier du système.
Il ne doit pas devenir un cron technique, un orchestrateur d’exécution ou un doublon des domaines source.

---

## Questions ouvertes

À confirmer explicitement dans le projet :

- la frontière exacte entre `scheduling` et `jobs` ;
- la frontière exacte entre `scheduling` et `workflow` ;
- la part exacte des fuseaux et calendriers réellement supportés ;
- la gouvernance des replanifications ;
- la hiérarchie entre vérité interne et orchestrateurs temporels externes éventuels ;
- la place exacte des planifications récurrentes dans le modèle courant.

Si ces points sont déjà tranchés ailleurs, ils doivent être réinjectés ici et sortir de cette section.

---

## Documents liés

- `../../architecture/10-fondations/11-modele-de-classification.md`
- `../../architecture/10-fondations/12-frontieres-et-responsabilites.md`
- `jobs.md`
- `workflow.md`
- `events.md`
- `marketing.md`
- `newsletter.md`
- `social.md`
- `dashboarding.md`
- `audit.md`
- `observability.md`
- `../core/foundation/stores.md`
- `../optional/platform/integrations.md`
