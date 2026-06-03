# Checklist lot — admin products media and seo extraction

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-media-seo-roadmap.md`
- [x] relire la doc `products`, `media`, `seo`
- [x] confirmer que le lot ne touche pas encore `pricing`, `availability`, `inventory`
- [x] confirmer que les actions `media` et `seo` gardent leur métier actuel

---

## Audit d'entrée

- [x] lister les dépendances `media` présentes dans `/edit`
- [x] lister les dépendances `seo` présentes dans `/edit`
- [x] identifier les queries minimales nécessaires à `/media`
- [x] identifier les queries minimales nécessaires à `/seo`
- [x] identifier les liens et breadcrumbs à réaligner

---

## Cadrage technique

- [x] définir le contrat de `/media`
- [x] définir le contrat de `/seo`
- [x] confirmer ce qui est retiré de `/edit`
- [x] confirmer que le layout produit reste léger
- [x] confirmer que la navigation secondaire expose les nouvelles routes

---

## Exécution

- [x] créer `app/admin/(protected)/catalog/products/[slug]/media/page.tsx`
- [x] créer `app/admin/(protected)/catalog/products/[slug]/seo/page.tsx`
- [x] brancher chaque page au layout produit commun
- [x] connecter les données existantes sans changer le métier
- [x] retirer `media` de la structure principale de `/edit`
- [x] retirer `seo` de la structure principale de `/edit`
- [x] aligner les liens internes et breadcrumbs

---

## Vérifications

- [ ] vérifier la navigation vers `/media`
- [ ] vérifier la navigation vers `/seo`
- [ ] vérifier la continuité des actions `media`
- [ ] vérifier la continuité de la sauvegarde `seo`
- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`
- [x] noter séparément les blocages d'environnement

---

## Livraison

- [ ] lister les fichiers réellement modifiés
- [x] confirmer que `/edit` n'est plus structurée autour de `media` et `seo`
- [x] confirmer qu'aucun changement métier n'a été introduit
- [x] confirmer les critères de fin de la roadmap
- [x] compléter la section `Notes de livraison` de la roadmap
