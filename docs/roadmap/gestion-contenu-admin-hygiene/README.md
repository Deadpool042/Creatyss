# Hygiène gestion de contenu admin

Chantier de robustesse et d’hygiène sur le périmètre admin éditorial : pages, blog, homepage, media et SEO. Ce suivi documente l’état réel après les lots effectivement livrés, sans recréer de plan transverse générique.

## Décision de chantier

**Harmoniser sans unifier.**

- Les domaines `pages`, `blog`, `homepage`, `media` et `seo` restent séparés.
- Aucun CMS générique transverse n’est introduit.
- Aucune promesse de migration Prisma n’est portée par ce document.
- Aucun modèle Prisma n’est annoncé comme supprimé sans audit dédié.

## Livré

- `docs(content): align admin editorial domain facts`
- `refactor(admin): reuse empty state for pages`
- `test(admin): align editorial e2e routes`
- `test(admin): align media e2e UI`
- `test(admin): align homepage e2e states`
- `test(admin): align blog list e2e UI`
- `test(admin): mark obsolete blog publish e2e as fixme`
- `test(admin): migrate blog e2e fixture to prisma`
- `test(blog): cover post publishability`
- `test(admin): rebuild blog publishability e2e`

## Observé / Documenté / Déduit / Inconnu

### Observé

- Les routes admin éditoriales effectivement couvertes par les tests ciblés sont :
  - `/admin/content/blog`
  - `/admin/content/homepage`
  - `/admin/catalog/media`
- Les tests ciblés `tests/e2e/admin/blog.spec.ts`, `tests/e2e/admin/homepage.spec.ts` et `tests/e2e/admin/media.spec.ts` passent actuellement.
- Le helper `tests/e2e/blog-db.ts` utilise désormais Prisma scripté, résolu sur le premier store.
- La publishability blog est couverte unitairement dans `tests/unit/entities/blog/blog-post-publishability.test.ts`.
- Le domaine `pages` reste documenté comme `optional`, alors que le fichier Prisma observé est `prisma/core/content/pages.prisma` avec une classification technique `core`.
- `PageSection` et `PageBlock` sont modélisés en Prisma ; le runtime admin/pages actuellement observé ne les exploite pas directement.
- Le domaine blog admin pilote désormais la non-publication d’un draft vide depuis la liste réelle, via le toggle de publication, et non via un `select` de statut sur la page détail.
- La convention authz admin content actuellement observée reste asymétrique :
  - `pages` : écriture protégée par `requireAdminCapability("admin.content.pages.write")`
  - `blog` : écriture protégée par `requireAuthenticatedAdmin()`, avec garde métier séparée sur le niveau `content.blog` pour la publication storefront
  - `homepage` : création, publication et mise à jour protégées par `requireAuthenticatedAdmin()`
- Les capabilities `read` du périmètre admin content servent principalement au filtrage de navigation observé ; aucun guard serveur dédié n’est observé ici sur les routes de lecture `pages`, `blog` et `homepage`.

### Documenté

- La doctrine du dépôt impose de distinguer strictement `Observé`, `Documenté`, `Déduit`, `Inconnu`, et de ne pas confondre taxonomie documentaire et organisation technique.
- `docs/domains/optional/pages.md` documente explicitement l’écart de classification `optional` documentaire vs `core` technique sans demander de déplacement Prisma dans ce chantier.
- `docs/domains/optional/blog.md` documente le modèle blog réel observé sans introduire de modèles `BlogAuthor`, `BlogTag` ou `BlogSeoMetadata` matérialisés.
- `docs/domains/cross-cutting/seo.md` documente le SEO transverse sans matérialiser `SeoIndexingRule`, `SeoCanonicalRef` ou `SeoPolicy`.
- `FEATURE_CATALOG` porte la gouvernance produit des features et de leurs niveaux ; ce catalogue ne constitue pas, à lui seul, une policy d’autorisation serveur.

### Déduit

- Un audit authz ciblé sur lecture/écriture admin content reste prioritaire avant tout lot plus transversal.
- Les prochains micro-lots utiles doivent rester séparés par domaine ou par contrat UI précis, sans refactor transverse “éditeur de contenu”.
- Le passage éventuel vers des `FormState` discriminés pour `blog` et `homepage` doit être audité domaine par domaine ; rien n’indique qu’un lot unique transversal soit souhaitable.
- Une harmonisation future des image pickers peut être étudiée en commençant par `blog`, puis `homepage`, si le contrat UI réel reste proche.
- L’introduction de `admin.content.blog.write` et `admin.content.homepage.write` n’est pas retenue maintenant :
  - aucun besoin produit confirmé n’impose des rôles d’écriture séparés ;
  - `blog.write` serait distinct du niveau `content.blog` `draft/publish` ;
  - `homepage.write` serait distinct du caractère `readonly` de `content.homepage` dans le feature catalog ;
  - une telle évolution impliquerait un vrai changement de policy sur seeds, permissions et actions.

### Inconnu

- Les écarts exacts d’authz admin content en lecture/écriture sur `pages`, `blog`, `homepage` n’ont pas encore été audités bout à bout.
- L’intérêt réel d’un passage `FormState` discriminé sur `blog` et `homepage` n’est pas confirmé.
- La frontière précise entre `content/seo` et `settings/seo` n’a pas encore été auditée fonctionnellement.
- La consommation de `MediaReference` hors périmètre éditorial admin courant n’est pas traitée par ce chantier.
- L’utilité future de capabilities `write` dédiées pour `blog` et `homepage` reste inconnue tant qu’un besoin explicite de rôles admin plus fins n’est pas confirmé.

## Reste ouvert

- Authz admin content lecture/écriture, avec convention actuelle documentée :
  - `pages` : capability `write`
  - `blog` : `requireAuthenticatedAdmin()` + règles métier / niveau de publication
  - `homepage` : `requireAuthenticatedAdmin()`
- `FormState` sur `blog` puis `homepage`, uniquement si l’audit confirme un gain réel.
- Image picker `blog`, puis `homepage`, sans abstraction transverse prématurée.
- Classification `pages` : `optional` documentaire vs `core` technique.
- `PageSection` / `PageBlock` modélisés mais non branchés sur le runtime admin/pages actuellement observé.
- `MediaReference` consommé ailleurs, mais non central dans l’éditorial admin courant.
- Frontière `content/seo` vs `settings/seo`.
- Les capabilities `admin.content.blog.write` et `admin.content.homepage.write` ne sont pas retenues maintenant ; réévaluation uniquement si un besoin explicite de rôles d’écriture plus fins apparaît.

## Priorité recommandée

1. L’audit authz admin content conclut au maintien de la convention actuelle ; `blog.write` et `homepage.write` ne sont pas retenues maintenant.
2. Les prochains micro-lots `Code` restent séparés par domaine et ne doivent pas confondre authz serveur, feature flags et feature levels.
3. Toute réévaluation de capabilities `write` dédiées pour `blog` ou `homepage` doit partir d’un besoin produit explicite sur les rôles admin.
4. Garder chaque lot réversible, local et sans unification transverse.

## Validation

- `pnpm exec playwright test tests/e2e/admin/blog.spec.ts tests/e2e/admin/homepage.spec.ts tests/e2e/admin/media.spec.ts`
  - Observé : `4 passed`
- `pnpm run lint`
  - Observé : vert
- `pnpm exec vitest run tests/unit/entities/blog/blog-post-publishability.test.ts`
  - Inconnu dans ce suivi : exécution précédemment bloquée par un `EPERM` local sur `.vite-temp`, non reconfirmée ici
