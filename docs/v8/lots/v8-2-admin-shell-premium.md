# V8-2 — Shell Admin Premium (Icon-Collapse)

## Objectif

Faire passer le shell admin à un niveau ergonomique professionnel sur desktop : sidebar réductible en mode icônes, état persisté, handle visuel de toggle, et suppression des contournements techniques accumulés depuis V7.

## Prérequis

V8-1 terminé — les tokens `--brand` et `--sidebar-*` dark doivent être disponibles avant de réécrire le shell.

## Périmètre strict

**In scope :**

- Passage de `collapsible="offcanvas"` à `collapsible="icon"` sur `<Sidebar>`
- Ajout de `SidebarRail` comme handle visuel de toggle desktop
- Prop `tooltip` sur `SidebarMenuButton` pour chaque lien de navigation (actif en mode icon)
- Suppression du verrouillage `open={true}` / `onOpenChange={() => undefined}` — l'état est géré nativement par `SidebarProvider`
- Résolution du hack layout `-mb-16 -mt-8` dans `AdminShell`
- Retrait de `"use client"` de `AdminShell` si aucun hook ou state client propre n'est présent

**Out of scope :**

- Modification des groupes de navigation ou de leurs liens
- Animations ou transitions personnalisées
- Gestion explicite de la persistance (le mécanisme cookie natif shadcn suffit)
- Modification du contenu de la sidebar (info utilisateur, déconnexion)

## Ce que ce lot résout

### Verrouillage de l'état sidebar

`AdminShell` force actuellement `open={true}` et bloque tout changement via `onOpenChange={() => undefined}`. Ce verrou empêche l'utilisateur de réduire la sidebar et empêche la persistance de l'état. La suppression de ces deux props rend le contrôle à `SidebarProvider`, qui gère l'état via un cookie de session — sans code supplémentaire.

### Mode icon-collapse

Avec `collapsible="icon"`, la sidebar en état réduit conserve sa colonne mais masque les labels — seules les icônes restent visibles. Les `SidebarMenuButton` avec `tooltip` affichent le label au hover en mode icon. Ce comportement est natif shadcn : la prop `tooltip` sur `SidebarMenuButton` s'active automatiquement quand la sidebar est en mode icon.

Référence : pattern `sidebar-07` consulté via MCP shadcn — retenu pour ce comportement exact.

### SidebarRail

`SidebarRail` est un composant shadcn qui rend un handle visuel sur le bord droit de la sidebar. Il permet à l'utilisateur de réduire ou d'agrandir la sidebar en cliquant. Il remplace le `SidebarTrigger` desktop qui était masqué (`md:hidden`) — le trigger mobile reste présent pour l'overlay.

### Hack layout

Les classes `-mb-16 -mt-8` dans `AdminShell` compensent un padding du layout parent. Avant de les supprimer, lire le layout parent (`app/layout.tsx` et `app/admin/layout.tsx`) pour comprendre la source du décalage et corriger à la bonne couche.

### Découplage client/server

`AdminShell` est marqué `"use client"` mais ne contient ni hook React ni state propre. `SidebarProvider` gère son propre state. Si après lecture du composant aucun hook ou handler client n'est présent, `"use client"` peut être retiré. Si `AdminShell` orchestre des composants client, il peut être conservé `"use client"` ou la partie client peut être isolée dans un sous-composant.

## Comportement attendu après ce lot

| Contexte                  | Comportement                                      |
| ------------------------- | ------------------------------------------------- |
| Desktop — sidebar ouverte | Navigation pleine avec labels                     |
| Desktop — sidebar réduite | Icônes seules, labels en tooltip au hover         |
| Mobile                    | Overlay via `SidebarTrigger`                      |
| `SidebarRail`             | Handle visuel de toggle, bord droit de la sidebar |
| Refresh / navigation      | État sidebar persisté via cookie                  |

## Vérifications de fin de lot

```bash
pnpm run typecheck
pnpm exec playwright test --grep "admin"
```

Test manuel :

1. Desktop : cliquer `SidebarRail` → sidebar se réduit en icônes
2. Mode icon : hovering un lien → tooltip s'affiche
3. Mobile : `SidebarTrigger` → overlay fonctionne
4. Refresh → état maintenu
5. Dark mode : sidebar correctement rendue avec les tokens V8-1

## Fichiers attendus modifiés

- `components/admin/admin-shell.tsx`
- `components/admin/admin-sidebar.tsx`
- `components/admin/admin-sidebar-link.tsx`
- Éventuellement : `app/layout.tsx` ou `app/admin/layout.tsx` (si hack layout corrigé à la source)
