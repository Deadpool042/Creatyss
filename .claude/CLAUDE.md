# Claude Code – Creatyss

## Source de vérité

Lire en priorité :

1. `AGENTS.md`
2. `README.md`
3. `docs/v6/scope.md`
4. `docs/v6/data-model.md`
5. `docs/v6/roadmap.md`
6. `docs/v6/admin-language-and-ux.md`
7. `docs/v6/glossary.md`

## Règles de travail

- Toujours proposer un plan avant un lot non trivial.
- Toujours rester dans le périmètre demandé.
- Ne pas ajouter de dépendance sans nécessité explicite.
- Privilégier des petits lots sûrs.
- Exécuter les vérifications pertinentes à la fin du lot :
  - `pnpm run typecheck`
  - tests ciblés
  - e2e ciblés si le lot touche l’UI ou les parcours
- Ne pas modifier le comportement métier sans demande explicite.
