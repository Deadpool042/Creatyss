# Niveaux de maintenance et d’exploitation

## Objectif

Ce document définit les niveaux de maintenance technique et d’exploitation du socle.

Le niveau fonctionnel d’un projet ne suffit pas à qualifier son coût réel.
Un même périmètre métier peut exiger :

- peu de maintenance ;
- une maintenance structurée ;
- une maintenance avancée ;
- ou une exploitation quasi critique.

Le socle doit donc qualifier explicitement :

- la maintenance ;
- l’exploitation ;
- le support ;
- la surveillance ;
- la mise à jour ;
- la reprise.

---

## Principe directeur

Le niveau de maintenance est un axe distinct du niveau fonctionnel.

Deux projets peuvent partager les mêmes capabilities métier et pourtant exiger des niveaux de maintenance très différents.

Exemples :

- petite boutique locale à faible trafic ;
- boutique simple mais critique pour le chiffre d’affaires ;
- boutique multi-pays avec obligations plus fortes ;
- projet avec plusieurs connecteurs externes sensibles.

Le niveau de maintenance n’est donc jamais déduit uniquement du périmètre visible.
Il est choisi explicitement.

---

## Ce qui reste non négociable

Même au niveau le plus économique réellement exploitable, le socle impose :

- gestion correcte des secrets ;
- isolation des environnements ;
- sauvegardes minimales ;
- restauration possible ;
- mises à jour de sécurité ;
- audit des mutations critiques ;
- observability minimale ;
- cohérence transactionnelle ;
- lifecycle des données ;
- documentation minimale d’exploitation.

Un “bas niveau” ne signifie jamais “site fragile”.

---

## Échelle des niveaux de maintenance

### Niveau M0 — prototype / exploration

Usage interne, démonstrateur, expérimentation, pré-cadrage.

Caractéristiques :

- pas destiné à la production durable ;
- faible formalisation opératoire ;
- pas de promesse de continuité ;
- peut servir de pré-version, maquette, POC ou lot de découverte.

Ce niveau n’est pas une cible de production pérenne.

### Niveau M1 — exploitation essentielle

Niveau minimal pour une mise en production sérieuse à coût maîtrisé.

Caractéristiques :

- sécurité de base maîtrisée ;
- sauvegardes simples mais fiables ;
- monitoring minimal ;
- mises à jour cadrées ;
- incidents gérés de façon pragmatique ;
- documentation d’exploitation courte mais suffisante.

Objectif :

- permettre un lancement propre ;
- garder un coût récurrent bas ;
- éviter les zones dangereuses.

### Niveau M2 — exploitation standard

Niveau recommandé pour un commerce exploité régulièrement.

Caractéristiques :

- maintenance planifiée ;
- observability plus riche ;
- procédures de reprise mieux formalisées ;
- tests de restauration plus sérieux ;
- supervision et diagnostics plus confortables ;
- meilleure maîtrise des dépendances et des intégrations.

Objectif :

- réduire le risque opérationnel ;
- améliorer le support ;
- absorber les évolutions plus sereinement.

### Niveau M3 — exploitation avancée

Niveau adapté aux projets à forte exposition métier ou à complexité technique significative.

Caractéristiques :

- supervision structurée ;
- politique de mises à jour plus rigoureuse ;
- reprise opératoire documentée ;
- alerting plus précis ;
- meilleure maîtrise de la performance ;
- revue régulière des intégrations, incidents et points de fragilité.

Objectif :

- sécuriser un commerce plus exigeant ;
- réduire les incidents longs ;
- accélérer le diagnostic et la reprise.

### Niveau M4 — exploitation critique / réglementée

Niveau réservé aux projets les plus sensibles.

Caractéristiques :

- gouvernance forte ;
- exigences élevées de conformité, traçabilité, disponibilité, auditabilité et contrôle ;
- discipline d’exploitation renforcée ;
- niveaux de contrôle supérieurs sur sécurité, intégrations, changements et reprise.

Objectif :

- tenir des contextes complexes ou fortement exposés ;
- encadrer durablement le risque technique et métier.

---

## Axes couverts par la maintenance

Le niveau de maintenance doit être évalué sur tous les axes suivants.

### 1. Sécurité opérationnelle

Inclut :

- gestion des secrets ;
- rotation / révocation si nécessaire ;
- revue des accès ;
- patching de sécurité ;
- exposition réseau maîtrisée ;
- revue des points d’entrée sensibles.

### 2. Sauvegarde et restauration

Inclut :

- fréquence des backups ;
- périmètre sauvegardé ;
- politique de rétention ;
- capacité réelle de restauration ;
- test de restauration.

### 3. Mises à jour et dépendances

Inclut :

- mises à jour runtime ;
- dépendances applicatives ;
- dépendances d’intégration ;
- images Docker / OS / base ;
- arbitrage entre stabilité et fraîcheur.

### 4. Observability

Inclut :

- logs utiles ;
- healthchecks ;
- métriques ;
- visibilité sur jobs ;
- visibilité sur erreurs d’intégration ;
- visibilité sur webhooks, paiements et traitements critiques.

### 5. Gestion d’incident

Inclut :

- diagnostic ;
- classification ;
- correction ;
- reprise ;
- communication ;
- réduction du temps de rétablissement.

### 6. Performance et capacité

Inclut :

- temps de réponse ;
- surveillance des points chauds ;
- contention DB ;
- volume des jobs ;
- impact des intégrations ;
- évolution du trafic.

### 7. Lifecycle technique

Inclut :

- archivage ;
- purge ;
- conservation ;
- évolution de schéma ;
- dépréciation de features ;
- fin de vie d’intégrations.

### 8. Exploitabilité

Inclut :

- runbooks ;
- commandes utiles ;
- procédures de relance ;
- procédures de reprise ;
- lisibilité de la configuration ;
- accessibilité du diagnostic pour l’opérateur.

### 9. Qualité de livraison

Inclut :

- build fiable ;
- checks de type ;
- tests ;
- procédure de release ;
- rollback ou stratégie de correction ;
- discipline de changement.

---

## Description par niveau

## M1 — exploitation essentielle

Le niveau M1 couvre obligatoirement :

- secrets hors dépôt ;
- environnement de prod distinct ;
- sauvegarde régulière ;
- possibilité de restauration ;
- patching de sécurité planifié ;
- monitoring minimal ;
- logs exploitables ;
- healthchecks ;
- documentation courte d’exploitation ;
- procédure de redémarrage / reprise simple ;
- revue minimale des dépendances.

Le niveau M1 vise :

- lancement propre ;
- budget récurrent bas ;
- socle sain ;
- charge opératoire raisonnable.

## M2 — exploitation standard

Le niveau M2 ajoute :

- supervision plus structurée ;
- meilleure visibilité sur les jobs, intégrations et erreurs métier ;
- procédure de restauration testée ;
- revue plus régulière des dépendances ;
- meilleure discipline de release ;
- surveillance des performances principales ;
- documentation opératoire enrichie ;
- analyse d’incidents plus structurée.

Le niveau M2 est recommandé dès qu’un projet dépend réellement de son e-commerce pour son activité.

## M3 — exploitation avancée

Le niveau M3 ajoute :

- alerting plus précis ;
- pilotage plus fin de la performance ;
- surveillance renforcée des domaines critiques ;
- gestion plus formalisée des incidents ;
- meilleures garanties de reprise ;
- revues techniques plus régulières ;
- runbooks plus complets ;
- maîtrise plus forte des risques liés aux providers et intégrations.

Le niveau M3 est adapté aux projets plus exposés, plus intégrés, plus réglementés ou plus rentables.

## M4 — exploitation critique / réglementée

Le niveau M4 ajoute :

- gouvernance et contrôle renforcés ;
- exigences plus fortes de traçabilité et de conformité ;
- discipline accrue sur changements, incidents, accès et intégrations ;
- contrôle plus rigoureux des impacts métier et réglementaires.

Le niveau M4 ne doit être retenu que lorsqu’il existe un besoin réel.
Il ne constitue pas le niveau par défaut du socle.

---

## Relation entre maintenance et coût

Le niveau de maintenance impacte directement :

- le coût mensuel ;
- le coût de support ;
- la vitesse de diagnostic ;
- la vitesse de reprise ;
- le niveau de risque accepté ;
- la stabilité des évolutions.

Un coût initial agressif n’implique pas une maintenance haute.
Mais il n’autorise jamais une maintenance dangereuse.

Le bon modèle économique du socle consiste à :

- garder le build initial ciblé ;
- choisir le niveau minimal de maintenance compatible avec le risque réel ;
- augmenter le niveau quand le projet ou l’exposition grandit.

---

## Relation entre maintenance et capabilities

Certaines capabilities peuvent exiger un niveau minimal de maintenance.

Exemples :

### M1 minimum compatible

- catalogue simple
- panier standard
- checkout simple
- paiement simple mono-provider
- contenu éditorial simple

### M2 minimum recommandé

- multi-provider payments
- abandoned cart relaunch
- plusieurs intégrations métiers
- multi-pays UE
- analytics enrichie
- automation métier simple

### M3 minimum recommandé

- accises
- fiscalité multi-zone riche
- paiements fractionnés / BNPL
- orchestration plus dense d’intégrations
- obligations documentaires fortes
- exploitation fortement dépendante du e-commerce

### M4

- contextes réglementés ou particulièrement critiques
- exposition forte, audit renforcé, exigences de contrôle supérieures

---

## Maintenance et réutilisabilité

Le modèle par niveaux de maintenance rend le socle plus réutilisable car il permet :

- de ne pas sur-vendre la technique à un petit projet ;
- de ne pas sous-protéger un projet plus sensible ;
- de garder la même architecture de base ;
- de changer de niveau sans refaire le coeur.

L’objectif n’est pas d’avoir une architecture différente par client.
L’objectif est d’avoir :

- un même socle ;
- des capabilities différentes ;
- des niveaux fonctionnels différents ;
- des niveaux de maintenance différents.

---

## Règles de décision

### Règle 1

Le niveau M1 est le minimum de production sérieuse.

### Règle 2

Une capability avancée peut imposer un niveau minimal supérieur.

### Règle 3

Le niveau de maintenance est choisi selon le risque, pas uniquement selon le budget.

### Règle 4

Le niveau de maintenance doit rester compréhensible côté client.

### Règle 5

Le niveau choisi doit être compatible avec une montée progressive du projet.

---

## Ce qu’un client achète réellement

Quand un client choisit un projet, il n’achète pas seulement :

- des pages ;
- des features ;
- des connecteurs.

Il achète aussi :

- un niveau de sécurité ;
- un niveau de fiabilité ;
- un niveau de suivi ;
- un niveau de capacité d’évolution ;
- un niveau de reprise en cas de problème.

La maintenance fait donc partie intégrante de la proposition de valeur du socle.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- la maintenance est un axe distinct des features métier ;
- le socle est exploitable dès le niveau M1 ;
- M0 n’est pas une cible de production durable ;
- certaines capabilities imposent un niveau minimal de maintenance ;
- le coût d’entrée maîtrisé ne doit pas dégrader la robustesse ;
- la réutilisabilité du socle passe aussi par des niveaux de maintenance lisibles.
