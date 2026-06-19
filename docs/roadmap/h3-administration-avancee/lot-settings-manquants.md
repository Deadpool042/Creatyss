# Lot — Settings manquants

## Statut

A faire

## Objectif

Créer les sections settings admin manquantes (orders, catalog, customers, media) en utilisant le pattern `AdminComingSoon` existant ou en implémentant directement les formulaires de configuration si le contenu est défini.

## Périmètre

Proposition — à vérifier dans le code avant implémentation :

- `app/admin/(protected)/settings/` — nouvelles sections :
  - `settings/orders/` : configuration des préfixes de référence, statuts par défaut, délais
  - `settings/catalog/` : options catalogue (produits par page, tri par défaut, affichage)
  - `settings/customers/` : politiques de compte client, durée de rétention des données
  - `settings/media/` : limites d'upload, formats acceptés, qualité de compression
- Pattern `AdminComingSoon` existant (observé dans `features/admin/pilotage/`) à réutiliser pour les sections sans contenu défini
- Liens depuis `settings/advanced` ou le menu de navigation admin

## Hors périmètre

- Settings blog (peut suivre)
- Settings SEO global (peut suivre)
- Settings localization (déjà implémenté à L3, observé)
- Settings notifications (déjà implémenté, observé)
- Settings webhooks/integrations/search/channels (déjà implémentés, observés)

## Dépendances

- Aucune dépendance bloquante — ce lot est parallélisable dès maintenant
- Pour les sections avec formulaires réels : décision sur les champs configurables et leur impact applicatif

## Invariants

- Les settings existants (general, store, advanced, localization, notifications, etc.) ne doivent pas être modifiés
- Le pattern `AdminComingSoon` doit être réutilisé tel quel pour les sections sans contenu défini, sans créer un nouveau pattern
- Les nouveaux settings stockés en DB doivent utiliser le modèle `Store` existant ou un modèle dédié selon l'architecture — à vérifier avant implémentation

## Risques

- Scope créep : les settings "catalog" et "orders" peuvent déclencher des discussions sur des configurations complexes — rester sur un périmètre minimal et documenté
- Si les settings impactent le comportement applicatif (ex. préfixe de référence de commande), il faut vérifier la cohérence avec les données existantes en production

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Navigation manuelle : toutes les nouvelles sections sont accessibles sans 404 ni erreur

## Critères de fin

- Les sections orders, catalog, customers et media sont accessibles dans l'admin settings sans erreur
- Chaque section affiche soit un formulaire de configuration fonctionnel, soit un `AdminComingSoon` avec référence claire
- Aucune section existante n'est cassée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-admin-ui-builder`
