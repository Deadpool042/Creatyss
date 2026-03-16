# Roadmap V14

## Objectif général

La V14 poursuit le travail engagé en V12 puis clarifié en V13.

Son objectif n’est plus de migrer l’UI au sens large, mais d’éliminer progressivement les dernières familles de CSS custom encore actives, lorsque leur remplacement local est suffisamment lisible, sûr et maintenable.

La V14 doit permettre de réduire fortement la dépendance au CSS global pour les patterns de présentation courants, sans rouvrir de refonte brutale et sans toucher au métier.

## Principes de travail

Chaque lot V14 doit respecter les règles suivantes :

- une famille de classes à la fois
- pas de changement métier
- pas de changement de logique serveur
- pas de nouvelle dépendance
- pas de nouveau composant abstrait sans nécessité forte
- pas de refonte large d’écran sans gain net
- suppression CSS seulement si la règle devient réellement morte
- lisibilité du markup et du code avant tout

## État du chantier après les premiers lots

Les premiers lots V14 ont déjà permis de supprimer plusieurs familles de classes de présentation simples.

Mais le chantier n’est pas terminé.

Le CSS custom restant n’est plus composé principalement de petits helpers triviaux. Il reste encore :

- du shell public
- des surfaces partagées
- des helpers admin encore portés par du global CSS
- des structures storefront plus denses
- plusieurs sélecteurs groupés qui empêchent de considérer le chantier comme clos

En conséquence, la V14 doit être prolongée au-delà de son premier audit final prévu initialement.

## Lecture des familles restantes

Le CSS custom encore présent se répartit désormais en quatre groupes :

### 1. Thème et fondations globales

Ces éléments ne sont pas la cible de V14 :

- variables `:root`
- mode `.dark`
- `@theme inline`
- `@layer base`
- resets globaux utiles

### 2. Shell public et surfaces simples

Encore traitables sans refonte lourde :

- `.site`
- `.site-header`
- `.site-main`
- `.page`
- `.hero`
- `.hero-copy`
- `.card`
- `.section`
- `.shell`
- `.shell-drawer`

### 3. Helpers et surfaces admin encore globales

Encore présentes mais potentiellement remplaçables par du Tailwind local ou des composants déjà stabilisés :

- `.admin-area`
- `.admin-field`
- `.admin-actions`
- `.admin-product-subsection`
- `.admin-product-card`
- `.admin-blog-card`
- `.admin-variant-card`
- `.admin-image-card`

### 4. Structures storefront denses

Toujours actives et plus coûteuses à supprimer :

- `.store-card`
- `.variant-card`
- `.product-panel`
- `.product-summary*`
- `.cart-*`
- `.checkout-*`
- `.product-gallery`
- `.variant-images`
- `.variant-media`
- `.product-media`
- `.article-cover`

## Ce que V14 a déjà traité

### V14-1 — `.meta-label` storefront cleanup

Terminé.

### V14-1B — Admin `meta-label` cleanup

Terminé.

### V14-2 — Storefront text/meta cleanup

Terminé partiellement avec suppression de :

- `.card-kicker`
- `.card-meta` côté storefront
- `.variant-meta`

Conservation explicite de `.card-copy`.

### V14-3 — Simple public layout helpers cleanup

Terminé partiellement avec suppression de :

- `.card-grid`

Conservation explicite de :

- `.store-card`
- `.empty-state`

### V14-4 — Dense storefront structure cleanup

Terminé partiellement avec suppression de :

- `.product-layout`
- `.product-price`
- `.variant-badges`

### V14-5 — Editorial cleanup

Terminé partiellement avec suppression de :

- `.article-layout`
- `.article-content`

## Refonte de la deuxième moitié de V14

Le lot initialement prévu comme audit final ne suffit plus à clôturer le chantier si l’objectif reste bien de supprimer presque tout le CSS custom encore remplaçable.

La roadmap V14 est donc prolongée avec une seconde vague plus structurelle.

## V14-6A — Easy cleanup audit

### Statut

Déjà effectué.

### Rôle

Constater qu’il n’y avait plus de suppressions triviales immédiates à ce stade.

### Limite

Ce lot ne doit plus être considéré comme la clôture effective de V14, mais comme la fin de la phase de nettoyage simple.

---

## V14-6B — Public shell and surface cleanup

### Objectif

Réduire le CSS global encore présent sur les wrappers et surfaces publiques simples, sans refondre les pages.

### Cibles probables

- `.site`
- `.site-header`
- `.site-main`
- `.page`
- `.hero`
- `.hero-copy`
- `.card`
- `.section`
- `.shell`
- `.shell-drawer`

### Intention

Faire tomber les classes globales les plus transverses qui sont encore simples à réexprimer localement ou via les primitives déjà stabilisées.

### Risque principal

Créer de la duplication diffuse sur plusieurs pages si le lot est mené sans discipline.

---

## V14-6C — Admin utility cleanup

### Objectif

Supprimer autant que possible les helpers admin encore portés par le CSS global lorsqu’ils sont déjà redondants avec Tailwind ou les composants admin stabilisés.

### Cibles probables

- `.admin-area`
- `.admin-field`
- `.admin-actions`
- `.admin-product-subsection`
- `.admin-product-card`
- `.admin-blog-card`
- `.admin-variant-card`
- `.admin-image-card`

### Intention

Profiter de la maturité de `AdminPageShell`, `AdminFormField`, `AdminFormActions` et des autres composants admin pour réduire encore le global CSS côté back-office.

### Risque principal

Faire un cleanup incohérent si le markup conserve des noms de classe no-op sans suppression coordonnée.

---

## V14-7 — Shared surface groups cleanup

### Objectif

Traiter les gros sélecteurs groupés encore présents dans `globals.css` et casser les dépendances artificielles entre familles de composants différentes.

### Cibles probables

Exemples de groupes encore structurants :

- `.hero, .section, .card`
- `.store-card, .variant-card, .empty-state`
- `.store-card, .variant-card, .product-panel, .empty-state`
- `.hero-media, .media-placeholder, .product-media, .article-cover`
- `.hero-media, .product-media, .article-cover, .variant-media`
- `.media-image, .product-media img, .article-cover img, .variant-media img`

### Intention

Rendre explicites les responsabilités CSS restantes au lieu de conserver de grands groupes hérités qui bloquent les suppressions fines.

### Risque principal

Introduire une fragmentation inutile si les groupes sont cassés sans stratégie de remplacement claire.

---

## V14-8 — Cart and checkout structure cleanup

### Objectif

Aborder les familles encore actives du panier et du checkout, qui restent largement structurées par le CSS global.

### Cibles probables

- `.cart-page`
- `.cart-layout`
- `.cart-list`
- `.cart-summary`
- `.cart-line`
- `.cart-add-form`
- `.cart-line-form`
- `.checkout-layout`
- `.checkout-form`
- `.checkout-summary`
- `.checkout-line-list`
- `.checkout-line`

### Intention

Réduire la dépendance au CSS global sur les flux transactionnels sans casser la lisibilité ni le responsive.

### Risque principal

Rouvrir de fait une refonte du panier et du checkout si le lot devient trop large.

---

## V14-9 — Product and variant structure cleanup

### Objectif

Poursuivre la réduction du CSS global sur la fiche produit et les variantes, uniquement sur les sous-familles réellement remplaçables.

### Cibles probables

- `.product-gallery`
- `.product-panel`
- `.product-summary`
- `.product-summary-header`
- `.product-summary-stats`
- `.product-summary-stat`
- `.product-copy`
- `.variant-list`
- `.variant-card`
- `.variant-header`
- `.variant-purchase`
- `.variant-details`
- `.variant-detail`
- `.variant-images`
- `.variant-media`

### Intention

Finir proprement la zone storefront produit/variante autant que raisonnablement possible, sans sacrifier les sélecteurs e2e ni les layouts stables.

### Risque principal

Dégrader la maintenabilité du JSX si le remplacement local devient trop lourd.

---

## V14-10 — Real final audit

### Objectif

Établir le véritable audit final du CSS custom restant après toute la seconde vague V14.

### Attendus

- état des lieux final
- liste des règles supprimées pendant toute la V14
- qualification du CSS restant
- identification explicite du résiduel assumé
- conclusion claire sur la fin réelle du chantier CSS

### Intention

Marquer la fin effective de la phase d’élimination du CSS custom, avec une lecture honnête de ce qui reste encore structurellement justifié.

---

## Ordre recommandé actualisé

1. V14-1 — `.meta-label` storefront cleanup
2. V14-1B — Admin `meta-label` cleanup
3. V14-2 — Storefront text/meta cleanup
4. V14-3 — Simple public layout helpers cleanup
5. V14-4 — Dense storefront structure cleanup
6. V14-5 — Editorial cleanup
7. V14-6A — Easy cleanup audit
8. V14-6B — Public shell and surface cleanup
9. V14-6C — Admin utility cleanup
10. V14-7 — Shared surface groups cleanup
11. V14-8 — Cart and checkout structure cleanup
12. V14-9 — Product and variant structure cleanup
13. V14-10 — Real final audit

## Sortie attendue de V14

À la fin de la V14, Creatyss doit disposer :

- d’un CSS custom fortement réduit
- d’un markup plus explicite localement
- d’un nombre très limité de classes globales encore justifiées
- d’une séparation plus claire entre thème global, structure indispensable et styles de présentation courants
- d’une base frontend suffisamment propre pour que la dette CSS ne soit plus un sujet prioritaire

## Suite logique après V14

Une fois la réduction du CSS custom menée aussi loin que raisonnablement possible, le projet pourra revenir à des sujets plus directement métier, par exemple :

- paiement réel
- gestion de stock
- robustesse des flux commande
- durcissement fonctionnel de l’admin et du storefront
