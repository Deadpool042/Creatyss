# Lot — Implémentation navigation admin

## Statut

En cours. `lot-decision-ia-admin.md` validé (2026-07-02). Deux sous-lots livrés sur la branche `feature/admin-nav-settings-sync` (non mergée) :

- **Option B (resync hub/sidebar)** — livré. Hub `/admin/settings` dérivé de `admin-navigation.data.ts` via `buildAdminSettingsHubItems`, filtré par capabilities réelles (avant : aucune vérification d'accès sur le hub). 5 labels "Vue d'ensemble" différenciés par domaine.
- **Option A, pilote domaine `customers`** — livré. `settings/customers` (stub `AdminComingSoon`) fusionné dans `commerce/customers/settings`, avec redirect conservé et nav locale à 2 entrées (`CustomerRouteNav`). Item `customers-settings` supprimé de `admin-navigation.data.ts` (pas seulement masqué, pour éviter un doublon dans le menu mobile).

Reste à faire : 5 sous-lots domaine (catalog, orders, media, payments, shipping), chacun un lot indépendant suivant le pattern ci-dessous. Vérification responsive live non exécutée sur les 2 sous-lots livrés (pas de canal navigateur disponible en session) — à faire avant merge de `feature/admin-nav-settings-sync`.

## Objectif

Appliquer la structure de navigation validée par `lot-decision-ia-admin.md`, découpée en sous-lots par groupe fonctionnel (catalog, commerce, content, marketing, settings) pour limiter le blast radius. Jamais un big-bang sur toute la navigation en un seul lot.

## Périmètre

- Un sous-lot par groupe fonctionnel touché par la décision validée.
- Mise à jour de `features/admin/navigation/utils/admin-navigation.data.ts` et des routes `app/admin/(protected)/**` concernées, groupe par groupe.
- Mise en place de redirects pour toute URL qui change, afin d'éviter les 404 pendant la transition.

## Pattern établi par le pilote `customers` (à répliquer pour catalog, orders, media, payments, shipping)

Pour chaque paire dupliquée restante :

1. Créer une route `<groupe-domaine>/<domaine>/settings/page.tsx` reprenant le contenu de `settings/<domaine>/page.tsx` (formulaire réel ou stub) avec la même capability, sans en changer la portée.
2. Transformer `settings/<domaine>/page.tsx` en simple `redirect()` (pattern déjà utilisé dans `settings/localization/page.tsx`) vers la nouvelle route — jamais de suppression sèche.
3. Ajouter une nav locale à 2 entrées (Liste/Configuration) au domaine, **sans layout partagé au niveau du dossier racine** pour éviter qu'elle ne fuite sur les sous-routes de détail (ex. `[id]/`, `[slug]/`) — un composant simple par domaine, sur le modèle de `CustomerRouteNav` (`features/admin/customers/components/customer-route-nav.tsx`), pas un composant partagé cross-domaine.
4. Dans `admin-navigation.data.ts`, avant de retirer `sidebar`/`settingsHub` de l'item `<domaine>-settings`, vérifier s'il duplique un label déjà exposé en `mobileMore` par l'item domaine correspondant — si oui, **supprimer l'item entièrement** plutôt que de le laisser à moitié vide (sinon duplication silencieuse dans le menu mobile "More", comme détecté sur `customers`).
5. Nettoyer toute métadonnée locale devenue orpheline (ex. `SETTINGS_CARD_META` dans `settings/page.tsx`) et les imports associés.

Les 5 domaines restants ont des formulaires réels (41 à 155 lignes, cf. audit section 3.4) contrairement au stub `customers` — prévoir une revue plus attentive du contenu migré pour chacun, un sous-lot à la fois.

## Hors périmètre

- Toute restructuration non validée explicitement dans `lot-decision-ia-admin.md`.
- Le volet storefront (`lot-audit-completude-storefront.md` et suites éventuelles) — périmètre strictement admin.
- Toute refonte visuelle du design system, conformément au garde-fou cité dans `README.md`.

## Invariants

- Aucune route existante ne doit renvoyer 404 pendant la transition — prévoir des redirects si des URLs changent.
- Les capabilities/feature flags actuels doivent continuer à gouverner l'accès aux mêmes écrans, sans perte ni élargissement non demandé.
- Chaque sous-lot par groupe doit rester déployable et recettable indépendamment des autres groupes.

## Risques

- Régression transversale : tous les écrans admin dépendent de la navigation — d'où le découpage strict en micro-lots par groupe.
- Risque d'oubli de redirect sur une URL bookmarkée ou partagée en interne.
- Risque de désynchronisation entre la décision validée et l'implémentation si plusieurs sous-lots s'étalent dans le temps — revalider l'alignement avec `lot-decision-ia-admin.md` à chaque sous-lot.

## Critères de fin

- `typecheck` et `lint` passent pour chaque sous-lot livré.
- Navigation manuelle recettée sans 404 sur l'ensemble des groupes touchés.
- Aucune capability ou feature flag perdu par rapport à l'état avant lot.

## Agent recommandé

`next-admin-ui-builder`
