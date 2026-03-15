# V13 — UI hardening and structural CSS clarification

## Contexte

La V12 a permis de faire un gros travail de migration UI sur Creatyss :

- migration d’une large partie des écrans admin
- migration des principaux écrans storefront
- adoption progressive des composants shadcn utiles
- stabilisation de composants réutilisables côté admin
- suppression d’un volume important de CSS legacy

À l’issue de V12, le projet n’est plus dans un état de transition chaotique.
La base UI est désormais beaucoup plus propre, mais il reste encore un ensemble de styles custom actifs, surtout sur des zones structurelles storefront et quelques patterns de présentation résiduels.

La V13 ne doit donc pas partir immédiatement sur du paiement réel ou sur un nouveau chantier métier lourd.

La priorité reste de **terminer proprement le durcissement UI**, afin de sortir avec une base visuelle explicite, stable et assumée.

---

## Objectif de V13

La V13 vise à :

- finaliser le nettoyage des derniers patterns UI encore hybrides
- distinguer clairement le CSS structurel légitime du legacy encore améliorable
- réduire les derniers patterns globaux simples quand le gain est réel
- stabiliser les conventions UI du projet
- sortir de la phase de migration avec une base claire et durable

La V13 ne cherche pas à refaire une grande refonte visuelle.
Elle cherche à **terminer correctement** ce qui a été engagé en V12.

---

## Ce que V13 n’est pas

V13 n’est pas :

- une refonte complète du storefront
- un redesign global
- une nouvelle vague de composants abstraits
- une extraction registry
- un chantier paiement/commande avancé
- un nettoyage “pour nettoyer”

Chaque changement V13 doit être justifié par un gain réel de clarté, de cohérence ou de maintenabilité.

---

## Constats à l’entrée de V13

Après V12, le projet présente trois catégories de styles :

### 1. Composants UI stabilisés

Ces composants sont désormais confirmés par plusieurs usages :

- `AdminPageShell`
- `AdminFormSection`
- `AdminFormField`
- `AdminFormActions`
- `Notice`
- `Button`
- `Badge`
- `Input`
- `Label`

Ils constituent la base UI actuelle du projet.

### 2. CSS structurel encore vivant et légitime

Certaines classes globales restent actives mais ne sont plus considérées comme de la dette prioritaire, par exemple :

- `.cart-*`
- `.checkout-*`
- `.product-*`
- `.variant-*`
- `.article-*`
- `.store-card`
- `.card-grid`
- `.empty-state`
- `.card-kicker`
- `.card-meta`
- `.card-copy`
- `.variant-meta`

Ces styles portent encore une partie de la structure du storefront et restent acceptables tant qu’ils sont :

- actifs
- lisibles
- stables
- sans friction majeure

### 3. Patterns encore perfectibles

Il reste quelques patterns globaux simples qui peuvent encore être réduits ou clarifiés :

- `.meta-label`
- `.eyebrow` dans quelques composants résiduels
- `.lead` sur certaines pages éditoriales
- quelques labels implicites ou conventions de formulaire storefront

Ces points ne relèvent pas d’une urgence produit, mais d’un **hardening final**.

---

## Objectif concret de V13

V13 doit répondre à la question suivante :

> Qu’est-ce qui mérite encore d’être migré ou simplifié, et qu’est-ce qui doit désormais être considéré comme une base structurelle stable du projet ?

Autrement dit, V13 sert à fermer proprement la phase UI.

---

## Axes de travail

### Axe 1 — Derniers patterns globaux simples

Traiter les derniers patterns encore faciles à améliorer sans risque élevé.

Exemples :

- `.meta-label` côté storefront
- `.eyebrow` dans les derniers composants résiduels
- `.lead` lorsqu’il ne sert plus qu’à un ou deux usages isolés
- petits écarts d’accessibilité ou de labels sur les formulaires storefront

### Axe 2 — Clarification du CSS structurel storefront

Faire un audit explicite des classes encore structurelles :

- `.cart-*`
- `.checkout-*`
- `.product-*`
- `.variant-*`
- `.article-*`

L’objectif n’est pas nécessairement de les supprimer.
L’objectif est de décider clairement :

- ce qui reste volontairement en CSS global
- ce qui mérite encore une migration
- ce qui peut être laissé tel quel sans dette significative

### Axe 3 — Stabilisation documentaire

Documenter la fin du chantier UI :

- conventions désormais retenues
- composants stabilisés
- classes globales conservées volontairement
- zones encore structurelles
- limites connues mais acceptées

---

## Principes de travail

Chaque lot V13 doit respecter les règles suivantes :

- petit incrément uniquement
- pas de changement métier
- pas de changement serveur
- pas de nouvelle dépendance
- pas d’abstraction prématurée
- pas de nouveau grand chantier visuel
- suppression CSS seulement si la règle est réellement morte
- priorité à la lisibilité du code

---

## Ordre recommandé

### V13-1 — Stable pattern cleanup

Poursuivre les derniers nettoyages à faible risque :

- `.meta-label`
- `.eyebrow` résiduel
- `.lead` isolé
- petits ajustements de formulaires storefront

### V13-2 — Structural storefront CSS audit

Audit ciblé des classes structurelles encore présentes pour décider explicitement :

- à conserver
- à simplifier
- à migrer plus tard
- ou à considérer comme base stable

### V13-3 — UI closeout documentation

Formaliser l’état final du chantier UI :

- base retenue
- composants stabilisés
- CSS structurel conservé
- conventions officielles pour la suite

---

## Ce qui viendra après V13

Une fois V13 terminé, le projet pourra revenir sur des priorités plus métier, notamment :

- paiement réel
- gestion des stocks
- durcissement des flux commande
- robustesse transactionnelle

Mais ces sujets ne doivent commencer qu’une fois la base UI considérée comme suffisamment clôturée.

---

## Résultat attendu

À la fin de V13, Creatyss doit disposer :

- d’une UI stabilisée
- d’un socle visuel clair
- d’un CSS global restant assumé et documenté
- de composants réutilisables confirmés
- d’une base suffisamment propre pour que la priorité redevienne le produit, pas l’interface
