# Homepage editable — Correctifs ciblés suite audit

## Contexte

La feature homepage éditable est globalement saine, mais plusieurs points doivent être corrigés pour améliorer :

- la séparation des couches
- la robustesse des validations
- la sécurité côté serveur
- l’efficacité des accès aux médias
- la stratégie de rendu de la homepage publique

L’objectif est de corriger ces points **sans refonte**, **sans ajouter de dépendance**, et **sans élargir le périmètre fonctionnel**.

---

## Objectif

Corriger les points suivants sur la feature homepage éditable :

1. supprimer la confiance accordée au champ caché `currentHeroImagePath`
2. éviter les full fetch des médias pour retrouver un asset par ID
3. remettre la direction des types dans le bon sens entre entité et repository
4. compléter les validations avec bornes de longueur et de cardinalité
5. remplacer la stratégie `force-dynamic` de la homepage publique par une stratégie simple de revalidation

---

## Contraintes obligatoires

- Ne pas ajouter de nouvelle dépendance.
- Ne pas modifier le périmètre métier de la homepage.
- Ne pas refondre l’admin ni le front public.
- Ne pas changer le design.
- Ne pas introduire d’abstraction inutile.
- Rester en TypeScript strict.
- Ne pas utiliser `any`.
- Conserver la séparation claire entre :
  - entités / validation
  - accès aux données
  - logique serveur
  - UI

---

## Périmètre

### Inclus

- `entities/homepage/*`
- `db/repositories/admin-homepage.repository.ts`
- `db/admin-media.ts` ou équivalent
- `features/admin/homepage/actions/update-homepage-action.ts`
- `app/admin/(protected)/homepage/*`
- `app/page.tsx`
- éventuels tests ciblés liés à cette feature

### Exclus

- refonte du schéma DB
- nouveau système de cache complexe
- changement UX de l’admin
- changement visuel de la homepage
- optimisation globale du projet
- Docker prod complet
- migration d’uploads

---

## Problèmes à corriger

## 1. Sécurité — ne plus faire confiance à `currentHeroImagePath`

### Problème

Le formulaire admin transporte `currentHeroImagePath` dans un champ caché HTML.
Ce champ peut être modifié côté client puis renvoyé au serveur.

Le serveur ne doit pas accepter un chemin d’image provenant du client comme source de vérité.

### Attendu

- Supprimer l’usage de `currentHeroImagePath` envoyé par le formulaire.
- Le serveur doit résoudre l’image courante à partir de la source de vérité serveur.
- Si l’option correspond à “garder l’image actuelle”, la valeur conservée doit être déterminée côté serveur.
- Aucun chemin de fichier ne doit être accepté depuis le client sans vérification côté serveur.

### Règle

Le client peut envoyer :

- un nouvel `heroImageMediaAssetId`
- une intention explicite de conservation / suppression

Mais **jamais** imposer directement un `hero_image_path`.

---

## 2. Accès données — récupérer un média par ID sans charger toute la table

### Problème

Le code charge toute la liste des médias puis fait un `.find()` pour retrouver un seul asset.

### Attendu

Ajouter une fonction dédiée, par exemple :

- `getAdminMediaAssetById(id: string)`

### Règles

- la fonction doit faire une récupération ciblée par ID
- elle doit retourner `null` si l’asset n’existe pas
- les appels existants qui font `list...().find(...)` pour cette feature doivent être remplacés par cette fonction dédiée

### Impact attendu

- admin homepage page
- update homepage action
- toute logique équivalente dans cette feature

---

## 3. Architecture — corriger la direction des imports de types

### Problème

L’entité homepage importe actuellement des types depuis le repository admin homepage.
Même en `import type`, la direction de dépendance est sémantiquement incorrecte.

### Attendu

Les types métier nécessaires à la homepage doivent vivre côté `entities/homepage/`.

Exemples visés :

- `HomepageFeaturedProductSelection`
- `HomepageFeaturedCategorySelection`
- `HomepageFeaturedBlogPostSelection`

### Règles

- le repository peut importer ces types depuis `entities/homepage/*`
- l’inverse n’est pas autorisé
- ne pas créer de hiérarchie compliquée
- garder des noms explicites et stables

---

## 4. Validation — bornes de longueur sur les champs texte

### Problème

Des champs texte sont normalisés mais pas bornés.

### Champs concernés

Au minimum :

- `heroTitle`
- `heroText`
- `editorialTitle`
- `editorialText`

### Attendu

Ajouter des bornes supérieures explicites et sobres, cohérentes avec une homepage artisanale V1.

### Valeurs recommandées

Ces bornes peuvent être utilisées directement sauf contrainte existante ailleurs :

- `heroTitle`: 120
- `heroText`: 500
- `editorialTitle`: 120
- `editorialText`: 1200

### Règles

- trim / normalisation conservés
- messages d’erreur explicites
- validation côté serveur obligatoire
- ne pas dépendre d’une validation purement HTML

---

## 5. Validation — borne sur le nombre d’éléments sélectionnés

### Problème

Aucune limite n’existe sur :

- `featuredProductIds`
- `featuredCategoryIds`
- `featuredBlogPostIds`

Un formulaire trafiqué pourrait envoyer un volume excessif.

### Attendu

Limiter la cardinalité maximale acceptée côté serveur.

### Valeurs recommandées

Pour une V1 simple :

- `featuredProductIds`: max 12
- `featuredCategoryIds`: max 8
- `featuredBlogPostIds`: max 6

### Règles

- dédupliquer les IDs avant traitement si nécessaire
- refuser les payloads invalides avec message clair
- ne pas laisser passer des centaines d’IDs

---

## 6. Homepage publique — remplacer `force-dynamic`

### Problème

La homepage publique est marquée `force-dynamic`, ce qui force des requêtes DB à chaque visite.

### Attendu

Remplacer cette stratégie par une approche simple et robuste compatible V1.

### Solution attendue

Utiliser une stratégie de revalidation simple, sobre, sans sur-architecture.

Exemple acceptable :

- `export const revalidate = 60`

### Règles

- ne pas introduire de cache applicatif complexe
- ne pas ajouter de dépendance
- garder un comportement prévisible
- la homepage doit refléter les modifications admin avec un délai raisonnable

---

## Décisions de conception

### À faire

- solution la plus simple compatible avec l’évolution future
- fonctions explicites
- validation serveur stricte
- accès DB ciblés
- types métier définis au bon endroit

### À ne pas faire

- pas de refonte générale de la feature
- pas d’abstraction “shared” prématurée si elle ne sert qu’à cette correction
- pas de nouveau pattern d’architecture transverse
- pas de système d’événements
- pas de cache avancé
- pas de dépendance externe

---

## Fichiers probablement modifiés

Liste indicative, à ajuster selon l’implémentation réelle :

- `entities/homepage/homepage-input.ts`
- `entities/homepage/*` (nouveaux types si nécessaire)
- `db/repositories/admin-homepage.repository.ts`
- `db/admin-media.ts`
- `features/admin/homepage/actions/update-homepage-action.ts`
- `app/admin/(protected)/homepage/page.tsx`
- `app/page.tsx`

---

## Critères d’acceptation

### Sécurité / robustesse

- le serveur n’accepte plus `currentHeroImagePath` depuis le client
- garder l’image actuelle repose sur une résolution côté serveur
- un `heroImageMediaAssetId` invalide ne permet pas d’écrire un chemin arbitraire

### Architecture

- aucune entité homepage n’importe de types depuis un repository DB
- les types métier utilisés par la homepage sont définis côté `entities`

### Validation

- les champs texte ont des bornes supérieures
- les listes d’IDs sélectionnés ont une cardinalité maximale
- les erreurs sont explicites

### Accès données

- aucun full-fetch de `media_assets` n’est utilisé juste pour retrouver un asset par ID dans cette feature
- un accès direct par ID existe et est utilisé

### Homepage publique

- `force-dynamic` n’est plus utilisé pour cette page
- une stratégie de revalidation simple est en place

---

## Tests attendus

## Vérifications minimales

- build TypeScript sans erreur
- lint sans régression évidente
- fonctionnement local inchangé
- édition homepage toujours fonctionnelle
- homepage publique toujours rendue correctement

## Vérifications manuelles

### Cas 1 — garder l’image actuelle

- ouvrir l’admin homepage
- soumettre sans changer l’image hero
- vérifier que l’image actuelle est conservée

### Cas 2 — sélectionner une nouvelle image

- choisir un autre media asset
- enregistrer
- vérifier que la homepage publique reflète bien le changement

### Cas 3 — tentative de payload invalide

- tester un payload trop long ou trop volumineux
- vérifier qu’il est refusé côté serveur avec erreur claire

### Cas 4 — homepage publique

- vérifier que la page fonctionne toujours
- vérifier que les contenus admin remontent correctement
- vérifier que le mode choisi n’est plus `force-dynamic`

---

## Sortie attendue de l’implémentation

Claude doit fournir :

1. les fichiers modifiés
2. un résumé très court des changements
3. les éventuelles constantes de validation ajoutées
4. les commandes de vérification
5. la procédure de vérification manuelle

---

## Instruction d’exécution pour Claude

Implémente uniquement les correctifs décrits dans ce document.

Respecte strictement le périmètre.

Ne fais pas de refactor hors sujet.
Ne change pas le design.
N’ajoute pas de dépendance.
Ne propose pas de fonctionnalité supplémentaire.
Privilégie des changements petits, sûrs, lisibles et directement maintenables.
