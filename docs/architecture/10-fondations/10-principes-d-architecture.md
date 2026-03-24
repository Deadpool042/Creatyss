# Principes d’architecture

## Objectif

Ce document définit les principes structurants de l’architecture.

Ces principes ne sont pas des préférences esthétiques.
Ils servent à protéger la cohérence du système dans la durée.

---

## Principe 1 — Le métier passe avant la technique

La structure du système doit être déterminée d’abord par les responsabilités métier, puis par les choix techniques.

Conséquences :

- un fournisseur externe ne définit pas un domaine ;
- une API tierce ne définit pas la vérité métier ;
- une contrainte technique locale ne doit pas redessiner le modèle central sans justification forte.

---

## Principe 2 — Le coeur doit rester identifiable

Le coeur métier doit être visible, stable et défendable.

Conséquences :

- les domaines coeur doivent être nommés explicitement ;
- ils ne doivent pas être noyés dans un ensemble de features ;
- leur responsabilité doit être indépendante des intégrations externes.

---

## Principe 3 — Les capacités optionnelles doivent rester bornées

Une capacité optionnelle enrichit le système, mais ne doit pas contaminer le coeur.

Conséquences :

- son activation doit être explicite ;
- ses effets doivent être prévisibles ;
- elle ne doit pas redéfinir silencieusement la vérité métier centrale ;
- son couplage au coeur doit rester minimal et lisible.

---

## Principe 4 — Les dépendances externes doivent être encapsulées

Toute dépendance externe doit être isolée derrière des adaptateurs ou des interfaces clairement identifiées.

Conséquences :

- le coeur métier ne dépend pas directement d’une API externe ;
- les formats externes sont traduits ;
- les erreurs externes sont normalisées ;
- le remplacement d’un fournisseur doit être concevable sans refonte du coeur.

---

## Principe 5 — La source de vérité doit être explicite

Toute donnée structurante doit avoir une source de vérité identifiable.

Conséquences :

- les conflits de responsabilité doivent être éliminés ;
- les synchronisations doivent être pensées comme des projections ou des échanges, pas comme des ambiguïtés de propriété ;
- une donnée ne doit pas flotter entre plusieurs autorités implicites.

---

## Principe 6 — Les événements expriment des faits, pas des intentions floues

Les événements de domaine servent à exprimer des faits métier significatifs.

Conséquences :

- ils doivent être nommés dans le langage métier ;
- ils doivent représenter quelque chose qui s’est produit ;
- ils ne doivent pas devenir un canal fourre-tout de transport technique.

---

## Principe 7 — Les préoccupations transverses doivent être traitées explicitement

L’audit, l’observabilité, la sécurité ou les jobs de fond ne doivent pas être dispersés de manière opportuniste.

Conséquences :

- leur rôle doit être documenté ;
- leur criticité doit être explicitée ;
- leur présence dans plusieurs zones du système doit être assumée, pas subie.

---

## Principe 8 — Les frontières doivent être compréhensibles

Une frontière architecturale utile est une frontière qu’un développeur peut expliquer simplement.

Conséquences :

- une responsabilité ne doit pas appartenir à deux blocs en même temps ;
- les flux doivent être traçables ;
- les points de traduction doivent être visibles ;
- les effets de bord doivent être localisables.

---

## Principe 9 — Le système doit rester testable par responsabilité

Un système testable est un système dont les responsabilités sont bien découpées.

Conséquences :

- les invariants doivent être testables ;
- les frontières doivent permettre des tests ciblés ;
- les capacités optionnelles doivent pouvoir être validées isolément ;
- les intégrations doivent pouvoir être simulées ou encapsulées.

---

## Principe 10 — La documentation doit refléter la structure réelle

La documentation ne doit pas être un décor.

Conséquences :

- une classification doit correspondre à la réalité du code et du modèle ;
- un document hybride doit être scindé ;
- la taxonomie documentaire doit être stable ;
- la documentation doit aider à prendre des décisions, pas seulement à décrire l’existant.

---

## Conséquences globales

Ces principes imposent :

- une taxonomie claire ;
- un découplage maîtrisé ;
- une modularité réelle ;
- une gouvernance documentaire stricte ;
- une cohérence entre architecture, domaines et tests.
