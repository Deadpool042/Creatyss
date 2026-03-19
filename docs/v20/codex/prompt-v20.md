# Prompt V20 — Refactor interne de `db/`

Utiliser ce prompt comme base pour un lot de refactor interne de `db/`.

## Prompt

Tu travailles sur le repository Creatyss.

Lis avant toute modification :

- `AGENTS.md`
- `README.md`
- `docs/v19/README.md`
- `docs/v20/README.md`
- `docs/v20/architecture/*`
- `docs/v20/rules/*`
- la fiche domaine concernée dans `docs/v20/repositories/*`
- le ou les patterns concernés dans `docs/v20/patterns/*`

### Objectif

Refactor interne du domaine `db` suivant : `<DOMAINE>`

### Contexte réel à préserver

- `db/` est 100% Prisma ORM
- il n'existe plus aucun `$queryRaw`, `$executeRaw` ni `Prisma.sql` runtime
- les repositories sont les façades publiques de `db/`
- les contrats publics vivent majoritairement dans `*.types.ts`
- `entities/` porte les règles métier
- les consumers `app/` et `features/` dépendent des signatures publiques actuelles

### Ce que tu peux faire

- extraire des queries internes
- extraire des helpers privés
- sortir des types publics cachés dans `*.types.ts`
- supprimer des ré-exports de types publics depuis un repository
- clarifier la structure d'un domaine sans changer sa surface publique

### Ce que tu ne dois pas faire

- changer le comportement fonctionnel
- changer les signatures runtime exportées
- changer les contrats publics
- déplacer la logique métier hors `entities/`
- réintroduire du raw Prisma
- introduire une couche service

### Procédure attendue

1. auditer le domaine réel
2. lister les exports publics et les consumers touchés
3. proposer un plan strictement interne
4. exécuter par petits incréments
5. lancer au minimum :
   - `pnpm run typecheck`
   - `pnpm run lint`
6. vérifier explicitement :
   - pas de changement public
   - pas de N+1 nouveau
   - imports types alignés sur `*.types.ts`

### Points d'attention selon le domaine

- `catalog` :
  - préserver la règle d'image primaire
  - préserver l'ordering et le filtrage `onlyAvailable`
- `order` :
  - préserver les transactions `Serializable`
  - préserver la création de référence et le retry
- `admin-category` :
  - préserver `representativeImage`
- `products/**` :
  - préserver la compatibilité `simple-product-compat`

### Format de restitution

- audit de départ
- plan retenu
- fichiers touchés
- résumé des changements
- résultats `typecheck` / `lint`
- risques ou limites restantes
