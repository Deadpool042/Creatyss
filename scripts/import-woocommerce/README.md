# Import WooCommerce — outillage de bootstrap Creatyss

## Statut

**Outillage de bootstrap ponctuel, spécifique à l'instance Creatyss.**

Ces scripts ont servi à récupérer rapidement le contenu de l'ancien site
WordPress/WooCommerce (creatyss.com) lors de l'amorçage du projet :
produits, catégories, médias. Ils ne font **pas** partie du socle
réutilisable.

Conséquences :

- un clone du repo n'a pas à les utiliser ni à les configurer ;
- les variables `WC_*` de `.env.example` ne servent qu'à ces scripts,
  jamais au runtime de l'application ;
- aucune nouvelle dépendance du socle vers WooCommerce n'est acceptable
  (cf. `AGENTS.md`, contraintes projet) ;
- ces scripts peuvent être archivés ou supprimés quand l'amorçage Creatyss
  sera définitivement clos.

## Capacité durable pour les clones

L'import de contenu pour un clone passe par l'**import en masse générique**
(CSV ou autre) — capacité optionnelle déjà modélisée :

- `prisma/optional/platform/import.prisma`
- `docs/domains/cross-cutting/import.md`

Son implémentation est une activation gouvernée (roadmap, Horizon 4 et
« Plus tard »), hors du périmètre de cet outillage.

## Usage (instance Creatyss uniquement)

Voir les scripts `import:woo:*` de `package.json`. `seed:dev` enchaîne
`bootstrap:store-admin` puis `import:woo:reset:skip-images` — ce couplage
est lui aussi propre à l'instance Creatyss.
