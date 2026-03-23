# Pricing and cost model

## Objectif

Ce document définit la grammaire de coût du socle.

Il ne remplace pas un devis détaillé.
Il sert à rendre le chiffrage plus cohérent, plus lisible et plus réutilisable.

L’objectif est de pouvoir relier clairement :

- le besoin client ;
- les capabilities activées ;
- le niveau retenu pour chaque capability ;
- le niveau de maintenance ;
- les providers branchés ;
- le coût initial ;
- le coût récurrent.

Le socle doit permettre un coût d’entrée agressif et maîtrisé, sans masquer le coût réel des complexités supplémentaires.

---

## Principe directeur

Un projet n’est jamais tarifé comme un bloc opaque.

Le coût d’un projet est la combinaison de plusieurs axes :

1. le noyau structurel commun ;
2. les capabilities activées ;
3. le niveau de sophistication de chaque capability ;
4. les connecteurs provider-specific ;
5. le niveau de maintenance et d’exploitation ;
6. le niveau de risque, de conformité et de support attendu.

Le socle rend cette composition plus lisible.
Il ne prétend pas rendre toute complexité gratuite.

---

## Les grands axes de coût

---

## 1. Coût du socle de base

Le socle de base couvre :

- la structure coeur du projet ;
- la sécurité minimale sérieuse ;
- la cohérence transactionnelle ;
- l’auth ;
- l’observability minimale ;
- l’audit minimal ;
- le lifecycle des objets critiques ;
- l’exploitabilité minimale ;
- la discipline technique nécessaire à une production sérieuse.

Ce coût existe toujours.
Il ne doit pas être confondu avec “une feature optionnelle”.

Le ticket d’entrée agressif du socle consiste à **mutualiser intelligemment ce coeur**, pas à le supprimer.

---

## 2. Coût des capabilities

Chaque capability ajoutée a un coût propre.

Ce coût dépend de :

- sa complexité métier ;
- ses dépendances ;
- ses validations ;
- ses flux critiques ;
- ses impacts UI / API / admin ;
- ses effets sur les tests ;
- ses impacts sur l’exploitation.

Le coût capability doit être lisible.

---

## 3. Coût du niveau d’une capability

Une même capability peut exister à plusieurs niveaux.

Exemple :

- taxation simple ;
- taxation multi-pays ;
- taxation multi-zone ;
- taxation avec accises.

Le niveau change :

- la profondeur du périmètre ;
- la quantité de règles ;
- la volumétrie de cas ;
- les dépendances ;
- la maintenance ;
- le risque.

Le niveau fait donc monter le coût.

---

## 4. Coût des providers et intégrations

Chaque provider externe ajoute une charge spécifique :

- setup ;
- mapping ;
- sécurité ;
- observability ;
- retry ;
- maintenance ;
- évolution ;
- support ;
- risque de dépendance externe.

Un provider supplémentaire n’est jamais neutre, même si le domaine coeur existe déjà.

---

## 5. Coût de maintenance et d’exploitation

Le coût d’un projet ne s’arrête pas au build initial.

Le niveau de maintenance influence :

- supervision ;
- patching ;
- reprise ;
- support ;
- suivi d’incidents ;
- surveillance des intégrations ;
- discipline de release ;
- coût mensuel.

Un projet peut avoir :

- un build simple mais une maintenance plus exigeante ;
- ou un build plus riche avec une maintenance raisonnablement contenue.

Le coût récurrent doit être pensé comme un axe autonome.

---

## 6. Coût de risque / conformité

Certaines capabilities augmentent fortement le coût structurel parce qu’elles augmentent :

- le risque métier ;
- le risque d’erreur ;
- le risque réglementaire ;
- le risque de support ;
- la charge de diagnostic ;
- le besoin de contrôle.

Exemples :

- accises ;
- BNPL ;
- multi-provider payments ;
- documents réglementés ;
- plusieurs zones fiscales ;
- ERP ou comptabilité critiques ;
- IA branchée à des flux sensibles.

---

## Grammaire officielle du chiffrage

Chaque projet est évalué selon les dimensions suivantes.

### A. Coeur commun

Ce qui est présent dans tous les projets sérieux.

### B. Capabilities activées

Les options réellement retenues.

### C. Niveau des capabilities

Le niveau minimal suffisant.

### D. Providers activés

Les connecteurs externes branchés.

### E. Maintenance retenue

Le niveau M1 à M4.

### F. Contexte de risque

Les contraintes réglementaires, fiscales, de support ou d’exploitation.

---

## Classes de coût relatives

Le socle utilise une lecture relative du coût pour faciliter le cadrage.

### C1 — faible

Peu de règles, peu de dépendances, faible exposition.

### C2 — modéré

Plusieurs cas usuels, complexité raisonnable, coût encore contenu.

### C3 — élevé

Logique transverse, plusieurs dépendances, plus d’intégrations, plus de tests, plus d’exploitation.

### C4 — fort

Conformité, orchestration avancée, plusieurs providers, criticité forte, maintenance plus lourde.

Ces classes ne remplacent pas le devis.
Elles aident à qualifier la charge relative.

---

## Structure type d’un coût projet

Le coût d’un projet peut être lu comme :

### 1. Base socle

Le noyau structurel réutilisé.

### 2. Bloc coeur métier

Ce qui rend le projet capable d’opérer un commerce sérieux.

### 3. Blocs capability

Ce qui est activé en plus ou à un niveau plus élevé.

### 4. Blocs providers

Ce qui branche les systèmes externes utiles.

### 5. Bloc maintenance

Le niveau d’exploitation choisi.

### 6. Bloc risque / conformité

Le supplément imposé par les contextes plus sensibles.

Cette lecture est plus saine qu’un devis “one-shot” sans structure.

---

## Comment une capability fait monter le coût

Une capability fait monter le coût selon plusieurs leviers.

### 1. Périmètre fonctionnel

Plus d’écrans, plus de cas, plus de validations.

### 2. Complexité métier

Plus de règles, plus de transitions, plus d’invariants.

### 3. Complexité technique

Plus de flux, plus de dépendances, plus de connecteurs, plus de tests.

### 4. Complexité d’exploitation

Plus de monitoring, plus de support, plus de diagnostic, plus de reprise.

### 5. Complexité de risque

Plus de sensibilité métier, plus d’impact d’erreur, plus de conformité.

---

## Comment le niveau fait monter le coût

Passer d’un niveau à un autre ne signifie pas seulement “plus de temps de dev”.
Cela signifie aussi :

- plus de cas limites ;
- plus de règles métier ;
- plus de documentation ;
- plus de tests ;
- plus de maintenance ;
- plus de support ;
- plus de run potentiel ;
- plus de dette si le niveau est activé sans réel besoin.

Le niveau doit donc être choisi avec discipline.

---

## Comment la maintenance fait monter le coût

Le niveau de maintenance augmente le coût récurrent, mais réduit généralement :

- le coût d’incident ;
- le coût de reprise ;
- le coût de surprise ;
- le coût de dette accumulée ;
- le coût de désordre opérationnel.

Le bon arbitrage n’est donc pas simplement :
“prendre la maintenance la moins chère”.

Le bon arbitrage est :
“prendre le niveau minimal compatible avec le risque réel du projet”.

---

## Coût et réutilisabilité

La réutilisabilité du socle permet de réduire le coût initial en mutualisant :

- la structure ;
- la sécurité de base ;
- les conventions ;
- les patterns de cohérence ;
- les frontières d’intégration ;
- la logique de documentation ;
- la discipline technique.

Mais elle ne supprime pas le coût de :

- la sophistication métier ;
- la conformité ;
- la multiplicité des providers ;
- l’exploitation ;
- le support ;
- les cas spécifiques d’un client.

Le socle permet un coût plus agressif.
Il ne transforme pas une complexité forte en coût artificiellement faible.

---

## Exemples de lecture

---

## Exemple 1 — projet simple premium local

### Profil

Commerce simple maîtrisé.

### Capabilities

- catalogue simple ;
- variantes si nécessaire ;
- panier standard ;
- checkout simple ;
- paiement carte mono-provider ;
- contenu éditorial.

### Coût relatif

- base socle : incompressible ;
- capabilities : C1 à C2 ;
- maintenance : M1 ou M2 ;
- coût initial maîtrisé ;
- coût récurrent contenu.

---

## Exemple 2 — Creatyss

### Profil

Commerce premium simple à standard.

### Capabilities

- produits ;
- variantes ;
- guest cart ;
- guest checkout ;
- paiement simple ;
- blog ;
- homepage éditoriale ;
- taxation simple.

### Niveau

Principalement niveau 1 à 2.

### Maintenance

M1 ou M2.

### Lecture économique

Creatyss doit bénéficier :

- d’un coût d’entrée agressif ;
- d’une base sérieuse ;
- d’une architecture prête à accueillir plus tard d’autres niveaux ;
- sans payer dès maintenant accises, BNPL, ERP ou fiscalité avancée.

---

## Exemple 3 — projet UE + plusieurs paiements

### Profil

Commerce standard évolutif ou avancé.

### Capabilities

- taxation UE plus riche ;
- plusieurs moyens de paiement ;
- plusieurs providers ;
- analytics et relances plus riches.

### Coût relatif

- capabilities plus nombreuses : C2 à C3 ;
- providers supplémentaires ;
- maintenance plutôt M2.

### Lecture économique

Le coût monte de manière lisible parce que la sophistication monte réellement.

---

## Exemple 4 — projet avec accises et plusieurs contraintes

### Profil

Commerce expert / réglementé.

### Capabilities

- multi-zone ;
- accises ;
- paiements plus complexes ;
- documents avancés ;
- intégrations plus sensibles.

### Coût relatif

- plusieurs capabilities C3 à C4 ;
- maintenance M3 ou M4 ;
- coût de conformité et de support plus élevé.

### Lecture économique

Le coût élevé est justifié par la nature réelle du projet, pas par une inflation arbitraire.

---

## Règles commerciales de construction d’une offre

### Règle 1

Le coût d’entrée doit être bas autant que possible, mais jamais au prix du coeur structurel.

### Règle 2

Le client ne paie pas une sophistication qu’il n’utilise pas.

### Règle 3

Une montée de niveau ultérieure doit être possible sans refonte.

### Règle 4

Le devis doit distinguer :

- base ;
- options activées ;
- niveaux ;
- providers ;
- maintenance.

### Règle 5

Le coût récurrent doit être expliqué aussi clairement que le coût initial.

### Règle 6

Le support et la maintenance ne sont pas traités comme un après-coup.
Ils font partie de la proposition de valeur.

---

## Ce qu’un client achète réellement

Le client n’achète pas seulement :

- un site ;
- des pages ;
- un front ;
- un admin ;
- quelques connecteurs.

Il achète aussi :

- un niveau de robustesse ;
- un niveau de cohérence ;
- un niveau de sécurité ;
- un niveau de supportabilité ;
- un niveau d’évolution possible ;
- un niveau de maintenance soutenable.

Le modèle de coût du socle doit donc refléter cette réalité.

---

## Ce que le modèle de coût doit éviter

Le modèle doit éviter :

- un prix arbitraire déconnecté de la structure ;
- un projet simple vendu comme complexe par défaut ;
- une capability avancée “offerte” sans maintenance cohérente ;
- un coût de maintenance caché ;
- un chiffrage qui ne distingue pas le coeur du variable ;
- un devis qui ne permet pas au client de comprendre ce qui fait monter le coût.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- le coût d’un projet est la combinaison du coeur, des capabilities, des niveaux, des providers et de la maintenance ;
- le socle mutualise le coeur mais n’efface pas le coût réel de la sophistication ;
- le coût d’entrée agressif ne doit pas dégrader la robustesse ;
- chaque capability et chaque niveau doivent rester lisibles dans le chiffrage ;
- la maintenance fait partie intégrante du modèle économique ;
- le socle doit rendre la proposition commerciale plus claire, plus progressive et plus maîtrisée.
