# V8-1 — Fondations Thème : Tokens et Dark Mode

## Objectif

Poser le socle commun de tokens CSS sur lequel s'appuient tous les autres lots V8. Ce lot a deux chantiers distincts : normaliser la couleur de marque comme token, et établir une couverture dark mode systématique des surfaces principales.

## Pourquoi ce lot est prioritaire

Sans `--brand` comme token, chaque lot qui suit (V8-2 shell, V8-3 composants) risque de réintroduire la valeur en dur. Sans dark mode stabilisé, les migrations V8-3 et V8-4 produiront des composants visuellement corrects en light mais incohérents en dark.

Ce lot ne crée pas de nouveaux composants. Il normalise ce qui existe.

## Périmètre strict

**In scope :**

- Introduction du token `--brand` (couleur de marque `#8f5d2d`) dans `globals.css`
- Déclinaison dark du token `--brand` si la valeur doit être ajustée
- Remplacement de toutes les occurrences de la valeur arbitraire dans les composants actifs
- Audit et complétion des tokens `--sidebar-*` dans la section `.dark {}`
- Vérification de la couverture dark mode des surfaces principales listées ci-dessous

**Out of scope :**

- Modification du shell (V8-2)
- Migration des composants cards (V8-3)
- Introduction de nouvelles dépendances npm
- Modification de composants non concernés par la couleur de marque ou les tokens dark

## Chantier 1 — Token de marque

### Contexte

La couleur `#8f5d2d` est utilisée comme valeur arbitraire Tailwind (`text-[#8f5d2d]`) dans au moins deux composants connus : `AdminShell` et `AdminSidebar`. Un grep préalable confirmera l'étendue réelle.

### Critères de qualité

- Token déclaré dans `:root {}` et `.dark {}` de `globals.css`
- Valeur OKLCH (cohérent avec le reste des tokens shadcn)
- Zéro occurrence de `#8f5d2d` dans `app/` et `components/` après migration
- Les composants modifiés utilisent `text-[var(--brand)]` ou une utility Tailwind configurée

### Points d'attention

- Vérifier si la valeur OKLCH equivalente rend identiquement dans les navigateurs cibles avant de valider
- En dark mode, le brun de marque sur fond sombre peut nécessiter un ajustement léger de luminosité pour maintenir un contraste suffisant — à évaluer visuellement

## Chantier 2 — Dark mode systématique

### Contexte

Le dark mode est activé via `next-themes` (classe `.dark` sur `<html>`). shadcn/ui déclare ses tokens dans `:root {}` et `.dark {}` — le pattern est établi. Ce chantier vérifie et complète cette déclaration pour les surfaces qui en ont besoin.

### Surfaces à couvrir

| Surface                          | Tokens attendus                                                                                                                         |
| -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| Fond page et layout              | `--background`, `--foreground`                                                                                                          |
| Sidebar                          | `--sidebar-background`, `--sidebar-foreground`, `--sidebar-accent`, `--sidebar-accent-foreground`, `--sidebar-border`, `--sidebar-ring` |
| Cards et panneaux                | `--card`, `--card-foreground`, `--border`                                                                                               |
| Formulaires                      | `--input`, `--ring`, `--muted`, `--muted-foreground`                                                                                    |
| Boutons primaires et secondaires | `--primary`, `--primary-foreground`, `--secondary`, `--secondary-foreground`                                                            |
| États destructifs                | `--destructive`, `--destructive-foreground`                                                                                             |
| Couleur de marque                | `--brand` (déclinaison dark)                                                                                                            |
| États interactifs                | `--accent`, `--accent-foreground`                                                                                                       |
| Badges et statuts                | Vérification visuelle des variants `Badge` en dark                                                                                      |

### Méthode

1. Lire la section `.dark {}` de `globals.css` — identifier les tokens présents et absents
2. Pour chaque token absent mais listé ci-dessus : ajouter une valeur cohérente avec le thème dark existant
3. Activer dark mode manuellement (`next-themes` ou classe `.dark` en dev) et vérifier visuellement chaque surface
4. Ne pas ajouter de valeur pour une surface qui n'existe pas encore dans l'interface — se limiter aux surfaces actives

### Critères de qualité dark mode

Une surface est **dark compliant** quand :

- son rendu repose uniquement sur des tokens CSS sémantiques
- aucune valeur de couleur en dur n'est présente dans ses composants
- le contraste texte/fond est lisible (pas besoin d'un audit WCAG formel — jugement visuel suffit pour ce lot)

## Vérifications de fin de lot

```bash
# Aucune valeur de marque en dur dans les composants actifs
grep -r "#8f5d2d" app/ components/

# Typecheck
pnpm run typecheck

# Si dark mode testable en e2e
pnpm exec playwright test --grep "admin"
```

## Fichiers attendus modifiés

- `app/globals.css` (ou équivalent CSS racine)
- `components/admin/admin-shell.tsx`
- `components/admin/admin-sidebar.tsx`
- Tout autre fichier révélé par le grep initial sur `#8f5d2d`
