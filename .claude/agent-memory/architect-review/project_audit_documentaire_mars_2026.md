---
name: audit-documentaire-mars-2026
description: Résultats de l'audit documentaire complet du repo Creatyss (mars 2026) — problèmes trouvés, état de maturité, recommandations.
type: project
---

Audit documentaire exhaustif effectué le 2026-03-25.

**Résultat global : maturité documentaire SOLIDE mais avec des défauts techniques précis à corriger avant tout chantier Prisma.**

## Problèmes critiques identifiés

1. **Artefacts `cat >/EOF` dans 4 fichiers architecture** : les fichiers suivants contiennent les commandes shell qui ont servi à les créer, incluses dans le corps du fichier Markdown :
   - `docs/architecture/30-execution/33-modele-de-defaillance-et-idempotence.md` (ligne 1 et dernière ligne)
   - `docs/architecture/40-exploitation/40-niveaux-de-maintenance.md` (ligne 1 et dernière ligne)
   - `docs/architecture/40-exploitation/41-modele-d-exploitation.md` (dernière ligne : `EOF`)
   - `docs/architecture/40-exploitation/42-observabilite-et-audit.md` (dernière ligne : `EOF`)
   - `docs/architecture/90-reference/90-regles-de-decision.md` (ligne 1 : `cat > ... <<'EOF'`)

2. **Liens morts dans `docs/domains/cross-cutting/audit.md` et `observability.md`** : ces deux fiches référencent `../../architecture/40-exploitation/40-observabilite.md` et `41-audit-et-tracabilite.md` qui n'existent pas. Les fichiers réels sont `42-observabilite-et-audit.md` et `40-niveaux-de-maintenance.md`.

3. **Liens morts `store.md`** : `documents.md` et `api-clients.md` référencent `store.md` (sans 's') au lieu de `stores.md`.

4. **`cross-cutting/integrations.md` manquant** : `24-preoccupations-transverses.md` référence `../../domains/cross-cutting/integrations.md` mais ce fichier n'existe pas.

5. **Criticité `coeur structurant` non définie dans le template** : `api-clients.md` et `documents.md` utilisent `coeur structurant` comme criticité architecturale. Le `_template.md` ne liste pas cette valeur (il liste `coeur structurel`). Incohérence de terminologie.

6. **`21-domaines-coeur.md` incomplet** : recense seulement `products` et `orders` comme domaines coeur stabilisés. Or `auth`, `users`, `roles`, `permissions`, `stores`, `availability`, `pricing`, `cart`, `checkout`, `payments`, `shipping`, `taxation`, `customers` ont tous des fiches `core/` bien développées. L'écart entre la cartographie architecturale (minimaliste) et les fiches domaines (exhaustives) crée une ambiguïté d'autorité.

7. **`roadmap.md` de tests dupliqué** : `docs/testing/roadmap.md` contient deux versions consécutives du même document (une courte informelle en premier, puis une version longue et formatée). Document à nettoyer.

8. **Phase 5 `_migration-audit.md` = "à reprendre"** : tous les optionnels sont encore marqués non relus. Acceptable mais à noter avant audit Prisma.

## Points solides

- La doctrine `docs/architecture/` est cohérente, normative et bien structurée
- La taxonomie core/optional/cross-cutting/satellites est correctement distinguée de criticité et activabilité
- Les fiches `products`, `orders`, `availability`, `inventory`, `fulfillment`, `stores`, `auth` sont de haute qualité
- `_migration-audit.md` est un bon outil de pilotage de dette documentaire
- `docs/testing/` est sobre et aligné sur l'état réel du repo

**Why:** Chantier Prisma / repositories nécessite une documentation saine avant de croiser schémas et fiches domaines.
**How to apply:** Corriger les 7 problèmes listés ci-dessus avant d'ouvrir le chantier de réalignement Prisma.
