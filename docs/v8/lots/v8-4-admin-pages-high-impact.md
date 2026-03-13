# V8-4 — Cohérence Pages Haute Visibilité

## Objectif

Affiner la structure et la cohérence visuelle des pages admin les plus consultées. Après V8-2 et V8-3, les composants et le shell sont conformes — ce lot s'assure que les pages elles-mêmes forment un ensemble cohérent : même structure d'en-tête, même logique de composition, même hiérarchie visuelle.

## Prérequis

- V8-1 terminé (tokens disponibles)
- V8-3 terminé ou en cours — les composants migrés doivent être disponibles pour les pages

## Périmètre strict

**In scope :**
- Structure d'en-tête de page (titre, description, actions) — homogénéisation
- Utilisation de `AdminFormSection`, `AdminFormField`, `AdminFormActions` là où ils s'appliquent et ne sont pas encore utilisés
- Utilisation des composants migrés V8-3 dans les pages
- Cohérence des espacements et de la hiérarchie typographique entre pages

**Out of scope :**
- Modification des Server Actions ou de la logique métier
- Changement des données affichées ou de leur source
- Nouveaux formulaires ou nouveaux champs
- Graphiques ou visualisations (recharts non installé)

## Pages cibles

| Route | Priorité | Raison |
|---|---|---|
| `/admin` (dashboard) | Haute | Première page vue à chaque connexion |
| `/admin/homepage` | Haute | Page de formulaires complexe, sections extraites en V7 |
| `/admin/products/[id]` | Haute | Page de détail produit — nombreux champs |
| `/admin/orders/[id]` | Haute | Page de détail commande — statuts, timeline |

## Analyse préalable obligatoire

Lire chaque page cible avant d'intervenir. Les besoins réels peuvent différer de ce qui est anticipé ici. L'objectif est la cohérence — pas l'uniformité mécanique.

```bash
# Lister les fichiers concernés
ls app/admin/\(protected\)/
ls app/admin/\(protected\)/products/
ls app/admin/\(protected\)/orders/
```

## Ce qui constitue la cohérence V8 pour une page

### En-tête de page

Toutes les pages haute visibilité doivent avoir une structure d'en-tête reconnaissable :
- Un titre de niveau `h1` ou équivalent sémantique, visible et distinct
- Une description optionnelle (contexte, instructions courtes)
- Des actions de page si applicables (bouton créer, sauvegarder, etc.) — positionnées de manière cohérente par rapport au titre

La hiérarchie doit être lisible en un coup d'œil. L'en-tête ne doit pas être noyé dans la mise en page.

### Composition des sections

Les pages à formulaires utilisent `AdminFormSection` pour délimiter les groupes logiques, `AdminFormField` pour chaque champ avec son label, et `AdminFormActions` pour les actions de soumission. Si ces composants existent déjà sur la page, vérifier leur usage — pas besoin de les réintroduire s'ils sont déjà corrects.

### Composants migrés

Les pages qui affichent des statuts (commandes) ou des tags (produits) utilisent `Badge` après V8-3. Vérifier que la migration V8-3 est bien utilisée sur ces pages et non les anciens composants legacy.

## Critères de qualité

Une page est V8-conforme dans ce lot quand :
- son en-tête est structuré et lisible
- ses sections de formulaire utilisent les composants admin dédiés
- elle n'importe pas de classe CSS legacy
- elle est dark compliant (rendu correct en mode dark sans ajustement manuel)

## Vérifications de fin de lot

```bash
pnpm run typecheck
pnpm exec playwright test --grep "admin"
```

Test manuel sur les 4 pages en light mode et dark mode.

## Fichiers attendus modifiés

- `app/admin/(protected)/page.tsx`
- `app/admin/(protected)/homepage/page.tsx`
- Sections extraites dans `app/admin/(protected)/homepage/` (si besoin)
- `app/admin/(protected)/products/[id]/page.tsx` (si existant)
- `app/admin/(protected)/orders/[id]/page.tsx` (si existant)
