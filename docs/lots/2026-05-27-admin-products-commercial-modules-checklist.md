# Checklist lot — admin products commercial modules

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-commercial-modules-roadmap.md`
- [x] relire la doc `products`, `pricing`, `availability`, `inventory`
- [x] confirmer que le lot ne touche pas encore `variants`, `related`, `categories`
- [x] confirmer qu'aucune sémantique métier n'est modifiée

---

## Audit d'entrée

- [x] lister les dépendances `pricing` présentes dans `/edit`
- [x] lister les dépendances `availability` présentes dans `/edit`
- [x] lister les dépendances `inventory` présentes dans `/edit`
- [x] identifier les queries minimales nécessaires à chaque future route
- [x] identifier le point de contrôle capability pour `inventory`

---

## Cadrage technique

- [x] confirmer la séparation doctrinale `pricing` / `availability` / `inventory`
- [x] définir le contrat minimal de chaque route
- [x] confirmer ce qui sort de `/edit`
- [x] confirmer que le layout produit reste léger
- [x] confirmer l'état attendu de la navigation secondaire

---

## Exécution

- [x] créer `app/admin/(protected)/catalog/products/[slug]/pricing/page.tsx`
- [x] créer `app/admin/(protected)/catalog/products/[slug]/availability/page.tsx`
- [x] créer `app/admin/(protected)/catalog/products/[slug]/inventory/page.tsx`
- [x] brancher chaque page au layout produit commun
- [x] connecter chaque page aux données et formulaires existants sans changer le métier
- [x] retirer `pricing` de la structure principale de `/edit`
- [x] retirer `availability` de la structure principale de `/edit`
- [x] retirer `inventory` de la structure principale de `/edit`
- [x] aligner navigation secondaire et liens internes

---

## Vérifications

- [ ] vérifier la navigation vers `/pricing`
- [ ] vérifier la navigation vers `/availability`
- [ ] vérifier la navigation vers `/inventory`
- [ ] vérifier que `/edit` reste page coeur produit
- [ ] vérifier que `inventory` respecte la capability attendue
- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`
- [x] noter séparément les blocages d'environnement
- blocage d'environnement constaté : les requêtes HTTP locales vers `127.0.0.1:3000` n'étaient pas fiables depuis la sandbox au moment de la clôture, donc la vérification manuelle reste ouverte

---

## Livraison

- [x] lister les fichiers réellement modifiés
- [x] confirmer que `/edit` n'est plus structurée autour des modules commerciaux
- [x] confirmer que `pricing`, `availability` et `inventory` restent distincts
- [x] confirmer qu'aucun changement métier n'a été introduit
- [x] confirmer les critères de fin de la roadmap
- [x] compléter la section `Notes de livraison` de la roadmap
