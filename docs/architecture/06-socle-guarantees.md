# Socle guarantees

## Objectif

Ce document formalise les garanties transverses du socle.

Ces garanties définissent ce que le socle promet toujours, indépendamment :

- du profil projet ;
- des capabilities activées ;
- du niveau retenu sur ces capabilities ;
- du nombre de providers branchés ;
- du niveau de sophistication métier du client.

Ces garanties sont la base de la robustesse du socle.

---

## Principe général

Le socle peut démarrer simple.
Il ne doit jamais démarrer fragile.

Les garanties du socle ne décrivent pas une sophistication optionnelle.
Elles décrivent le seuil minimal de sérieux architectural et opérationnel.

Une configuration d’entrée de gamme peut être légère.
Elle ne peut pas sacrifier :

- la sécurité ;
- la cohérence ;
- la traçabilité ;
- la capacité de reprise ;
- l’exploitabilité minimale ;
- la possibilité d’évolution.

---

## 1. Garantie de sécurité

Le socle garantit :

- une authentification structurée ;
- un contrôle d’accès sérieux ;
- une gestion correcte des secrets ;
- une validation serveur des opérations critiques ;
- une isolation des intégrations externes ;
- une séparation claire entre acteurs, permissions et connecteurs techniques ;
- une réduction de la surface d’erreur sur les flux sensibles.

La sécurité n’est pas traitée comme une option haut de gamme.
Elle constitue un prérequis.

---

## 2. Garantie de cohérence métier

Le socle garantit :

- une source de vérité claire par concept métier ;
- une séparation explicite entre domaines ;
- des frontières nettes entre coeur et intégrations ;
- une cohérence de mutation sur les flux critiques ;
- une doctrine d’idempotence sur les commandes réessayables ;
- une stratégie de concurrence documentable.

Le socle ne tolère pas les doubles vérités métier.

---

## 3. Garantie de cohérence transactionnelle

Le socle garantit :

- des transactions applicatives explicites sur les écritures critiques ;
- une séparation entre mutation locale et effets externes ;
- une écriture durable des événements internes lorsque nécessaire ;
- un commit métier indépendant de la réussite immédiate des effets externes ;
- des flux de retry qui ne détruisent pas l’intégrité du coeur.

Les providers externes ne pilotent pas la validité interne du système.

---

## 4. Garantie d’observability

Le socle garantit un niveau d’observability suffisant pour :

- comprendre un état métier critique ;
- diagnostiquer un incident ;
- suivre les jobs et les intégrations ;
- suivre les paiements et les flux sensibles ;
- comprendre les échecs principaux ;
- soutenir une maintenance sérieuse.

Même à un niveau d’exploitation contenu, le socle ne doit pas être opaque.

---

## 5. Garantie d’audit

Le socle garantit une traçabilité minimale des opérations sensibles.

Cela concerne notamment :

- les changements d’accès ;
- les mutations critiques ;
- les transitions importantes de statut ;
- certaines opérations de remboursement, annulation, activation, correction ou reprise ;
- les actions opérateur ayant un impact durable.

L’audit ne remplace pas l’observability.
Il la complète.

---

## 6. Garantie de performance pragmatique

Le socle garantit une performance compatible avec un usage sérieux.

Cela implique :

- une structure sobre ;
- des mutations critiques raisonnablement efficaces ;
- le recours à l’asynchronisme pour les traitements non bloquants ;
- une attention aux points chauds métier ;
- une capacité à surveiller les problèmes de performance les plus importants.

La performance n’est pas pensée comme une optimisation abstraite.
Elle est pensée comme une condition de qualité réelle du produit.

---

## 7. Garantie de résilience

Le socle garantit une capacité minimale à absorber :

- un timeout provider ;
- un callback dupliqué ;
- un job échoué ;
- une tentative de retry ;
- une indisponibilité temporaire d’un service externe ;
- une reprise opératoire.

Le socle doit rester capable de :

- conserver sa vérité interne ;
- rejouer ou reprendre proprement certains flux ;
- limiter la propagation des erreurs externes.

---

## 8. Garantie de lifecycle explicite

Le socle garantit que les objets critiques ont un cycle de vie compréhensible.

Le cycle de vie doit être explicite pour les concepts importants :

- panier ;
- checkout ;
- commande ;
- paiement ;
- identité d’auth ;
- session ;
- intégration ;
- credentials ;
- webhooks ;
- événements internes.

Le lifecycle ne doit jamais être laissé à des suppressions implicites ou à des transitions floues.

---

## 9. Garantie de maintenabilité

Le socle garantit une base techniquement maintenable :

- conventions stables ;
- découpe claire ;
- frontières explicites ;
- documentation utile ;
- dépendances non superflues ;
- évolutions progressives plutôt que refontes brutales.

La maintenabilité n’est pas un bonus.
C’est une condition pour rendre le socle réutilisable.

---

## 10. Garantie d’évolutivité

Le socle garantit la possibilité d’ajouter progressivement :

- de nouveaux pays ;
- de nouvelles capabilities ;
- de nouveaux niveaux de sophistication ;
- de nouveaux providers ;
- de nouvelles intégrations ;
- de nouvelles contraintes métier ;
- de nouveaux profils projet.

Cette évolutivité doit rester additive.
Le coeur ne doit pas être refondu à chaque nouvelle exigence.

---

## 11. Garantie de gouvernance des données

Le socle garantit :

- une source de vérité claire ;
- une classification minimale des données sensibles ;
- une politique explicite de conservation, d’archivage ou de suppression ;
- une traçabilité adaptée aux données critiques ;
- une séparation entre données coeur, données runtime, projections et données techniques.

Le socle doit rester gouvernable.
Pas seulement “fonctionnel”.

---

## 12. Garantie d’exploitabilité

Le socle garantit qu’un opérateur ou un mainteneur peut :

- comprendre l’état général du système ;
- relancer ou reprendre certains flux ;
- identifier un point de blocage ;
- redémarrer correctement un environnement ;
- suivre les composants critiques ;
- travailler sans dépendre d’une connaissance entièrement implicite.

Une architecture inexploitable n’est pas considérée comme robuste.

---

## 13. Garantie de séparation coeur / intégrations

Le socle garantit que :

- les providers externes restent à la frontière ;
- les DTO externes restent confinés ;
- les statuts providers ne deviennent pas le langage officiel du coeur ;
- les intégrations sont traduites avant impact métier ;
- le coeur garde son vocabulaire, ses invariants et sa cohérence.

Cette garantie est particulièrement importante pour :

- paiements ;
- ERP ;
- emailing ;
- transporteurs ;
- analytics externes ;
- IA externes.

---

## 14. Garantie de modularité lisible

Le socle garantit une modularité compréhensible :

- domaine coeur ;
- capability ;
- niveau ;
- provider ;
- maintenance.

Cette modularité doit être intelligible non seulement pour le build technique, mais aussi pour :

- le cadrage ;
- la proposition commerciale ;
- le chiffrage ;
- la maintenance ;
- l’évolution future.

---

## 15. Garantie de coût maîtrisable

Le socle garantit qu’un projet peut être lancé avec un coût initial maîtrisé sans dégrader les fondations.

Cela implique :

- activer seulement ce qui est utile ;
- choisir le niveau minimal suffisant ;
- ne pas introduire de sophistication gratuite ;
- ne pas sacrifier le noyau robuste.

Le socle ne promet pas que toute sophistication coûte peu.
Il promet que la sophistication coûte de façon plus lisible et plus progressive.

---

## Ce que les garanties ne signifient pas

Les garanties du socle ne signifient pas :

- que tout projet doit démarrer au niveau maximal ;
- que toutes les capabilities doivent être activées ;
- que toutes les intégrations doivent être branchées ;
- que la maintenance doit être systématiquement élevée ;
- que le socle doit être surdimensionné dès le départ.

Elles signifient uniquement qu’un projet, même simple, repose sur des fondations sérieuses.

---

## Règles de lecture

### Règle 1

Une capability absente ne remet pas en cause les garanties du socle.

### Règle 2

Un niveau faible de sophistication ne remet pas en cause les garanties du socle.

### Règle 3

Un coût initial bas ne remet pas en cause les garanties du socle.

### Règle 4

La montée en niveau ajoute des exigences, mais ne change pas la nature des garanties fondamentales.

---

## Conséquences pratiques

Ces garanties imposent les conséquences suivantes :

- la sécurité n’est jamais facultative ;
- la cohérence n’est jamais facultative ;
- l’audit minimal n’est jamais facultatif ;
- la gestion correcte des secrets n’est jamais facultative ;
- la séparation coeur / intégrations n’est jamais facultative ;
- le lifecycle explicite des objets critiques n’est jamais facultatif ;
- l’exploitabilité minimale n’est jamais facultative.

Ce qui varie d’un projet à l’autre, ce n’est pas l’existence de ces garanties.
C’est leur profondeur, leur sophistication, leur niveau de maintenance associé et le coût nécessaire pour les soutenir.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- le socle peut être simple mais ne doit jamais être fragile ;
- les garanties transverses constituent le minimum sérieux du système ;
- la sécurité, la cohérence, l’exploitabilité et le lifecycle sont non négociables ;
- les intégrations externes ne doivent jamais polluer le coeur ;
- la maintenabilité et l’évolutivité font partie des garanties du socle ;
- le coût d’entrée maîtrisé ne doit jamais être obtenu au prix d’une dégradation structurelle.
