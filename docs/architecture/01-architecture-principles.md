# Architecture principles

## Objectif

Ce document définit les principes d’architecture non négociables du socle.

Il ne décrit pas un projet précis.
Il décrit la manière correcte de penser, structurer et faire évoluer le système.

Ces principes doivent guider :

- la modélisation métier ;
- la découpe des domaines ;
- la documentation ;
- la gestion des capabilities ;
- la gestion des providers ;
- les décisions de build ;
- les choix de maintenance ;
- les arbitrages de coût.

---

## Principe 1 — partir du besoin client

Le point de départ d’un projet n’est pas une liste de features déjà codées.
Le point de départ est un besoin métier réel.

L’architecture doit répondre à des questions simples :

- que veut vendre le client ?
- à qui ?
- dans quels pays ?
- avec quel niveau de sophistication ?
- avec quelles contraintes réglementaires ?
- avec quel niveau de maintenance acceptable ?
- avec quel budget initial et récurrent ?

Le besoin client est ensuite traduit en capabilities, niveaux, maintenance et coût.

---

## Principe 2 — garder un noyau structurel stable

Le socle doit reposer sur un noyau stable qui ne change pas selon les projets.

Ce noyau inclut notamment :

- la structure par domaines ;
- la sécurité ;
- les transactions et la cohérence ;
- les domain events ;
- l’observability ;
- l’audit ;
- le lifecycle des données ;
- l’exploitabilité ;
- les frontières externes.

Ce noyau ne doit pas devenir un assemblage variable au gré des projets.
Il constitue la colonne vertébrale du système.

---

## Principe 3 — séparer domaine, capability, niveau et provider

Le socle distingue explicitement :

- le **domaine** : responsabilité métier ou structurelle stable ;
- la **capability** : variation activable dans le comportement ;
- le **niveau** : profondeur de sophistication de cette capability ;
- le **provider** : système externe concret utilisé par un connecteur.

Cette séparation est obligatoire.

Exemples :

- `payments` est un domaine ;
- `paymentMode.installments` est une capability ;
- son niveau peut être simple ou avancé ;
- `Stripe`, `PayPal`, `Alma` sont des providers.

Un provider n’est jamais un domaine coeur.
Une capability n’est jamais la source de vérité métier.
Un niveau n’est jamais une simple variation cosmétique.

---

## Principe 4 — une source de vérité claire par concept métier

Chaque concept métier structurant doit avoir un domaine source explicite.

Exemples :

- le panier relève de `cart` ;
- la validation finale relève de `checkout` ;
- la commande durable relève de `orders` ;
- l’état de paiement interne relève de `payments` ;
- les événements durables relèvent de `domain-events`.

Il est interdit qu’un même concept soit redéfini librement dans plusieurs domaines.
Les autres domaines peuvent lire, dériver, projeter ou réagir.
Ils ne doivent pas reconstruire leur propre vérité concurrente.

---

## Principe 5 — les variations passent par capabilities, pas par duplication de socle

Le socle doit pouvoir servir plusieurs projets sans dupliquer son architecture.

On ne crée pas un “autre socle” pour :

- un autre PSP ;
- un autre niveau fiscal ;
- un autre niveau de maintenance ;
- un projet plus simple ;
- un projet plus avancé.

On garde le même socle et on joue sur :

- les capabilities activées ;
- le niveau des capabilities ;
- les providers branchés ;
- le niveau de maintenance ;
- le profil solution.

---

## Principe 6 — choisir le minimum utile, pas le maximum théorique

Chaque projet doit démarrer avec le plus petit niveau réellement suffisant.

Cela signifie :

- ne pas sur-activer des capacités “au cas où” ;
- ne pas implémenter un niveau 4 pour un besoin niveau 1 ;
- ne pas imposer une maintenance disproportionnée ;
- ne pas facturer de la complexité non utilisée.

Le socle doit permettre un ticket d’entrée bas tout en restant structurellement propre.

---

## Principe 7 — rendre chaque montée de niveau additive

Une montée en sophistication doit être additive et prévisible.

Passer :

- d’un paiement simple à plusieurs providers ;
- d’une taxation locale à une taxation multi-zone ;
- d’un panier simple à une reprise de panier abandonné ;
- d’un contenu simple à un CMS plus riche ;
- d’une maintenance essentielle à une maintenance plus avancée

ne doit pas exiger une refonte du coeur.

La montée en niveau doit réutiliser les mêmes fondations.

---

## Principe 8 — protéger le coeur des schémas externes

Les schémas, statuts et DTO externes ne doivent jamais devenir le langage interne officiel du socle.

Les intégrations externes doivent être :

- isolées ;
- traduites ;
- validées ;
- contrôlées ;
- idempotentes.

Le coeur parle un langage métier propre.
Les providers sont traduits vers ce langage, pas l’inverse.

---

## Principe 9 — toute sophistication fonctionnelle a un coût réel

Une capability avancée implique généralement :

- plus de règles métier ;
- plus de données ;
- plus de validations ;
- plus de tests ;
- plus de maintenance ;
- plus d’observability ;
- plus de coût ;
- plus de risque.

Le socle doit rendre ce coût lisible.
Une capability n’est jamais “gratuite” simplement parce que le code existe déjà en partie.

---

## Principe 10 — la robustesse minimale n’est pas optionnelle

Le socle doit rester robuste, même dans ses configurations les plus simples.

Il n’existe pas de mode “cheap fragile” officiellement supporté.

Même un projet d’entrée de gamme doit conserver :

- une base de sécurité sérieuse ;
- une cohérence transactionnelle correcte ;
- une capacité de restauration ;
- une observability minimale ;
- une gestion propre des secrets ;
- une traçabilité minimale des mutations critiques ;
- une séparation nette entre coeur métier et intégrations.

Le bas coût ne doit pas créer un passif structurel.

---

## Principe 11 — les effets externes ne pilotent pas la validité métier

Les mutations critiques du coeur ne doivent pas dépendre directement d’effets externes synchrones.

Le flux correct est :

1. validation métier ;
2. mutation locale atomique ;
3. écriture de l’outbox si nécessaire ;
4. commit ;
5. traitements externes après commit.

Le système doit rester capable de survivre à :

- un provider indisponible ;
- un callback dupliqué ;
- un timeout externe ;
- une reprise opératoire.

---

## Principe 12 — l’architecture doit être exploitable, pas seulement élégante

Une bonne architecture ne se juge pas uniquement sur sa propreté théorique.
Elle doit être exploitable.

Le socle doit permettre :

- de diagnostiquer un problème ;
- de comprendre un état métier ;
- de reprendre une opération ;
- d’auditer une mutation sensible ;
- de restaurer un environnement ;
- de faire évoluer un projet sans chaos.

La qualité d’exploitation fait partie de la qualité d’architecture.

---

## Principe 13 — la documentation doit être un outil de cadrage réel

La documentation d’architecture ne sert pas seulement à “expliquer le code”.
Elle sert à :

- penser le socle ;
- cadrer les projets ;
- classer les domaines ;
- relier besoins, capabilities et niveaux ;
- relier niveaux et coûts ;
- relier fonctionnalités et maintenance ;
- faciliter la réutilisation.

Une doc qui ne sert pas au cadrage, à la décision ou à l’exploitation est insuffisante.

---

## Principe 14 — la modularité doit rester lisible pour un usage commercial

Le socle doit être compréhensible non seulement par un développeur, mais aussi dans une logique de proposition de valeur.

Il doit être possible d’expliquer simplement :

- ce qui est toujours inclus ;
- ce qui est activable ;
- ce qui existe à plusieurs niveaux ;
- ce qui dépend d’un provider ;
- ce qui fait monter le coût ;
- ce qui fait monter la maintenance.

Cette lisibilité est indispensable pour vendre, cadrer et maintenir correctement le socle.

---

## Principe 15 — la réutilisabilité est un objectif de conception explicite

Le socle n’est pas réutilisable “par chance”.
Il doit être conçu pour l’être.

Cela implique :

- conventions stables ;
- découpage explicite ;
- interfaces propres ;
- capacités activables ;
- niveaux homogènes ;
- frontières externes contrôlées ;
- documentation cohérente ;
- stratégie de maintenance claire.

---

## Anti-patterns interdits

Les pratiques suivantes sont interdites :

- faire du provider externe une source de vérité interne ;
- activer des capabilities sans besoin réel ;
- mélanger domaine, capability et provider ;
- surdimensionner un projet simple ;
- sous-protéger un projet pour économiser le build ;
- laisser les effets externes décider du commit métier ;
- créer des variantes de socle séparées au lieu d’un seul socle composable ;
- documenter des modules sans dire leur niveau, leur coût ou leur criticité ;
- introduire des options sans doctrine de maintenance correspondante.

---

## Décisions structurantes

Les points suivants sont considérés comme décidés :

- l’architecture part du besoin client ;
- le noyau structurel est stable ;
- les variations passent par capabilities, niveaux et providers ;
- une source de vérité claire existe par concept métier ;
- la robustesse minimale n’est pas négociable ;
- les intégrations externes sont confinées ;
- la montée en complexité doit être additive ;
- la documentation d’architecture sert aussi au cadrage, à la maintenance et au coût.
