# Glossaire

## Objectif

Ce glossaire définit le vocabulaire architectural de référence.

Les termes définis ici doivent être utilisés de manière cohérente dans tout le dossier `docs/architecture/`.

---

## Domaine

Un domaine est un bloc métier cohérent portant une responsabilité fonctionnelle identifiable.

Un domaine :

- possède une finalité métier claire ;
- porte des invariants ;
- possède ou influence une source de vérité ;
- exprime des règles stables ;
- ne se réduit pas à un fournisseur technique.

Un domaine n’est pas une simple intégration.

---

## Domaine coeur

Un domaine coeur est un domaine indispensable à l’identité fonctionnelle du système.

Sans lui, le système cesse de représenter correctement son métier principal.

Un domaine coeur :

- n’est pas optionnel ;
- structure le modèle métier ;
- ne dépend pas d’un fournisseur pour exister ;
- influence directement la cohérence globale du système.

---

## Capacité optionnelle

Une capacité optionnelle est un comportement activable ou modulable qui enrichit le système sans redéfinir son coeur.

Elle :

- apporte de la valeur ;
- peut être présente ou absente selon le contexte ;
- doit rester bornée ;
- ne doit pas réécrire silencieusement la vérité métier centrale.

---

## Système externe

Un système externe est un système tiers ou périphérique avec lequel le système échange des données, des ordres ou des signaux.

Exemples typiques :

- fournisseur de paiement ;
- service email ;
- ERP ;
- transporteur ;
- plateforme analytique ;
- CMS tiers.

---

## Satellite

Un satellite est un système externe ou périphérique connecté au système sans faire partie du coeur métier.

Le terme met l’accent sur la position architecturale et non sur la technologie.

---

## Fournisseur

Un fournisseur est une implémentation externe apportant une capacité technique ou opérationnelle.

Exemples :

- Stripe pour le paiement ;
- un fournisseur SMTP ou transactionnel pour l’email ;
- un transporteur ;
- une API tierce de catalogue.

Un fournisseur n’est jamais le coeur métier.

---

## Adaptateur

Un adaptateur est une couche d’isolation entre le système interne et un système externe.

Il a pour rôle de :

- traduire les formats ;
- isoler les dépendances ;
- transformer les erreurs ;
- éviter que le modèle externe dicte le modèle interne.

---

## Source de vérité

La source de vérité est l’endroit de référence faisant autorité pour une donnée ou une décision donnée.

Une source de vérité doit être explicite.

Une donnée ne doit pas avoir plusieurs sources de vérité concurrentes sans règle de priorité formelle.

---

## Préoccupation transverse

Une préoccupation transverse est une responsabilité qui traverse plusieurs parties du système.

Elle ne se limite pas à un domaine unique.

Exemples :

- audit ;
- observabilité ;
- journalisation ;
- sécurité ;
- backbone événementiel.

Une préoccupation transverse peut être critique et non optionnelle.

---

## Événement de domaine

Un événement de domaine est un fait métier significatif exprimant qu’un changement important a eu lieu dans le système.

Il représente un fait passé, pas une intention future.

Il doit être nommé dans le langage métier du système.

---

## Job

Un job est un traitement exécuté de manière différée, asynchrone ou technique.

Un job n’est pas nécessairement un fait métier.
Il peut être :

- déclenché par un événement ;
- planifié ;
- technique ;
- de rattrapage ;
- de synchronisation.

---

## Idempotence

L’idempotence est la propriété selon laquelle plusieurs exécutions d’une même opération produisent un résultat final cohérent sans duplication indue.

Cette notion est critique pour :

- les webhooks ;
- les retries ;
- les jobs ;
- les synchronisations ;
- les traitements asynchrones.

---

## Invariant

Un invariant est une règle qui doit rester vraie tant que le système est cohérent.

Un invariant violé signale :

- une corruption métier ;
- une erreur de conception ;
- un défaut d’orchestration ;
- ou un manque de contrôle transactionnel.

---

## Activation

L’activation est le fait de rendre disponible une capacité optionnelle selon un contexte donné.

L’activation doit être explicite.
Une capacité optionnelle ne doit pas devenir active par effet de bord implicite.

---

## Classification

La classification est l’acte consistant à ranger un élément du système dans une catégorie architecturale stable :

- domaine coeur ;
- capacité optionnelle ;
- système externe / satellite ;
- préoccupation transverse.

La classification doit être justifiable et cohérente avec la doctrine.
