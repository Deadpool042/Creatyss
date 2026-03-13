# V10-1 — Dashboard foundation

## Objectif

Transformer le dashboard admin d'une page de navigation vide en un poste de pilotage opérationnel. À l'issue de ce lot, l'administrateur peut ouvrir l'admin le matin et voir immédiatement l'état de la boutique sans naviguer dans chaque section.

## État avant

`app/admin/page.tsx` contient uniquement deux liens de navigation :
```tsx
<Link href="/admin/commandes">Commandes</Link>
<Link href="/admin/produits">Produits</Link>
```

Aucune donnée. Aucun signal. Page vide de sens opérationnel.

## État cible

Le dashboard affiche :

1. **Commandes en attente** — nombre de commandes avec `status = 'pending'`
2. **Paiements non confirmés** — nombre de commandes avec `payment.status ≠ 'paid'` et `status ≠ 'cancelled'`
3. **Stocks bas ou épuisés** — nombre de variantes avec `stock ≤ seuil` (seuil à définir, ex. 3)
4. **Total du mois** — somme des `totalAmount` des commandes du mois calendaire en cours

Chaque signal est accompagné d'un lien direct vers la page de gestion concernée.

## Signaux : spécification

### Signal 1 — Commandes en attente
- Source : `orders` WHERE `status IN ('pending', 'processing')`
- Affichage : count + lien vers `/admin/commandes?status=pending`
- Alerte visuelle si count > 0

### Signal 2 — Paiements non confirmés
- Source : `orders` WHERE `payment_status NOT IN ('paid')` AND `status NOT IN ('cancelled', 'refunded')`
- Affichage : count + lien vers `/admin/commandes`
- Alerte visuelle si count > 0

### Signal 3 — Stocks bas
- Source : `product_variants` WHERE `stock <= 3` AND `is_active = true`
- Seuil configurable via constante dans le fichier (pas d'env var pour l'instant)
- Affichage : count + lien vers `/admin/produits`
- Alerte visuelle si count > 0

### Signal 4 — Total du mois
- Source : `orders` WHERE `created_at >= premier jour du mois` AND `status NOT IN ('cancelled')`
- Affichage : somme formatée (même formatter que les prix existants)
- Pas d'alerte — indicateur neutre

## Architecture

### Repository
Ajouter des fonctions dans les repositories existants ou créer un repository dédié dashboard :

```typescript
// db/repositories/dashboard.repository.ts
export async function getDashboardSignals(): Promise<DashboardSignals>
```

Ou ajouter des fonctions ciblées dans les repositories existants :
```typescript
// db/repositories/order.repository.ts
export async function countPendingOrders(): Promise<number>
export async function countUnpaidActiveOrders(): Promise<number>
export async function getMonthRevenue(): Promise<number>

// db/repositories/product.repository.ts
export async function countLowStockVariants(threshold?: number): Promise<number>
```

### Page
`app/admin/page.tsx` devient un Server Component qui appelle ces fonctions en parallèle :

```typescript
const [pendingOrders, unpaidOrders, lowStock, monthRevenue] = await Promise.all([
  countPendingOrders(),
  countUnpaidActiveOrders(),
  countLowStockVariants(3),
  getMonthRevenue()
]);
```

### Composants
Pas de composant dédié requis. Les signaux sont rendus directement dans la page avec des classes V8-conformes (`store-card`, `admin-stat-card` si créée, ou structure existante).

## Design

Sobre et fonctionnel. Quatre blocs en grille 2×2 ou 4 colonnes selon l'espace. Chaque bloc :
- Chiffre en grand
- Label court
- Lien discret vers la section concernée
- Optionnel : badge rouge si alerte

Pas de graphiques, pas de courbes, pas de pourcentages d'évolution.

## Travail à réaliser

1. **Requêtes DB** — Écrire les 4 fonctions de lecture dans les repositories
2. **Page dashboard** — Modifier `app/admin/page.tsx` pour appeler les requêtes et afficher les signaux
3. **Vérifications** :
   - `pnpm run typecheck`
   - Vérifier manuellement que les chiffres correspondent à la base de test
   - Aucun test e2e nouveau requis dans ce lot (les signaux sont en lecture seule)

## Risques et garde-fous

- **Performance** : les 4 requêtes en `Promise.all` — si l'une est lente, le dashboard entier attend. Acceptable pour V10 ; optimisable en V11 avec Suspense boundaries.
- **Valeurs nulles** : si aucune commande ce mois-ci, afficher `0` (pas d'erreur).
- **Seuil stock** : la constante `LOW_STOCK_THRESHOLD = 3` doit être visible et modifiable facilement. Ne pas l'enterrer dans une requête SQL.

## Non-inclus dans ce lot

- Filtre ou tri sur le dashboard
- Graphiques ou visualisations
- Données historiques ou comparaisons
- Notifications en temps réel
