# Storefront typography accessibility

## Objectif

La typographie storefront doit rester lisible, cohérente, robuste au zoom navigateur, adaptée aux petits écrans, desktop et très grands écrans, et compatible avec les principes WCAG/W3C.

## Références WCAG/W3C prises en compte

- Resize Text : le texte doit rester exploitable jusqu'à 200% de zoom.
- Reflow : le contenu doit rester utilisable à 320 CSS px sans scroll horizontal fonctionnel.
- Text Spacing : le layout ne doit pas casser si l'utilisateur augmente l'interlignage, l'espacement des lettres ou des mots.
- Relative units : privilégier `rem`, `em` ou `clamp()` basé sur `rem`.
- Contraste : ne pas compenser une mauvaise lisibilité par des tailles trop petites.

## Règles générales

- Ne pas introduire de micro-texte fonctionnel sous `0.75rem`.
- Eviter les tailles de police en `px` dans le storefront.
- Eviter les valeurs arbitraires proches et non justifiées.
- Préférer une convention par rôle plutôt qu'un ajustement visuel ponctuel.
- Les tailles doivent rester compatibles avec le zoom navigateur.
- Les textes fonctionnels doivent rester lisibles en mobile, desktop et 4K.
- Un texte fonctionnel ne doit pas rester inutilement minuscule sur très grand écran.
- Ne pas multiplier les `clamp()` sans nécessité.

Exemples à éviter :

- `text-[0.48rem]`
- `text-[0.55rem]`
- `text-[0.6rem]`
- `text-[0.65rem]`
- `text-[10px]`
- `text-[11px]`
- `text-[13px]`
- `text-[13.5px]`

## Convention locale storefront

| Rôle                  | Taille minimale | Usage                                                  |
| --------------------- | --------------: | ------------------------------------------------------ |
| Label compact         |         0.75rem | labels uppercase, petits libellés courts               |
| Badge                 |         0.75rem | badges produit, labels d'état                          |
| Metadata              |       0.8125rem | disponibilité, variantes, compteurs, infos secondaires |
| Aide courte           |       0.8125rem | textes d'aide, microcopy fonctionnelle                 |
| Texte courant compact |        0.875rem | descriptions courtes, blocs secondaires                |
| Texte courant normal  |            1rem | contenu principal                                      |
| Titre card / section  |           1rem+ | titres de cartes, titres de zones                      |

Cette convention est un socle minimal pour le storefront. Elle ne constitue pas une refonte globale du design system.

## Uppercase et tracking

- Les textes uppercase doivent rester courts.
- Uppercase + petite taille + tracking large peut nuire à la lisibilité.
- Préférer un tracking raisonnable sur les petits labels.
- Ne pas descendre sous `0.75rem` pour un label fonctionnel.

Exemple recommandé :

- `text-[0.75rem] tracking-[0.10em]`

Exemple à éviter :

- `text-[0.55rem] tracking-[0.16em]`

## Responsive et grands écrans

- Les tailles n'ont pas besoin d'être fluides partout.
- Pour les labels et metadata, des paliers en `rem` peuvent suffire.
- Quand une adaptation viewport est utile, utiliser `clamp()` basé sur `rem`.
- Le `clamp` doit rester sobre et ne pas créer une typographie trop grande sur 4K.

Exemple :

- `text-[clamp(0.8125rem,0.78rem+0.12vw,0.9375rem)]`

Précisions :

- Utiliser `clamp()` seulement si la taille doit réellement évoluer.
- Eviter d'introduire plusieurs valeurs `clamp` proches sans convention.

## Zoom navigateur

Les composants storefront doivent rester utilisables à zoom 200%.

A vérifier en priorité :

- topbar
- cards produit
- filtres
- drawer mobile
- pagination
- aside
- footer / bottom navigation

A 200% de zoom ou viewport équivalent, vérifier :

- aucun contrôle essentiel ne disparaît ;
- aucun texte fonctionnel critique n'est tronqué ;
- les boutons restent activables ;
- les liens restent lisibles ;
- l'overflow horizontal n'est pas aggravé ;
- la navigation mobile reste exploitable.

## Reflow / overflow

- Le storefront doit viser l'absence de scroll horizontal fonctionnel à 320 CSS px.
- Si un léger overflow préexistant est identifié, il doit être documenté et traité dans un lot dédié.
- Un lot typographique ne doit pas aggraver l'overflow.
- Les rails scrollables volontaires doivent être distingués d'un overflow global de page.

## Exceptions

Une exception est possible uniquement si :

- le texte n'est pas fonctionnel ;
- il est décoratif ou très secondaire ;
- il reste lisible ;
- il n'est pas nécessaire à la navigation ou à la compréhension ;
- la justification est explicitée dans le rapport de lot ou dans un commentaire si nécessaire.

Exemple tolérable :

Une tagline de marque trop compacte peut être masquée sur mobile landscape plutôt que rendue en micro-texte illisible.

## Validation attendue

Pour tout lot modifiant la typographie storefront, documenter ces commandes :

```bash
pnpm exec playwright test tests/e2e/public/boutique-page.spec.ts
pnpm exec playwright test tests/e2e/public/boutique-page.spec.ts tests/e2e/public/product-page.spec.ts
pnpm exec tsc --noEmit
pnpm lint
```

Si `tsconfig.tsbuildinfo` est modifié :

```bash
git restore tsconfig.tsbuildinfo
```

Ajouter aussi :

```bash
git status --porcelain
```

## Non-objectifs

Cette doctrine ne doit pas entraîner :

- une refonte globale du design system ;
- une augmentation brutale des hauteurs ;
- une modification des textes métier ;
- une modification des queries ;
- une modification de la pagination ;
- une modification data ou Prisma ;
- une modification admin ;
- l'ajout d'une dépendance ;
- un refactor large.
