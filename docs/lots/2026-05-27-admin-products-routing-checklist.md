# Checklist lot — admin products routing shell

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-routing-roadmap.md`
- [x] relire la doc structurante produits, capabilities, pricing, availability, categories
- [x] vérifier les fichiers déjà modifiés dans la zone `admin products`
- [x] confirmer que le lot reste strictement navigation + shell

---

## Audit d'entrée

- [x] lister tous les hrefs `/admin/products` encore présents dans la zone produits
- [x] vérifier la route réelle exposée par `app/admin/(protected)/catalog/products/**`
- [x] vérifier la navigation canonique actuelle dans `features/admin/navigation`
- [x] vérifier les redirects produits existants
- [x] vérifier les breadcrumbs produits existants

---

## Cadrage technique

- [x] fixer une route canonique unique
- [x] décider l'emplacement du resolver de capabilities produit
- [x] décider l'emplacement de la navigation secondaire produit
- [x] définir le contrat de données minimal du futur `[slug]/layout.tsx`
- [x] confirmer que le layout ne charge pas de données lourdes

---

## Exécution

- [x] corriger la navigation admin produits vers la route canonique
- [x] corriger les hrefs visibles dans la liste produits
- [x] corriger les hrefs visibles dans l'éditeur et l'aperçu produits
- [x] créer `app/admin/(protected)/catalog/products/[slug]/layout.tsx`
- [x] ajouter le résumé produit léger dans le layout
- [x] ajouter la navigation secondaire route-based dans le layout
- [x] ajouter un resolver minimal de capabilities produit
- [x] rebrancher `edit` sous le layout
- [x] rebrancher `preview` sous le layout
- [x] conserver `[slug] -> edit` comme redirect canonique

---

## Vérifications

- [x] vérifier que `edit` reste inchangée fonctionnellement
- [x] vérifier que `preview` reste inchangée fonctionnellement
- [x] vérifier que tous les liens produit du périmètre ouvrent la route canonique
- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`
- [x] noter séparément les éventuels blocages d'environnement

---

## Livraison

- [ ] lister les fichiers réellement modifiés
- [x] lister les liens/hrefs canonisés
- [x] confirmer qu'aucun module métier n'a été extrait
- [x] confirmer que les critères de fin de la roadmap sont atteints
- [x] compléter la section `Notes de livraison` de la roadmap si nécessaire
