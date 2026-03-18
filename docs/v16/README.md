# V16 — Homepage editable : lot de correctifs ciblés V1

## Statut

Document d’implémentation.

Ce document sert de source de vérité pour corriger un lot limité de problèmes identifiés sur la feature homepage éditable.

L’objectif est de livrer un correctif **court, strict, sans refonte**, compatible avec les règles projet Creatyss :

- Next.js App Router
- TypeScript strict
- PostgreSQL
- Docker Compose en local
- déploiement futur sur VPS OVH
- aucune dépendance inutile

---

## Contexte

La feature homepage éditable est déjà globalement saine :

- séparation des couches globalement correcte
- UI admin lisible
- logique serveur identifiable
- repository admin dédié existant
- homepage publique déjà branchée sur des données structurées

En revanche, plusieurs points doivent être corrigés pour améliorer :

- la frontière de confiance client / serveur
- la qualité des accès aux données
- la cohérence de l’architecture
- la robustesse des validations
- la stratégie de rendu de la homepage publique

---

## Objectif du lot

Ce lot doit corriger uniquement les points suivants :

1. supprimer la confiance accordée au champ caché `currentHeroImagePath`
2. éviter les full fetch des médias pour une recherche par ID
3. corriger la direction des imports de types entre entité et repository
4. ajouter des bornes de validation sur les textes homepage
5. ajouter des bornes de cardinalité sur les listes d’IDs sélectionnés
6. remplacer `force-dynamic` par une stratégie simple de revalidation

---

## Contraintes obligatoires

### Contraintes générales

- ne pas ajouter de dépendance
- ne pas changer le périmètre fonctionnel
- ne pas modifier le design
- ne pas refondre l’admin
- ne pas refondre la homepage publique
- ne pas modifier le schéma métier hors besoin strict du lot
- ne pas introduire d’abstraction prématurée
- rester en TypeScript strict
- ne pas utiliser `any`

### Contraintes d’architecture

Toujours conserver une séparation claire entre :

- `entities/` : types métier, validation, normalisation
- `db/` : accès aux données
- `features/` : logique serveur, orchestration
- `app/` : UI, composition

### Contraintes d’implémentation

- faire le changement le plus simple compatible avec l’évolution future
- préférer des fonctions explicites
- éviter les helpers génériques inutiles
- ne pas faire de refactor transverse hors périmètre
- ne pas toucher à d’autres features

---

## Périmètre

### Inclus

- `entities/homepage/*`
- `db/repositories/admin-homepage.repository.ts`
- `db/admin-media.ts` ou fichier équivalent
- `features/admin/homepage/actions/update-homepage-action.ts`
- `app/admin/(protected)/homepage/*`
- `app/page.tsx`
- tests ciblés de cette feature si nécessaire

### Exclus

- refonte du modèle de données
- refonte du système d’uploads
- refonte des médias
- cache applicatif complexe
- invalidation avancée
- nouveau système admin
- Docker prod complet
- refactor global homepage, catalog, blog

---

## Problèmes à corriger

### P1 — Sécurité : ne plus faire confiance à `currentHeroImagePath`

#### Problème

Le formulaire admin transporte `currentHeroImagePath` dans un champ caché HTML.

Cette valeur vient du client, donc elle ne doit pas être acceptée comme source de vérité pour persister `hero_image_path`.

#### Décision

Le serveur ne doit plus dépendre d’un chemin transmis par le client pour « garder l’image actuelle ».

#### Attendu

- supprimer l’usage de `currentHeroImagePath` dans le flux de mise à jour
- supprimer le champ caché correspondant côté formulaire si présent
- si l’intention est « garder l’image actuelle », alors la valeur conservée doit être résolue côté serveur
- si un nouvel asset est sélectionné, le chemin doit être obtenu depuis la base à partir de l’asset
- aucun chemin arbitraire ne doit être accepté depuis le client

#### Règle de conception

Le client peut envoyer :

- une intention de conserver l’image actuelle
- une intention de supprimer l’image
- un `heroImageMediaAssetId` valide

Le client ne peut pas imposer directement un `heroImagePath`.

---

### P2 — Accès données : récupération ciblée d’un media asset par ID

#### Problème

La feature fait actuellement un chargement complet des médias puis un `.find()` pour retrouver un seul asset.

#### Décision

Créer une récupération dédiée par identifiant.

#### Attendu

Ajouter une fonction dédiée, de type :

- `getAdminMediaAssetById(id: string)`

#### Règles

- accès ciblé par ID
- retour `null` si non trouvé
- pas de full fetch pour ce besoin
- remplacer dans cette feature tous les usages de type `list...().find(...)` servant uniquement à retrouver un média par ID

#### Impact attendu

Au minimum :

- page admin homepage
- action de mise à jour homepage

---

### P3 — Architecture : remettre les types homepage du bon côté

#### Problème

Une entité homepage importe actuellement des types depuis un repository.

Même en `import type`, la direction sémantique est incorrecte.

#### Décision

Les types métier nécessaires à la homepage doivent vivre côté `entities/homepage/`.

#### Attendu

Créer ou déplacer les types métier nécessaires, par exemple :

- `HomepageFeaturedProductSelection`
- `HomepageFeaturedCategorySelection`
- `HomepageFeaturedBlogPostSelection`

#### Règles

- `entities/*` ne doit pas dépendre de `db/*`
- le repository peut dépendre des types entité
- garder des noms explicites
- ne pas créer de couche supplémentaire inutile

---

### P4 — Validation : bornes de longueur sur les champs texte

#### Problème

Certains champs sont normalisés mais sans limite supérieure explicite.

#### Champs concernés

Au minimum :

- `heroTitle`
- `heroText`
- `editorialTitle`
- `editorialText`

#### Décision

Ajouter des bornes supérieures sobres et explicites côté validation serveur.

#### Bornes à utiliser

Utiliser ces bornes sauf contrainte technique existante incompatible :

- `heroTitle` : 120
- `heroText` : 500
- `editorialTitle` : 120
- `editorialText` : 1200

#### Règles

- conserver trim et normalisation existants
- refuser les valeurs trop longues
- produire des messages d’erreur clairs
- ne pas compter sur la seule validation HTML du formulaire

---

### P5 — Validation : bornes de cardinalité sur les listes sélectionnées

#### Problème

Aucune borne de cardinalité n’existe actuellement sur :

- `featuredProductIds`
- `featuredCategoryIds`
- `featuredBlogPostIds`

#### Décision

Limiter le nombre maximum d’IDs acceptés côté serveur.

#### Limites à utiliser

- `featuredProductIds` : max 12
- `featuredCategoryIds` : max 8
- `featuredBlogPostIds` : max 6

#### Règles

- dédupliquer les IDs avant validation finale si nécessaire
- refuser les listes trop volumineuses
- produire des messages d’erreur clairs

---

### P6 — Homepage publique : abandonner `force-dynamic`

#### Problème

La homepage publique force actuellement un rendu dynamique à chaque requête.

#### Décision

Passer à une stratégie de revalidation simple, stable et suffisante pour une V1.

#### Attendu

Remplacer `force-dynamic` par :

```ts
export const revalidate = 60;
```

#### Règles

- ne pas introduire de cache complexe
- ne pas utiliser de mécanisme expérimental inutile
- rester simple et prévisible
- accepter un léger délai de propagation après édition admin

---

## Plan d’implémentation obligatoire

L’implémentation doit suivre cet ordre.

### Étape 1 — Corriger le flux hero image

#### À faire

- retirer le transport de `currentHeroImagePath` depuis le formulaire admin
- adapter l’action serveur pour déterminer la valeur finale côté serveur
- conserver, supprimer ou remplacer l’image hero à partir de données serveur uniquement

#### Résultat attendu

Le client ne fournit plus jamais un chemin de fichier comme source de vérité.

---

### Étape 2 — Ajouter un accès média par ID

#### À faire

- créer `getAdminMediaAssetById(id: string)`
- remplacer les usages full fetch + `.find()` dans cette feature

#### Résultat attendu

La feature homepage ne charge plus toute la table médias pour retrouver un asset unique.

---

### Étape 3 — Replacer les types métier homepage

#### À faire

- déplacer ou créer les types de sélection dans `entities/homepage/`
- mettre à jour les imports
- vérifier qu’aucune entité homepage n’importe depuis `db/repositories/*`

#### Résultat attendu

La direction des dépendances est propre.

---

### Étape 4 — Durcir la validation homepage

#### À faire

- ajouter les bornes de longueur
- ajouter les bornes de cardinalité
- garder la normalisation existante
- garder des messages explicites

#### Résultat attendu

Les payloads trop longs ou trop volumineux sont refusés côté serveur.

---

### Étape 5 — Ajuster le rendu de la homepage publique

#### À faire

- retirer `force-dynamic`
- utiliser `revalidate = 60`

#### Résultat attendu

La homepage publique ne relance plus systématiquement les requêtes DB à chaque visite.

---

## Fichiers probablement modifiés

Liste indicative :

- `entities/homepage/homepage-input.ts`
- `entities/homepage/homepage-types.ts` ou équivalent si créé
- `db/repositories/admin-homepage.repository.ts`
- `db/admin-media.ts`
- `features/admin/homepage/actions/update-homepage-action.ts`
- `app/admin/(protected)/homepage/page.tsx`
- `app/page.tsx`

---

## Non-objectifs explicites

Ce lot ne doit pas :

- changer le design
- ajouter une nouvelle fonctionnalité homepage
- introduire une gestion d’uploads plus avancée
- ajouter une invalidation cache sophistiquée
- refactorer tout le module media
- refactorer le catalog ou le blog
- créer une architecture shared générique sans besoin immédiat

---

## Critères d’acceptation

### Sécurité

- aucun champ client ne permet d’imposer directement `hero_image_path`
- garder l’image actuelle repose uniquement sur des données serveur
- une valeur d’asset invalide ne permet pas d’écrire un chemin arbitraire

### Accès données

- un accès direct par ID existe pour les media assets
- la feature homepage n’utilise plus de full fetch pour retrouver un seul média

### Architecture

- aucune entité homepage n’importe depuis un repository
- les types métier homepage sont définis côté `entities/homepage/`

### Validation

- les champs texte ont une longueur maximale explicite
- les listes d’IDs ont une cardinalité maximale explicite
- les erreurs restent compréhensibles

### Homepage publique

- `force-dynamic` n’est plus utilisé sur la homepage
- `revalidate = 60` est en place

---

## Vérifications obligatoires

### Vérifications techniques

Exécuter les vérifications pertinentes du projet, au minimum :

- build TypeScript
- lint si disponible
- test ciblé si existant
- vérification locale de la feature

### Vérifications manuelles

#### Cas 1 — conserver l’image hero actuelle

- ouvrir l’admin homepage
- enregistrer sans changer l’image
- vérifier que l’image actuelle est conservée

#### Cas 2 — choisir une nouvelle image hero

- sélectionner un autre media asset
- enregistrer
- vérifier que la homepage publique affiche bien la nouvelle image après revalidation

#### Cas 3 — supprimer l’image hero si le flux le permet déjà

- exécuter le comportement existant
- vérifier que le résultat est cohérent

#### Cas 4 — payload invalide

- tester une valeur texte trop longue
- tester une liste d’IDs trop volumineuse
- vérifier que la validation serveur refuse correctement

#### Cas 5 — architecture

- vérifier qu’aucun import de `entities/homepage/*` ne pointe vers `db/*`

---

## Format de sortie attendu pour l’implémentation

Après implémentation, fournir uniquement :

1. la liste des fichiers modifiés
2. un résumé court des changements
3. les éventuelles constantes de validation ajoutées
4. les commandes de vérification exécutées
5. les vérifications manuelles à faire
6. les limites éventuelles restantes, si elles sont strictement dans le périmètre du lot

---

## Prompt recommandé pour Claude

```text
Lis et applique strictement docs/v16/README.md.

Respecte tout le périmètre, les contraintes et l’ordre d’implémentation.

Ne fais aucun refactor hors sujet.
N’ajoute aucune dépendance.
Ne change pas le design.
Ne change pas le périmètre fonctionnel.

À la fin, donne uniquement :
1. les fichiers modifiés
2. un résumé court
3. les constantes de validation ajoutées
4. les commandes de vérification exécutées
5. les vérifications manuelles à faire
6. les limites éventuelles restantes dans le périmètre
```
