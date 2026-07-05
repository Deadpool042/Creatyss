# Roadmap Creatyss

Ce document est une proposition de structuration. Toujours distinguer ce qui est Observé, Documenté, Déduit ou Proposition.

---

## État synthétique des horizons

| Horizon | Titre                        | Statut                                                              |
| ------- | ---------------------------- | ------------------------------------------------------------------- |
| H1      | Boutique vendable            | En cours — paiement live, VPS et recette finale à clôturer          |
| H2      | Commerce fiable              | En cours — conformité externe et validations finales                |
| H3      | Administration avancée       | Livré côté code — activation prod automations et retry conditionnel |
| H4      | Plateforme et automatisation | En cours — modules L3 lisibles, activations avancées à faire        |

Les horizons H1 initial, H2 initial, H3 initial (VPS) et H4 initial (socle clonable) ont été portés par `projet-creatyss.md`. Leur état est documenté dans ce fichier et dans `2026-06-13-audit-catalogue-modules.md`. Les horizons listés ici sont la suite directe, numérotés H1–H4 pour désigner la nouvelle séquence de valeur à livrer.

---

## Note sur la priorisation

Les horizons sont ordonnés par valeur métier : H1 (mise en production) déboque H2 (commerce légal), qui débloque H3 (admin enrichie). H4 regroupe des capacités à plus long terme qui peuvent avancer en parallèle sur certains lots dès que les prérequis techniques sont satisfaits.

Il n'existe pas de règle rigide de séquencement interne à chaque horizon. Des micro-lots non bloquants peuvent avancer en parallèle lorsqu'ils n'ont pas de dépendance sur un lot précédent. Cela est signalé dans chaque fichier de lot concerné.

---

## Chantiers cross-cutting

Chantiers hors séquence H1-H4 de valeur métier, pouvant avancer en parallèle sans dépendre de l'ordre de priorisation ci-dessus.

| Chantier                          | Titre                                                                                               | Statut                                                                                                                                                                                              |
| --------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| UX admin/storefront               | Navigation admin et complétude storefront                                                           | Terminé — navigation admin fusionnée, audit storefront livré (1 bug corrigé)                                                                                                                        |
| Gouvernance & réglages admin      | Lisibilité gouvernance fonctionnalités, réglages métier manquants                                   | Terminé — 4 lots livrés (lisibilité niveaux, clarification nav, livraison zones/méthodes, statut paiement carte)                                                                                    |
| Audit design admin                | Lisibilité et responsive du layout admin (dashboard, listes, détail commande)                       | Terminé — 5 micro-lots livrés (dashboard aplati, duplication liste/overview corrigée, réglages vérifiés conformes, détail commande en onglets, grilles non responsive corrigées)                    |
| Refonte composition admin (macOS) | Toolbar unifiée, patterns de liste, navigation réglages — parité WooCommerce                        | Terminé — 11 lots livrés (2026-07-05) : toolbar unifiée, listes commandes/catégories, hub settings, dashboard, reflows mobiles, discounts et blog outillés, breadcrumbs généralisés + hub catalogue |
| Doctrine domaines admin           | Étendre la doctrine UI/UX catalog (nav, hubs configuration, statuts par niveau) aux autres domaines | Terminé — lots A-H livrés + navs de domaine commerce/content/marketing, 5 décisions actées, écarts consignés soldés (clos le 2026-07-05)                                                            |

- [UX — Navigation admin et complétude storefront](./ux-admin-storefront/README.md)
- [Gouvernance des fonctionnalités et complétude des réglages admin](./gouvernance-reglages-admin/README.md)
- [Audit design admin — 2026-07-03](../audit/2026-07-03-audit-design-admin.md)
- [Refonte composition admin — style macOS](./admin-design-macos/README.md)
- [Doctrine domaines admin — extension de la doctrine catalog](./doctrine-domaines-admin/README.md)

---

## Navigation

### Fichiers existants (ne pas modifier)

- [projet-creatyss.md](./projet-creatyss.md) — roadmap historique H1–H4 initiaux, cases validées
- [2026-06-13-audit-catalogue-modules.md](./2026-06-13-audit-catalogue-modules.md) — état de 32/32 modules au 2026-06-17

### Horizons de la nouvelle séquence

- [H1 — Boutique vendable](./h1-boutique-vendable/README.md)
- [H2 — Commerce fiable](./h2-commerce-fiable/README.md)
- [H3 — Administration avancée](./h3-administration-avancee/README.md)
- [H4 — Plateforme et automatisation](./h4-plateforme-automatisation/README.md)

---

Ce document est une proposition de structuration. Distinguer ce qui est Observé, Documenté, Déduit ou Proposition.
