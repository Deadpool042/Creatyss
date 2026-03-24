# Frontières et responsabilités

## Objectif

Ce document définit les frontières architecturales du système et les règles de responsabilité associées.

Une frontière utile doit empêcher le couplage implicite et clarifier ce qui appartient à quoi.

---

## Règle 1 — Une responsabilité principale appartient à un seul bloc

Une responsabilité architecturale ne doit pas être portée simultanément par plusieurs blocs sans règle explicite.

Conséquences :

- une source de vérité doit être identifiable ;
- un invariant doit avoir un lieu naturel d’expression ;
- une décision métier ne doit pas flotter entre plusieurs modules.

---

## Règle 2 — Le coeur ne dépend pas directement des fournisseurs

Les domaines coeur ne doivent pas dépendre directement :

- d’une API tierce ;
- d’un SDK externe ;
- d’un format imposé par un fournisseur ;
- d’une nomenclature étrangère au langage métier.

Les dépendances externes doivent être traduites et encapsulées.

---

## Règle 3 — Une capacité optionnelle se branche sans coloniser le coeur

Une capacité optionnelle peut enrichir le comportement du système, mais elle ne doit pas dissoudre les frontières du coeur.

Elle doit :

- déclarer son point d’ancrage ;
- expliciter ses effets ;
- éviter les effets globaux implicites ;
- rester compréhensible lorsqu’elle est absente.

---

## Règle 4 — Les flux entre blocs doivent être traçables

Tout échange significatif entre blocs doit pouvoir être expliqué.

Cela inclut :

- l’entrée ;
- la transformation ;
- la décision ;
- la sortie ;
- les effets secondaires.

Un flux non traçable est un signal de dette architecturale.

---

## Règle 5 — Les préoccupations transverses ne doivent pas devenir du bruit structurel

Une préoccupation transverse doit être présente de manière intentionnelle.

Elle ne doit pas se manifester sous forme de logique copiée partout sans gouvernance.

Exemples de mauvais signaux :

- journalisation ad hoc sans convention ;
- audit présent seulement sur certains flux sans justification ;
- logique de retry dispersée ;
- sécurité implicite et non documentée.

---

## Règle 6 — Les adaptateurs traduisent ; ils ne décident pas du métier

Un adaptateur a pour rôle :

- d’isoler ;
- de traduire ;
- de normaliser ;
- de protéger le coeur.

Un adaptateur ne doit pas :

- porter l’invariant métier principal ;
- devenir l’arbitre de la vérité interne ;
- imposer un modèle conceptuel externe au coeur.

---

## Frontières structurantes du système

### Frontière A — Coeur métier / capacités optionnelles

Cette frontière sépare le modèle indispensable du modèle activable.

Question clé :
la responsabilité existe-t-elle même lorsque l’option n’est pas activée ?

### Frontière B — Interne / externe

Cette frontière sépare la logique propre du système de ses dépendances.

Question clé :
le système garde-t-il son vocabulaire et sa cohérence si le fournisseur change ?

### Frontière C — Domaine local / préoccupation transverse

Cette frontière sépare ce qui appartient à un domaine donné de ce qui traverse plusieurs zones.

Question clé :
la responsabilité peut-elle être portée proprement par un seul domaine ?

---

## Conséquences sur le code et la documentation

Ces frontières doivent se refléter :

- dans la structure documentaire ;
- dans la structure des modules ;
- dans les interfaces ;
- dans les contrats ;
- dans les tests ;
- dans les décisions de nommage.

Une frontière qui n’existe que dans la documentation est insuffisante.
Une frontière qui n’existe que dans le code est fragile.
