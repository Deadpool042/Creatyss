# Checklist lot — admin products core edit

## Préflight

- [x] relire `AGENTS.md`
- [x] relire la roadmap `2026-05-27-admin-products-core-edit-roadmap.md`
- [x] relire la doc domaine `products`, `pricing`, `availability`, `categories`
- [x] confirmer que le lot ne crée pas encore les sous-pages modules
- [x] confirmer que le lot ne modifie pas Prisma ni les services métier hors besoin strict

---

## Audit d'entrée

- [x] lister les blocs actuellement présents dans `/edit`
- [x] distinguer blocs coeur vs blocs adjacents
- [x] vérifier comment les tabs structurent aujourd'hui l'écran
- [x] identifier les composants strictement liés à l'assemblage tabs
- [x] identifier les zones qui peuvent rester temporairement sur `/edit`

---

## Cadrage technique

- [x] fixer la composition cible de `/edit`
- [x] décider quels blocs sortent immédiatement du coeur d'écran
- [x] décider quels blocs restent transitoirement visibles
- [x] définir une structure verticale lisible sans tabs globales
- [x] confirmer les futurs points de sortie vers les routes modules

---

## Exécution

- [x] simplifier l'assemblage de la page `/edit`
- [x] retirer la dépendance à la navigation tabs globale
- [x] conserver uniquement les sections coeur produit
- [x] débrancher de la structure principale les blocs `media`, `seo`, `pricing`, `availability`, `inventory`
- [x] garder la page cohérente sans créer encore les sous-pages finales
- [x] documenter les arbitrages temporaires sur `categories`, `variants`, `related`

---

## Vérifications

- [ ] vérifier que `/edit` reste fonctionnelle
- [ ] vérifier que la hiérarchie visuelle de la page est claire
- [x] vérifier que la page ne repose plus sur des tabs globales
- [x] lancer `pnpm run typecheck`
- [x] lancer `pnpm run lint`
- [x] noter séparément les blocages d'environnement

---

## Livraison

- [x] lister les blocs coeur conservés
- [x] lister les blocs sortis conceptuellement de `/edit`
- [x] confirmer qu'aucune nouvelle route module n'a été implémentée dans ce lot
- [x] confirmer les critères de fin de la roadmap
- [x] compléter la section `Notes de livraison` de la roadmap
