# Gouvernance des fonctionnalités et complétude des réglages admin

Chantier cross-cutting, hors séquence H1-H4 de valeur métier. Déclenché par un retour utilisateur (2026-07-03) sur `/admin/settings/advanced/core/*` : écran jugé peu intuitif, avec l'impression qu'il manque des paramètres par rapport à un back-office standard (référence citée : WooCommerce).

## Objectif produit

Deux objectifs distincts, à ne pas confondre :

1. Rendre le panneau de gouvernance des fonctionnalités (`/admin/settings/advanced/**`) réellement lisible pour une utilisatrice non technique : pour chaque fonctionnalité graduée, elle doit voir le toggle (actif/inactif), le niveau courant, et — pour **chaque niveau possible, pas seulement le niveau courant** — ce qu'il fait et ce qu'il apporte.
2. Combler les manques réels de configurabilité métier identifiés par l'audit (livraison, paiement carte), localisés et non généralisés.

## État observé (2026-07-03)

Audit complet réalisé en lecture seule (Phase 1 du protocole `settings/*`, cf. `docs/roadmap/README.md` et mémoire projet `feedback-settings-protocol`). Constats principaux, avec preuve fichier :

### Gouvernance des fonctionnalités — lisibilité insuffisante (confirmé)

- `/admin/settings/advanced/**` est le panneau de **gouvernance des feature flags/gradation**, doctrine décrite dans `docs/domains/cross-cutting/feature-governance.md`. Ce n'est pas un écran de configuration de valeurs métier — le lien "Tarification" observé sur la capture renvoie vers l'écran métier réel (`/admin/catalog/pricing`). Rien ne signale cette distinction à l'écran.
- Les descriptions par niveau **existent déjà** en données (`levelDescriptions` dans `features/admin/pilotage/catalog/feature-catalog.ts`, ex. pour `catalog.products.pricing` : `base-price` → "Tarif boutique par défaut sur la fiche produit, sans grilles avancées.", `price-lists` → "Ajoute la gestion des listes de prix et des tarifs multi-grilles.", `scheduled-pricing` → "Ajoute les fenêtres tarifaires datées sur les prix produit déjà gérés."), mais l'UI (`features/admin/pilotage/components/settings-advanced/feature-flag-level-select.tsx`) n'affiche que la description du **niveau actuellement sélectionné** — impossible de comparer les niveaux avant de changer.
- Les libellés de niveau affichés dans le menu déroulant sont les codes bruts (`base-price`, `price-lists`, `scheduled-pricing`), simplement capitalisés par `humanizeLevel()` (même fichier), jamais traduits — d'où l'affichage en anglais au milieu d'une UI française, visible sur la capture d'écran fournie par l'utilisateur.

### Réglages métier — manques réels et localisés (confirmé, partiel)

- **Livraison** : les modèles Prisma `ShippingZone`/`ShippingMethod` (`prisma/optional/commerce/shipping.prisma`) supportent plusieurs zones et méthodes, mais `update-admin-shipping-settings.action.ts` fait un `upsert` codé en dur sur une unique zone `"FR"` et deux méthodes fixes (`STANDARD`/`FREE`). Aucune UI pour créer une zone UE/international ou une méthode supplémentaire.
- **Paiement carte (Stripe)** : du code Stripe existe côté checkout (`features/commerce/payment/stripe-checkout-session-state.ts`), mais aucun écran admin ne permet de voir ou piloter ce moyen de paiement — contrairement au virement et au paiement à la livraison qui ont chacun un toggle dans `payment-settings-form.tsx`.
- **Taxation par catégorie** et **historique/RGPD client** : déjà annoncés "à venir" explicitement dans le code lui-même (`commerce/taxation/page.tsx`, `AdminComingSoon` sur `commerce/customers/settings`) — pas une découverte de cet audit, pas un gap à traiter en urgence.

---

## Dépendances

- Le lot livraison et le lot paiement carte sont indépendants l'un de l'autre et du lot gouvernance — aucun ordre imposé entre eux.
- Le lot paiement carte nécessite une décision produit préalable (cf. `lot-decision-paiement-carte.md`) avant tout code.

---

## Lots

| Fichier                                                                          | Description                                                                                                         | Statut             |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------ |
| [lot-gouvernance-lisibilite-niveaux.md](./lot-gouvernance-lisibilite-niveaux.md) | Rendre lisible, pour chaque niveau d'une fonctionnalité graduée, ce qu'il fait et ce qu'il apporte, avant sélection | Livré — 2026-07-03 |
| [lot-nav-avance-clarification.md](./lot-nav-avance-clarification.md)             | Signaler visuellement que "Avancé" est un panneau technique, distinct des réglages métier                           | Livré — 2026-07-03 |
| [lot-livraison-zones-methodes.md](./lot-livraison-zones-methodes.md)             | UI de gestion de plusieurs zones et méthodes de livraison — périmètre admin, sélection géographique hors périmètre  | Livré — 2026-07-03 |
| [lot-decision-paiement-carte.md](./lot-decision-paiement-carte.md)               | Décision produit : exposer ou non Stripe/carte dans l'admin — résolu par un indicateur de statut                    | Livré — 2026-07-03 |

Taxation par catégorie et historique/RGPD client : non repris ici, déjà cadrés comme "à venir" ailleurs dans le repo (cf. état observé ci-dessus) — pas de nouveau lot nécessaire pour l'instant.

---

## Risques

- Le lot gouvernance touche un composant partagé par toutes les fonctionnalités graduées (`feature-flag-level-select.tsx`) — changement transversal à faible risque fonctionnel (affichage seul) mais à vérifier sur plusieurs familles de features, pas seulement `pricing`.
- Le lot livraison touche une action serveur existante utilisée en production (frais de port, seuil de livraison offerte) — migration de logique à traiter avec précaution, sans régression sur la configuration `"FR"` actuelle.
- Le lot paiement carte ne doit pas démarrer de code avant arbitrage explicite du propriétaire produit.

---

## Éléments reportables sans bloquer la valeur

- Taxation par catégorie (déjà annoncée "à venir").
- Historique/RGPD client (déjà cadré dans `docs/roadmap/h3-administration-avancee/lot-clients-historique-crm.md`).
