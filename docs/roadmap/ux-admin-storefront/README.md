# UX — Navigation admin et complétude storefront

Chantier cross-cutting, hors séquence H1-H4 de valeur métier. Déclenché par la mise en pause de H4 (Plateforme et automatisation).

## Objectif métier

Simplifier la navigation admin pour qu'une utilisatrice non technique s'y retrouve sans effort, et combler les manques identifiés côté storefront public.

Ce chantier ne redéfinit pas le design system visuel (tokens, thème). Garde-fou explicite (`docs/architecture/90-reference/design-system.md`, section "Règle de maintenance") : "ne plus lancer de lot design system large sans problème transversal démontré". Ce chantier est de l'information architecture et de la complétude fonctionnelle, pas une refonte visuelle.

---

## État observé (2026-07-02)

### Volet Admin — navigation confuse et trop complexe

Confirmé par l'utilisateur : profondeur ET manque de logique de regroupement.

- 8 groupes top-level observés dans `features/admin/navigation/utils/admin-navigation.data.ts` : Tableau de bord, Catalogue, Commerce, Contenu, Marketing, Pilotage, Maintenance, Réglages.
- Le groupe Réglages duplique quasi item pour item les groupes métier : `catalog-settings` (`/admin/settings/catalog`), `orders-settings` (`/admin/settings/orders`), `customers-settings` (`/admin/settings/customers`), `media-settings` (`/admin/settings/media`) existent en parallèle de `/admin/catalog`, `/admin/commerce/orders`, `/admin/commerce/customers`, `/admin/catalog/media` — un même domaine vit à deux endroits, sans distinction explicite pour l'utilisatrice entre "gérer" et "configurer".
- "Vue d'ensemble" (ou "Vue d'ensemble" orthographe variable dans le code) répété comme intitulé d'item dans 5 groupes différents (catalog, commerce, content, marketing, settings) sans différenciation visible entre eux.
- Profondeur produit observée : `app/admin/(protected)/catalog/products/[slug]/{edit,availability,categories,characteristics,inventory,media,preview,pricing,related,seo,variants}` — 11 sous-routes pour une seule fiche produit.
- Routes parallèles `@list`/`@detail` observées dans categories, orders, et settings/advanced — complexité structurelle additionnelle.

### Volet Storefront — complétude

Pas de problème de navigation signalé sur ce volet.

- Le storefront public (`app/(public)/**`) couvre déjà, observé par arborescence : boutique, boutique/[slug], catégories, blog, blog/[slug], checkout, checkout/confirmation, panier, favoris, contact, compte, mentions-legales, conditions-generales-de-vente, politique-confidentialite, politique-retour, a-propos, les-marches.
- Écart concret observé : `app/(public)/compte/page.tsx` n'offre qu'une recherche de commande par référence (formulaire GET vers `/checkout/confirmation`). Une section "Espace client complet" (historique, adresses, préférences) est un stub explicite marqué "À venir" dans le code (badge visuel + texte "Disponible prochainement").
- Note de doc potentiellement obsolète : `docs/roadmap/projet-creatyss.md` (ligne 48) mentionne des "Liens de navigation storefront 'Bientôt' (périmètre commerce non encore ouvert)". Une recherche dans `app/(public)/**` ne retourne aucune occurrence de ce pattern dans le code actuel. Cette ligne de `projet-creatyss.md` est vraisemblablement périmée — signalé ici comme risque/note, sans modification de `projet-creatyss.md` (fichier "existant, ne pas modifier" selon `docs/roadmap/README.md`).

---

## Dépendances

- Le volet "espace client" storefront dépend d'une décision produit sur l'authentification client (H2 actuel = checkout invité uniquement, pas de compte connecté observé) — à trancher avant tout sous-lot d'implémentation.

---

## Lots

| Fichier                                                                    | Description                                                                       | Statut                                                                            |
| -------------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| [lot-audit-navigation-admin.md](./lot-audit-navigation-admin.md)           | Cartographie complète et factuelle de la navigation admin actuelle                | Livré — 2026-07-02, cf. [audit](../../audit/2026-07-02-audit-navigation-admin.md) |
| [lot-decision-ia-admin.md](./lot-decision-ia-admin.md)                     | Décision produit sur la restructuration de la navigation admin (pas de code)      | À faire — bloqué par lot-audit-navigation-admin                                   |
| [lot-implementation-nav-admin.md](./lot-implementation-nav-admin.md)       | Micro-lots d'implémentation de la nouvelle navigation, groupe par groupe          | À faire — bloqué par lot-decision-ia-admin                                        |
| [lot-audit-completude-storefront.md](./lot-audit-completude-storefront.md) | Vérifier chaque page publique contre les horizons H1-H4 livrés, lister les écarts | À faire                                                                           |

---

## Risques

- Toucher à la navigation admin est un changement transversal à haut risque de régression (tous les écrans en dépendent) — d'où le découpage strict audit → décision validée par l'humain → implémentation en micro-lots par groupe, jamais de big-bang.
- L'espace client storefront touche potentiellement à l'authentification — périmètre à cadrer avec précision avant tout code.
- `docs/roadmap/projet-creatyss.md` contient possiblement une mention obsolète ("liens de navigation storefront 'Bientôt'") non retrouvée dans le code — à vérifier lors d'un lot documentaire dédié, ce fichier n'étant pas modifiable dans le cadre de ce chantier.

---

## Éléments reportables sans bloquer la valeur

- Refonte visuelle / design system (hors périmètre, cf. garde-fou).
- Authentification client complète, si la décision produit penche pour un accès enrichi par email + référence plutôt qu'un vrai compte connecté.
