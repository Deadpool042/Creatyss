# V8 — Design System Premium Admin

## Ce qu'est V8

V8 est la phase de consolidation et d'élévation qualitative du design system Creatyss. Elle s'appuie sur la base technique posée en V7 (shadcn/ui, Tailwind CSS, structure `components/ui/` / `components/admin/`) et vise à rendre cette base cohérente, fiable en dark mode, et libérée de la coexistence avec l'ancien CSS legacy.

V8 ne touche pas au comportement métier, aux Server Actions, ni à la logique de données. C'est une phase purement UI et DX.

## Documents de référence

| Fichier                                           | Rôle                                                                                      |
| ------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `docs/v8/admin-design-system-premium.md`          | Doctrine — principes, critères, hiérarchie de décision, MCP shadcn, dark mode, legacy CSS |
| `docs/v8/admin-theme-and-shell-roadmap.md`        | Roadmap — justification et séquence des 5 lots                                            |
| `docs/v8/lots/v8-1-theme-foundation.md`           | Lot 1 — Fondations thème : tokens et dark mode                                            |
| `docs/v8/lots/v8-2-admin-shell-premium.md`        | Lot 2 — Shell icon-collapse professionnel                                                 |
| `docs/v8/lots/v8-3-admin-components-migration.md` | Lot 3 — Migration des composants cards et états                                           |
| `docs/v8/lots/v8-4-admin-pages-high-impact.md`    | Lot 4 — Cohérence des pages haute visibilité                                              |
| `docs/v8/lots/v8-5-legacy-css-cleanup.md`         | Lot 5 — Retrait contrôlé du CSS legacy orphelin                                           |

## Périmètre

**In scope :**

- Tokens CSS globaux : `--brand`, `--sidebar-*`, complétion du dark mode
- Shell admin : icon-collapse desktop, `SidebarRail`, tooltips, découplage client/server
- Migration composants : `AdminProductCard`, `AdminOrderCard`, `AdminBlogPostCard`, `AdminCategoryCard`, `AdminEmptyState`
- Cohérence des pages admin les plus consultées
- Retrait progressif du CSS legacy devenu orphelin après migrations

**Out of scope :**

- Refonte du front public (catalogue, panier, pages marketing)
- Graphiques / Recharts — dépendance non installée, aucun besoin actuel
- Internationalisation
- Logique métier, Server Actions, modèle de données
- Composants déjà conformes V7 : `AdminFormField`, `AdminFormSection`, `AdminFormActions`

**Public léger — conséquence naturelle :**
Les tokens globaux (`--brand`, dark mode) définis en V8-1 bénéficient mécaniquement au front public. Ce n'est pas un lot dédié — c'est une conséquence de la normalisation des tokens partagés.

## Séquence

```
V8-1 → V8-2
     → V8-3 → V8-5
     → V8-4 → V8-5
```

V8-1 est le prérequis logique (tokens disponibles pour tous les autres lots). V8-2, V8-3 et V8-4 peuvent démarrer en parallèle après V8-1. V8-5 ne commence qu'une fois V8-2, V8-3 et V8-4 terminés — le nettoyage suit les migrations, il ne les précède pas.
