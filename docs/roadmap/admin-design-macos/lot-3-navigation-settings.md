# Lot 3 — Navigation settings style System Settings

## Statut

Livré — 2026-07-04. `typecheck` et `lint` passent. Vérifié navigateur : 5 groupes (Boutique, Communication, Accès & sécurité, Connexions, Plateforme), 13 items, navigation fonctionnelle vers les sections, aucun reliquat "Autres".

## Objectif

Transformer le hub `/admin/settings` (grille plate de cartes) en navigation groupée façon macOS System Settings : panneaux par groupe thématique, rangées denses icône + libellé + description courte + chevron, dividers internes.

---

## État observé (2026-07-04)

- `app/admin/(protected)/settings/page.tsx` : hub en grille `sm:grid-cols-2 lg:grid-cols-3` de cartes plates, sans regroupement. Les items viennent de `buildAdminSettingsHubItems` (source unique `admin-navigation.data.ts`, filtrage par capabilities), les descriptions/icônes sont des métadonnées d'affichage locales (`SETTINGS_CARD_META`).
- 13 sections dans la navigation : general, store, notifications, seo, team, advanced, api-clients, integrations, webhooks, search, channels, localization, ai.
- `settings/advanced/*` est déjà en split-view (`AdminSplitView` + parallel routes `@list`/`@detail`).
- Les autres sections sont des pages autonomes portant chacune leur propre `AdminPageShell`.

## Périmètre

- Regroupement des cartes du hub en sections System Settings (métadonnée d'affichage locale, même statut que `SETTINGS_CARD_META`) :
  - **Boutique** : general, store, seo, localization
  - **Communication** : notifications, channels
  - **Accès & sécurité** : team, api-clients
  - **Connexions** : integrations, webhooks
  - **Plateforme** : search, ai, advanced
- Rendu en panneaux (`rounded-2xl border`) avec rangées `divide-y` : icône en tuile, libellé, description, chevron — dense, cliquable pleine largeur.
- Fallback : tout item sans groupe connu tombe dans un groupe "Autres" (robustesse si la navigation évolue).

## Hors périmètre

- Conversion des ~30 écrans de sections en split-view persistant (chaque page porte son propre shell — les convertir relève d'une généralisation multi-lots, à cadrer après validation visuelle de ce hub).
- Toute modification de `admin-navigation.data.ts` (source unique partagée avec la sidebar) et des capabilities.
- Tokens CSS.

## Invariants

- Filtrage par capabilities inchangé (`buildAdminSettingsHubItems` reste la seule source des items visibles).
- Aucun changement de route.
- Tout item rendu avant l'est encore après (fallback "Autres").

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`
- Vérification navigateur desktop + mobile du hub.
