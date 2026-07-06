# Lot 13 — Paiements & Livraisons : recherche

## Statut

Livré — 2026-07-06. `typecheck`, `lint` passent. Vérification navigateur non faite dans cette session (extension Chrome déconnectée + dev server arrêté pendant la vérification) — à confirmer manuellement.

## Objectif

Traiter le dernier écart noté par le lot 12 : `commerce/payments` et `commerce/shipping` n'avaient aucune recherche, seul écart réel restant après la réévaluation des domaines "à réévaluer" du chantier design macOS.

## Périmètre

- `features/admin/commerce/payments/list/components/admin-payments-panel.tsx` (nouveau) — toolbar (`AdminConfigDataTableToolbar`, recherche sur référence commande / nom client / email) + `AdminPaymentsList` filtrée. Pas de filtre statut (n'existait pas avant, hors périmètre).
- `features/admin/commerce/shipping/list/components/admin-shipments-panel.tsx` (nouveau) — même toolbar de recherche, **au-dessus** du filtre statut existant (`AdminShipmentsListFilters`, Links URL) qui reste inchangé et continue de filtrer côté serveur ; la recherche filtre en plus côté client la liste déjà filtrée par statut.
- `admin-payments-list.tsx` / `admin-shipments-list.tsx` — ajout d'un `emptyMessage` optionnel (même pattern que lot 9/12).
- `app/admin/(protected)/commerce/payments/page.tsx` et `.../shipping/page.tsx` — rendent le panel au lieu de la liste brute.

## Hors périmètre

- Conversion du filtre statut shipping en contrôle client-side (reste un filtre serveur via URL, décision assumée pour ne pas changer un comportement qui fonctionne).
- Ajout d'un filtre statut à payments (n'existait pas, pas demandé).
- Queries, actions serveur, Prisma : inchangés.

## Invariants

- Actions "Marquer reçu"/"Annuler" sur les paiements inchangées (mêmes server actions).
- Filtre statut shipping (URL) inchangé dans son comportement.

## Vérifications

- `pnpm run typecheck`, `pnpm run lint`.
- Navigateur (à faire) : `/admin/commerce/payments` et `/admin/commerce/shipping` — recherche, compteur de résultats, aucune régression des actions inline.
