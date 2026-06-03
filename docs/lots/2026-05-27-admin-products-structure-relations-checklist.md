# Checklist lot — admin products structure and relations

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-structure-relations-roadmap.md`
- [x] relire la doc `products` et `categories`
- [x] confirmer que `pricing`, `availability`, `inventory`, `media`, `seo` sont hors lot
- [x] confirmer qu'aucun changement métier n'est attendu

---

## Audit d'entrée

- [x] mesurer la densité réelle de `variants`
- [x] mesurer la densité réelle de `related`
- [x] mesurer la densité réelle de `categories`
- [x] identifier ce qui structure encore `/edit`
- [x] identifier les queries minimales nécessaires à chaque future route

---

## Cadrage technique

- [x] trancher `variants` route dédiée ou non
- [x] trancher `related` route dédiée ou maintien transitoire
- [x] trancher `categories` route dédiée ou non
- [x] confirmer ce qui sort de `/edit`
- [x] confirmer que le layout produit reste léger

---

## Exécution

- [x] créer `variants/page.tsx` si l'arbitrage le retient
- [x] créer `related/page.tsx` si l'arbitrage le retient
- [x] créer `categories/page.tsx` si l'arbitrage le retient
- [x] brancher les routes créées au layout produit commun
- [x] connecter chaque route aux données et formulaires existants sans changer le métier
- [x] retirer de `/edit` les blocs ayant désormais une route dédiée
- [x] aligner navigation secondaire et liens internes

---

## Vérifications

- [ ] vérifier que `/edit` reste page coeur produit
- [ ] vérifier les routes effectivement créées
- [x] vérifier que `categories` reste séparé du coeur produit
- [x] vérifier que `related` reste borné et non sur-architecturé
- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`
- [x] noter séparément les blocages d'environnement

---

## Livraison

- [x] lister l'arbitrage final retenu pour `variants`, `related`, `categories`
- [x] confirmer que `/edit` n'est plus structurée par les modules extraits
- [x] confirmer qu'aucun changement métier n'a été introduit
- [x] confirmer les critères de fin de la roadmap
- [x] compléter la section `Notes de livraison` de la roadmap
