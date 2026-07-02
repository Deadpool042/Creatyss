# Lot — Settings manquants

## Statut

Terminé — customers reste volontairement en stub

## Objectif

Ouvrir les sections settings admin manquantes (orders, catalog, customers, media), puis les
relocaliser sous leur domaine métier lorsque ces réglages configurent directement une verticale
existante. Les réglages transverses restent exposés depuis le hub `/admin/settings`.

## Périmètre

Implémenté :

- `app/admin/(protected)/commerce/orders/@detail/settings/` : formulaire réel pour la numérotation et les paramètres de traitement
- `app/admin/(protected)/catalog/settings/` : section réelle autour du flag `catalog.products.related`
- `app/admin/(protected)/catalog/media/settings/` : surface réelle d'information et de configuration lecture seule
- `app/admin/(protected)/commerce/customers/settings/` : section ouverte avec `AdminComingSoon`, reliée au lot clients et à la liste `/admin/commerce/customers`
- Routes de compatibilité sous `app/admin/(protected)/settings/{orders,catalog,customers,media}/`
- Hub `/admin/settings` généré depuis `adminNavigationItems`, avec les réglages transverses purs
  (`general`, `store`, `notifications`, `seo`, `team`, `advanced`, `api-clients`, `integrations`,
  `webhooks`, `search`, `channels`, `localization`, `ai`)
- Liens de navigation admin présents pour les sections domaine et les réglages transverses

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

- Les settings existants (general, store, advanced, localization, notifications, etc.) ne doivent pas être déplacés sous un domaine métier sans duplication observée
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

- Les sections orders, catalog, customers et media sont accessibles depuis leur domaine métier sans erreur
- Les anciennes routes `settings/*` correspondantes redirigent vers la route domaine canonique
- Les réglages transverses purs restent accessibles depuis `/admin/settings`
- Chaque section affiche soit un formulaire de configuration fonctionnel, soit un `AdminComingSoon` avec référence claire
- Aucune section existante n'est cassée
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`next-admin-ui-builder`
