# Lot 5 — Cockpit consolidé : cadrage

Suite de `docs/roadmap/analyses-cockpit-analytique/README.md`. Ce document cadre le lot 5 avant tout code — aucune implémentation ici, à l'image des cadrages précédents de ce chantier.

## Observé (2026-07-06)

- `/admin/insights/analytics` (`app/admin/(protected)/insights/analytics/page.tsx` + `features/admin/insights/components/analytics-overview-sections.tsx`) affiche aujourd'hui : KPI "Aujourd'hui vs hier" (vues produit, ajouts panier — réel, lot antérieur au chantier), "Pages les plus visitées" (réel via provider Umami, lot 1), "Ce mois" + insights + recommandations (commerce réel, `Order`/`Customer`, antérieur au chantier).
- **Recherche (lot 2)** : les métriques `storefront.search_term_queries` (par terme, dimension `term`) et `storefront.search_zero_results` sont écrites dans `AnalyticsMetric`/`AnalyticsSnapshot` depuis le 2026-07-06, mais **aucune query ni section admin ne les lit** — le cockpit n'affiche rien sur la recherche.
- **Conversion / relance panier abandonné (lot 3)** : `queueCartAbandonedAutomationJobs` transitionne les paniers et met en file les emails, mais c'est un mécanisme d'automation (`engagement.automations`), pas une lecture analytique. Le module Marketing/Automations (`features/admin/marketing/automations/`) a déjà ses propres écrans (liste des jobs, jobs archivés) — la donnée "combien de relances envoyées / combien de paniers récupérés" existe potentiellement là, pas dans le cockpit Analyses.
- **Attribution (lot 4)** : décidé le 2026-07-06 — aucune donnée interne, seulement un renvoi vers Umami/Plausible pour les lectures source/canal/campagne. Rien à lire depuis Prisma.
- Le cockpit `/admin/insights/analytics` et le module Marketing/Automations sont aujourd'hui deux écrans admin distincts, sans lien croisé.

## Ce que "consolider" peut vouloir dire ici

Le README initial anticipait un cockpit qui agrège les sorties des lots 1 à 4. En pratique, après cadrage de chacun, la matière disponible est plus modeste que prévu :

1. **Recherche** : une nouvelle section lisible existe réellement (top termes, recherches sans résultat) et n'est simplement pas encore branchée à une query + un bloc UI. C'est le seul ajout de lecture "prêt" au sens strict (données déjà écrites, juste pas lues).
2. **Conversion (panier abandonné)** : pas de nouvelle lecture analytique à ajouter ici — la donnée pertinente (jobs envoyés, paniers repassés en commande) relève du module Automations existant, pas d'un nouveau bloc dans Analyses. Un lien croisé simple (ex. renvoi vers `/admin/marketing/automations`) suffirait, sans dupliquer une vue.
3. **Attribution** : rien à afficher en interne — au mieux une mention/lien vers Umami, cohérente avec le bloc "Pages les plus visitées" qui cite déjà le provider actif.

## Proposition (à valider avant code)

- **Ajouter** une section "Recherche" au cockpit (nouvelle query `get-search-analytics.query.ts` sur le modèle de `get-daily-traffic-analytics.query.ts`, lecture des `AnalyticsSnapshot` par dimension `term` + compteur `searchZeroResults`), gatée par le même flag `engagement.analytics` niveau `read` déjà en place pour les autres blocs.
- **Ne pas ajouter** de nouveau bloc pour la conversion panier abandonné : au mieux un lien texte de renvoi vers le module Automations, à la discrétion du produit (pas un vrai besoin de lecture analytique identifié).
- **Ne pas ajouter** de bloc attribution : au mieux une ligne de mention dans le bloc "Module analytics" existant (bas de colonne droite), similaire à la mention Umami déjà présente pour "Pages les plus visitées".
- Pas de refonte de la mise en page actuelle (grille KPI + deux colonnes) : ajouter la section Recherche dans la colonne principale, à la suite de "Pages les plus visitées", pas de nouveau hub de navigation (leçon du lot 14 : éviter les entrées qui ne mènent qu'à du vide).

## Questions à trancher avant d'écrire du code

1. Le lien croisé vers Automations et la mention Umami pour l'attribution sont-ils utiles à ce stade, ou juste du bruit visuel tant qu'aucune demande utilisateur ne les réclame ?
2. La section Recherche doit-elle afficher le classement des termes sans résultat (souvent plus actionnable pour le catalogue) en priorité sur le top des termes recherchés, ou les deux à égalité ?
3. Faut-il un niveau de gradation dédié (ex. `read` suffit, ou faut-il réserver aux niveaux `insights`/`recommendations` comme pour le commerce) ?

## Hors périmètre de ce document

Toute implémentation. Une fois les questions ci-dessus tranchées, l'ajout de la section Recherche reste un micro-lot isolé (une query + un bloc UI), pas une refonte du cockpit.
