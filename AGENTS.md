# Creatyss

## Mission

Construire et faire évoluer Creatyss comme une plateforme e-commerce custom :

- local-first via Docker ;
- maintenable ;
- lisible ;
- strictement typée ;
- documentée ;
- déployable ensuite sur un VPS OVH.

Le projet doit rester cohérent à la fois :

- sur le plan métier ;
- sur le plan architectural ;
- sur le plan documentaire ;
- sur le plan opérationnel.

---

## Stack de référence

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose
- Makefile

---

## Source de vérité documentaire

Le référentiel canonique du projet est organisé dans `docs/` :

- `docs/architecture/` : doctrine d’architecture canonique
- `docs/domains/` : fiches détaillées par domaine
- `docs/testing/` : stratégie, niveaux et roadmap de validation

### Règle absolue

Pour toute demande de conception, d’implémentation, de refonte, de classification ou de documentation :

1. lire d’abord `docs/architecture/`
2. puis lire `docs/domains/` si la demande touche un domaine précis
3. puis lire `docs/testing/` si la demande touche validation, vérification ou robustesse

### Priorité documentaire

En cas de conflit :

1. `docs/architecture/` fait autorité sur la doctrine
2. `docs/domains/` fait autorité sur le détail local d’un domaine, à doctrine constante
3. `docs/testing/` fait autorité sur la stratégie de validation

Aucun changement ne doit contredire `docs/architecture/`.

---

## Ordre de lecture minimal

Avant toute modification non triviale, lire au minimum :

1. `docs/architecture/README.md`
2. `docs/architecture/00-introduction/00-vue-d-ensemble-du-systeme.md`
3. `docs/architecture/00-introduction/01-glossaire.md`
4. `docs/architecture/10-fondations/10-principes-d-architecture.md`
5. `docs/architecture/10-fondations/11-modele-de-classification.md`
6. `docs/architecture/10-fondations/12-frontieres-et-responsabilites.md`

Si la demande touche un domaine : 7. lire la fiche correspondante dans `docs/domains/`

Si la demande touche les tests : 8. lire les documents pertinents dans `docs/testing/`

---

## Principes de travail

- Toujours choisir la solution la plus simple compatible avec l’évolution future.
- Toujours privilégier la lisibilité, la maintenabilité et la clarté du domaine métier.
- Toujours travailler par petits incréments sûrs.
- Toujours rester dans le périmètre demandé.
- Toujours préserver le comportement existant hors périmètre.
- Toujours proposer une solution principale, concrète, directement implémentable.
- Toujours aligner le code, la structure et les noms sur la doctrine documentaire en vigueur.
- Toujours protéger les frontières entre domaines.
- Toujours expliciter la source de vérité d’une donnée ou d’une décision importante.

---

## Principes d’architecture à respecter

- Le métier passe avant la technique.
- Le coeur du système doit rester identifiable.
- Les capacités optionnelles doivent rester bornées.
- Les dépendances externes doivent être encapsulées.
- La source de vérité doit être explicite.
- Les événements doivent exprimer des faits, pas masquer une mauvaise modélisation.
- Les préoccupations transverses doivent être traitées explicitement.
- Les frontières doivent être compréhensibles.
- Le système doit rester testable par responsabilité.
- La documentation doit refléter la structure réelle.

---

## Taxonomie du système

Le système suit la taxonomie définie dans `docs/architecture/` et appliquée dans `docs/domains/`.

### Catégories documentaires reconnues

- `core`
- `optional`
- `cross-cutting`
- `satellites`

### Règles

- `core` : domaines coeur, métier ou structurels, indispensables
- `optional` : capacités optionnelles activables
- `cross-cutting` : responsabilités transverses, potentiellement critiques
- `satellites` : blocs satellites, projections, modélisations périphériques ou sous-systèmes connexes

Ne jamais reclassifier un domaine “par intuition”.
Toute reclassification doit rester cohérente avec `docs/architecture/10-fondations/11-modele-de-classification.md`.

---

## Structure attendue du code

La structure exacte peut évoluer, mais les responsabilités doivent rester lisibles.

Repères usuels :

- `app/` : routes, layouts, pages, handlers Next.js
- `components/` : composants UI réutilisables
- `lib/` : utilitaires techniques transverses
- `db/` : migrations, seeds, accès base, repositories
- `scripts/` : scripts techniques
- `docs/` : doctrine, domaines, tests et documents projet

Règle absolue :

- ne pas mélanger logique métier et composants de présentation ;
- ne pas dissoudre les frontières de domaine dans des helpers techniques vagues.

---

## Règles Next.js

- Server Components par défaut
- Client Components seulement si nécessaire
- Server Actions seulement quand elles simplifient réellement le flux
- Pas de logique métier directement dans les composants UI
- Pas de structure de routes sophistiquée sans besoin réel
- Pas d’abstraction Next.js prématurée

---

## Séparation des responsabilités

### UI

Affichage, composition d’interface, expérience utilisateur.

### Validation

Validation explicite des entrées côté serveur.

### Métier

Règles métier pures, explicites, traçables.

### Données

Accès base et persistance dans une couche dédiée.

### Intégration

Échanges externes isolés derrière des interfaces, adaptateurs ou couches dédiées.

Aucune couche ne doit absorber silencieusement la responsabilité d’une autre.

---

## Base de données

- Clés primaires explicites
- Timestamps systématiques quand pertinents
- Slugs uniques quand nécessaires
- Relations propres et stables
- Index utiles sans excès
- Nommage cohérent et durable
- Toute modification de schéma doit passer par une migration SQL explicite
- Ne jamais modifier silencieusement le schéma existant
- Ne jamais supprimer table, colonne, contrainte ou index sans demande explicite
- Préserver la compatibilité tant qu’une refonte explicite n’est pas demandée

---

## Dépendances

- Préférer les solutions natives Next.js, TypeScript, Node.js et PostgreSQL quand elles suffisent
- Vérifier d’abord si une solution simple déjà présente dans le projet existe
- Toute nouvelle dépendance doit être justifiée explicitement
- Ne jamais ajouter une dépendance pour masquer une faiblesse de modélisation
- Ne jamais sur-architecturer

---

## Interdits

- Ne jamais proposer WordPress, WooCommerce, Shopify, Supabase ou Vercel
- Ne jamais ajouter de dépendance inutile
- Ne jamais introduire Redis, queue, microservices, websocket, IA ou analytics avancés sans demande explicite
- Ne jamais utiliser `any` sauf justification explicite et exceptionnelle
- Ne jamais mélanger logique métier et présentation
- Ne jamais refactorer massivement hors périmètre
- Ne jamais implémenter une étape suivante non demandée
- Ne jamais contourner la doctrine d’architecture au nom de la vitesse

---

## Local-first

- Le projet doit fonctionner localement via Docker
- La commande d’entrée principale est `make up`
- Le setup local minimal inclut au minimum `app` et `db`
- Tout ce qui est nécessaire au lancement local doit être dockerisé

---

## Documentation des domaines

Toute modification métier ou structurelle importante doit être cohérente avec `docs/domains/`.

### Règles

- Une fiche domaine décrit une responsabilité réelle
- Une fiche domaine doit expliciter :
  - rôle
  - classification
  - source de vérité
  - responsabilités
  - non-responsabilités
  - invariants
  - dépendances
  - événements significatifs
  - cycle de vie
  - contraintes d’intégration
  - observabilité et audit
  - impact d’exploitation
  - limites
- Toute nouvelle fiche doit suivre `docs/domains/_template.md`
- Toute migration ou contradiction doit être pilotée via `docs/domains/_migration-audit.md`

---

## Sécurité et robustesse

- Ne jamais faire confiance aux entrées utilisateur
- Toujours valider côté serveur
- Ne jamais exposer de secrets côté client
- Gérer explicitement les erreurs métier, base de données, authentification, intégration et upload
- Ne jamais masquer silencieusement une erreur importante
- Toute entrée externe doit être considérée comme potentiellement dupliquée, retardée, désordonnée ou invalide
- Toute logique rejouable doit être idempotente ou neutralisée
- Toute divergence avec un système externe important doit être visible

---

## Discipline de modification

- Ne modifier que les fichiers nécessaires au périmètre demandé
- Ne pas profiter d’un lot pour réorganiser des zones non demandées
- Ne pas renommer massivement sans demande explicite
- Préserver le comportement existant hors périmètre
- Commencer par l’implémentation la plus simple et robuste
- Si un document impose un plan, le suivre strictement
- Si une doc et le code divergent, traiter l’écart explicitement ; ne pas improviser

---

## Planification

Pour tout lot non trivial :

1. objectif
2. périmètre
3. hors périmètre
4. fichiers à créer ou modifier
5. ordre d’exécution
6. impacts de compatibilité
7. vérifications

Tant que le plan n’est pas validé, ne pas modifier le code.

Si la demande touche un sous-ensemble documentaire précis, lire ce sous-ensemble en entier avant de proposer le plan.

---

## Vérifications

Pour chaque lot :

- inclure au minimum un `typecheck`
- ajouter des tests unitaires ciblés si le lot le justifie
- ajouter des tests e2e ciblés si le lot touche un parcours critique
- privilégier une vérification automatisée avant une vérification manuelle
- ne proposer une vérification manuelle navigateur que lorsqu’aucune vérification automatisée utile n’existe

Toujours indiquer :

- les commandes lancées
- les vérifications passées
- les limites restantes

---

## Format de réponse attendu

Quand tu proposes une modification :

1. résumer brièvement ce qui va être modifié
2. lister les fichiers créés ou modifiés
3. fournir le code complet ou les patchs nécessaires
4. indiquer les variables d’environnement nécessaires
5. indiquer la commande de test
6. indiquer la vérification manuelle attendue si nécessaire
7. préciser ce qui reste volontairement hors périmètre

---

## Lisibilité métier

- Le code doit privilégier des noms orientés métier
- Les responsabilités doivent être claires
- Les fichiers doivent rester lisibles
- Toute compatibilité legacy doit rester isolée
- Le modèle visible dans l’admin doit rester simple et compréhensible
- Les abstractions ne doivent jamais masquer le domaine

---

## Règle finale

En cas de doute :

- revenir à `docs/architecture/`
- clarifier la source de vérité
- clarifier la frontière du domaine
- choisir la solution la plus lisible, la plus robuste et la moins surprenante
