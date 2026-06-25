# Lot — Settings manquants

## Statut

Terminé — customers reste volontairement en stub

## Objectif

Ouvrir les sections settings admin manquantes (orders, catalog, customers, media) en réutilisant le pattern `AdminComingSoon` là où aucun contenu métier robuste n'était encore cadré.

## Périmètre

Implémenté :

- `app/admin/(protected)/settings/orders/` : formulaire réel pour la numérotation et les paramètres de traitement
- `app/admin/(protected)/settings/catalog/` : section réelle autour du flag `catalog.products.related`
- `app/admin/(protected)/settings/media/` : surface réelle d'information et de configuration lecture seule
- `app/admin/(protected)/settings/customers/` : section ouverte avec `AdminComingSoon`, reliée au lot clients et à la liste `/admin/commerce/customers`
- Liens de navigation admin présents pour ces quatre sections

## Hors périmètre

- Settings blog (peut suivre)
- Settings SEO global (peut suivre)
- Settings localization (déjà implémenté à L3, observé)
- Settings notifications (déjà implémenté, observé)
- Settings webhooks/integrations/search/channels (déjà implémentés, observés)

## Dépendances

- Aucune dépendance bloquante restante
- Les champs réellement configurables ont été bornés localement, sans élargissement de périmètre

## Invariants

- Les settings existants (general, store, advanced, localization, notifications, etc.) ne doivent pas être modifiés
- Le pattern `AdminComingSoon` doit être réutilisé tel quel pour les sections sans contenu défini, sans créer un nouveau pattern
- Le lot reste borné à l'ouverture des surfaces admin observables ; aucune extension transverse de modèle ou de persistance ne doit être déduite de cette fiche

## Risques

- Scope creep : les settings "catalog" et "orders" pouvaient déclencher des discussions sur des configurations complexes — le lot est resté borné
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
