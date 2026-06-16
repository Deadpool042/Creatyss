# Cadrage — `ai.core` premier usage métier explicite

**Date :** 2026-06-15
**Statut :** cadrage court + premier lot borné exécuté

## Objectif

Ouvrir un premier usage réel de `ai.core` sans dériver vers une "IA produit"
générique : une **suggestion SEO manuelle, revue par opérateur, sur fiche
produit**.

Le but n'est pas d'ajouter un assistant transversal ni un moteur de génération
autonome. Le but est de brancher une capacité explicite, traçable et bornée sur
une surface admin déjà existante.

## Recommandation

Premier lot recommandé : **`SEO_SUGGESTION` sur l'onglet SEO produit**.

Pourquoi ce choix :

- les champs cibles existent déjà et sont stables (`seoTitle`,
  `seoDescription`, `openGraphTitle`, `openGraphDescription`) ;
- la page produit SEO est déjà la plus structurée du périmètre : formulaire,
  prévisualisations SERP/social, checklist locale ;
- la décision finale reste humaine : aucune publication automatique ;
- `AiTask` possède déjà les colonnes nécessaires pour tracer une demande, son
  sujet, son entrée, sa sortie et son statut ;
- le risque métier est faible : une mauvaise suggestion n'altère ni stock,
  prix, checkout, ni storefront tant qu'elle n'est pas sauvegardée par
  l'opérateur.

## Constats repo

### Surface produit

- `app/admin/(protected)/catalog/products/[slug]/seo/page.tsx` porte déjà une
  page dédiée au SEO produit.
- `features/admin/products/components/editor/product-seo-tab.tsx` contient déjà
  des aides non-IA locales :
  - templates de titre/description ;
  - aperçu Google ;
  - aperçu partage ;
  - checklist heuristique.
- `features/admin/products/editor/services/product-update-services.ts` persiste
  déjà proprement `seoMetadata` pour le sujet `PRODUCT`.

### Surface blog

- `app/admin/(protected)/content/blog/[id]/page.tsx` et `new/page.tsx`
  exposent bien `seoTitle` / `seoDescription`.
- Mais cette surface est plus simple : pas de preview, pas de checklist, pas de
  panneau dédié. Elle constitue un bon **niveau suivant**, pas le premier point
  d'entrée.

### Surface SEO transverse

- `app/admin/(protected)/content/seo/page.tsx` reste en partie estimatif/mock
  sur les produits.
- Ce n'est donc pas un bon premier point d'entrée pour une génération assistée :
  il vaut mieux partir d'un écran de saisie réel, pas d'un cockpit agrégé.

### Modèle IA existant

- `prisma/optional/ai/ai.prisma` expose déjà `AiProvider` et `AiTask`.
- `AiTaskType.SEO_SUGGESTION` existe déjà.
- `AiTask` permet déjà de tracer :
  - `subjectType` / `subjectId` ;
  - `inputText` / `inputJson` ;
  - `outputText` / `outputJson` ;
  - statut et timestamps.

## Progression recommandée par niveau

### `basic`

Capacité ouverte :

- depuis l'onglet SEO produit, bouton explicite du type `Suggérer avec l'IA` ;
- génération manuelle, à la demande ;
- un seul sujet : `PRODUCT` ;
- une seule intention : proposition de `seoTitle` + `seoDescription` ;
- restitution dans l'UI sous forme de suggestion revue avant copie/application ;
- aucune écriture automatique dans `seoMetadata` ;
- création d'un `AiTask` traçable de type `SEO_SUGGESTION`.

Lot recommandé pour première implémentation réelle.

### `assistant`

Capacité ouverte :

- extension du même pattern au `BLOG_POST` ;
- possibilité de suggérer aussi `openGraphTitle` /
  `openGraphDescription` quand la surface source les expose ;
- amélioration UX de comparaison `valeur actuelle` vs `suggestion` ;
- éventuelle action explicite `Appliquer la suggestion` côté formulaire, toujours
  manuelle.

### `advanced`

Capacité ouverte :

- variantes multiples de suggestion ;
- historique local de suggestions par sujet ;
- choix explicite du provider actif si plusieurs `AiProvider` sont disponibles ;
- paramètres de génération bornés et compréhensibles par l'opérateur.

Ne pas ouvrir ce niveau avant d'avoir validé `basic` sur usage réel.

### `automation`

Capacité potentielle :

- suggestion auto après création/mise à jour d'un produit ;
- traitement différé via `jobs` / workflow ;
- signalement des fiches sans SEO complété.

Hors périmètre du premier usage. Niveau le plus risqué sur les plans bruit
opérationnel, gouvernance et coût.

## Intégration recommandée

### Queries / services

- query de gating dédiée sur `ai.core` déjà disponible ;
- nouvelle query bornée pour lire le contexte produit utile à la suggestion
  (`name`, `marketingHook`, `shortDescription`, `description`, type produit,
  catégorie primaire éventuelle si déjà triviale à lire) ;
- service dédié `requestProductSeoSuggestion` côté `features/ai-assistance` ou
  verticale bornée équivalente, sans mélanger logique provider dans le composant
  UI ;
- persistance d'un `AiTask` avant/pendant/après exécution selon statut.

### UI

- insertion dans `ProductSeoTab`, pas dans `/admin/content/seo` ;
- composant local de suggestion placé près des champs SEO, sans refondre
  l'onglet ;
- action explicitement manuelle ;
- affichage d'un état `en cours`, `succès`, `échec` ;
- possibilité de copier/remplir les champs du formulaire courant sans
  sauvegarde implicite.

### Données d'entrée minimales

- `product.name`
- `product.marketingHook`
- `product.shortDescription`
- `product.description`
- éventuellement signaux SEO déjà présents pour éviter une régression de ton

Ne pas injecter un contexte énorme au premier lot.

## Invariants

- aucune sortie IA ne devient vérité métier sans action explicite opérateur ;
- aucune mutation automatique de `seoMetadata` ;
- pas de dépendance UI sur un provider spécifique ;
- pas d'assistant global multi-écrans ;
- pas de lot "chat" ou "copilot" déguisé ;
- la traçabilité `AiTask` doit rester lisible même si la génération échoue ;
- l'indisponibilité de l'IA ne doit pas bloquer l'édition SEO manuelle.

## Hors périmètre

- génération produit complète ;
- enrichissement catalogue ;
- rédaction blog complète ;
- chat assistant admin ;
- automatisation sur événement ;
- classement, modération, embeddings ;
- ouverture storefront ;
- réglages avancés de prompting libre côté opérateur ;
- choix dynamique de providers si le repo n'a pas encore de doctrine active pour
  cela.

## Risques

- confusion entre "suggestion" et "auto-remplissage autoritaire" ;
- bruit UX si le composant prend trop de place dans l'onglet SEO ;
- ouverture implicite d'un contrat provider alors que `ai.core` n'a aujourd'hui
  qu'un référentiel admin ;
- tentation de brancher aussi blog + SEO global dans le même lot.

## Vérifications attendues

- typecheck ;
- test manuel ciblé sur fiche produit SEO avec `ai.core` inactif puis actif ;
- vérification qu'aucune action IA n'apparaît quand le feature flag est off ;
- vérification qu'une suggestion ne persiste rien sans sauvegarde explicite du
  formulaire ;
- vérification qu'un échec de génération laisse l'onglet SEO utilisable normalement ;
- si `AiTask` est effectivement persisté dans le premier lot, vérifier statut,
  sujet et payload minimal.

## Critères de fin du premier lot réel

- `ai.core` niveau `basic` a un effet métier observable ;
- cet effet est borné à l'onglet SEO produit ;
- la suggestion est manuelle, réversible et traçable ;
- aucun autre écran n'est impacté ;
- aucune automatisation n'est introduite ;
- la doctrine "IA produit reste hors périmètre hors cadrage dédié" reste vraie.

## Bilan d'exécution

Le premier lot `basic` a été implémenté sur l'onglet SEO produit.

### Ce qui est maintenant branché

- `app/admin/(protected)/catalog/products/[slug]/seo/page.tsx` lit
  `meetsFeatureLevel("ai.core", "basic")` ;
- `ProductSeoTab` affiche un panneau local `Suggérer avec l'IA` seulement quand
  ce niveau est actif ;
- la suggestion reste manuelle : elle propose un `seoTitle` et une
  `seoDescription`, puis l'opérateur choisit explicitement de remplir les
  champs du formulaire ;
- aucune écriture automatique de `seoMetadata` n'est faite ;
- chaque demande crée une trace `AiTask` de type `SEO_SUGGESTION` avec sujet
  `PRODUCT`, input minimal et output structuré.

### Décision d'implémentation effective

Faute de provider runtime déjà doctriné dans le repo, ce premier lot utilise
une **stratégie locale bornée** (`local-seo-suggestion-v1`) au lieu d'un appel
SDK externe.

Cela permet :

- un effet métier observable immédiat ;
- une traçabilité `AiTask` réelle ;
- aucune dépendance nouvelle ;
- aucune ouverture implicite d'un contrat provider non cadré.

### Ce qui reste hors lot

- provider SDK ;
- choix de modèle ;
- blog ;
- suggestions Open Graph/Twitter ;
- historique local de suggestions dans l'UI ;
- automatisation ;
- enrichissement produit au sens large.

### Vérifications exécutées

- `pnpm run typecheck` : OK
