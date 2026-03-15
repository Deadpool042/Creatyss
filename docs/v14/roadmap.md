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

## V14-1 — `.meta-label` storefront cleanup

### Objectif

Supprimer `.meta-label` côté storefront en remplaçant ses usages par du Tailwind local explicite.

### Périmètre attendu

Écrans typiquement concernés :

- `/boutique/[slug]`
- `/panier`
- `/checkout`
- `/checkout/confirmation/[reference]`

### Intention

Ce lot vise une famille encore très visible et encore diffusée sur plusieurs écrans, mais qui reste compréhensible et traitable de manière ciblée.

### Attendus

- audit des usages réels
- remplacement local cohérent
- suppression de la règle CSS si elle devient réellement morte
- aucun changement métier ni structurel majeur

### Risque principal

Créer des écarts visuels entre les contextes storefront si le remplacement n’est pas suffisamment homogène.

---

## V14-2 — Storefront text/meta cleanup

### Objectif

Traiter les autres classes de texte et métadonnées encore globales si leur remplacement local devient suffisamment simple.

### Cibles probables

- `.card-kicker`
- `.card-meta`
- `.card-copy`
- `.variant-meta`

### Intention

Réduire les derniers styles typographiques partagés quand ils n’apportent plus assez de valeur pour rester globaux.

### Attendus

- audit des usages
- qualification par famille
- remplacement local si le ratio gain / risque est bon
- cleanup CSS uniquement si une famille devient réellement morte

### Risque principal

Multiplier les styles inline hétérogènes si le lot n’est pas mené de façon cohérente.

---

## V14-3 — Simple public layout helpers cleanup

### Objectif

Réduire certaines classes de structure légère encore présentes sur les pages publiques.

### Cibles probables

- `.empty-state`
- `.card-grid`
- `.store-card`

### Intention

Tester jusqu’où les helpers de layout simples peuvent être remplacés proprement sans dégrader la lisibilité ni provoquer une duplication excessive.

### Attendus

- audit des usages réels
- décision explicite par famille
- cleanup ciblé seulement si le remplacement local reste sobre

### Risque principal

Transformer des helpers stables et utiles en duplication diffuse sans gain réel.

---

## V14-4 — Dense storefront structure cleanup

### Objectif

Aborder les familles de classes storefront plus structurelles et plus denses, uniquement si les lots précédents montrent que le coût reste acceptable.

### Cibles probables

- `.product-*`
- `.variant-*`
- `.cart-*`
- `.checkout-*`

### Intention

Ne traiter ce niveau que si le projet montre qu’il est possible d’aller plus loin sans casser la maintenabilité.

### Attendus

- audit précis par sous-famille
- décision explicite sur ce qui peut être remplacé et ce qui doit rester
- aucun chantier global incontrôlé

### Risque principal

Rouvrir de fait une refonte complète du storefront sous prétexte de cleanup CSS.

---

## V14-5 — Editorial cleanup

### Objectif

Traiter éventuellement les classes éditoriales restantes si elles sont peu nombreuses et encore simplifiables.

### Cibles probables

- `.article-*`

### Intention

Clore proprement les reliquats éventuels du côté éditorial, sans priorité absolue.

### Attendus

- audit de l’intérêt réel
- cleanup seulement si le bénéfice est net

### Risque principal

Passer du temps sur une zone stable qui n’apporte qu’un gain marginal.

---

## V14-6 — Final audit

### Objectif

Faire l’audit final du CSS custom restant après les lots précédents.

### Attendus

- état des lieux final
- liste des règles supprimées pendant V14
- liste du CSS restant
- qualification explicite de ce qui est conservé
- préparation de la sortie de V14

### Intention

Marquer la fin de la phase d’élimination du CSS custom et clarifier ce qui reste comme base structurelle minimale ou comme choix assumé.

---

## Ordre recommandé

1. V14-1 — `.meta-label` storefront cleanup
2. V14-2 — Storefront text/meta cleanup
3. V14-3 — Simple public layout helpers cleanup
4. V14-4 — Dense storefront structure cleanup
5. V14-5 — Editorial cleanup
6. V14-6 — Final audit

## Sortie attendue de V14

À la fin de la V14, Creatyss doit disposer :

- d’un CSS custom fortement réduit
- d’un markup plus explicite localement
- d’un nombre limité de classes globales encore justifiées
- d’une base frontend plus proche d’un fonctionnement presque entièrement piloté par Tailwind et les composants UI déjà stabilisés

## Suite logique après V14

Une fois la réduction du CSS custom menée aussi loin que raisonnablement possible, le projet pourra revenir à des sujets plus directement métier, par exemple :

- paiement réel
- gestion de stock
- robustesse des flux commande
- durcissement fonctionnel de l’admin et du storefront
