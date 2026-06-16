# Commerce Customers Admin V1 — Référence d'implémentation

**Date :** 2026-06-16
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** admin `commerce/customers` (`/admin/commerce/customers`)

---

## 1. Objectif fonctionnel

Donner une première surface admin exploitable du domaine coeur `customers` :

- lister les clientes dans un tableau partagé cohérent avec la doctrine admin ;
- ouvrir une fiche client standalone, sans split view ;
- exposer les informations métier utiles à l'exploitation courante ;
- permettre une édition bornée du référentiel client sans dériver vers `crm`.

---

## 2. Périmètre réellement implémenté

### Listing admin

- page liste pleine largeur sur `/admin/commerce/customers`
- tableau partagé avec :
  - tri ;
  - recherche ;
  - filtre de statut ;
  - pagination ;
  - drawer mobile `Filtres`
- liens ligne → fiche client standalone

### Fiche client admin

- route standalone `/admin/commerce/customers/[customer]`
- pas de split view
- URL canonique lisible de la forme :
  - `prenom-nom~<id>`
  - fallback email local-part si aucun nom exploitable
- redirection propre si l'URL reçue n'est pas canonique

### Lecture métier affichée

- identité client ;
- statut ;
- consentements email / SMS ;
- dates lifecycle visibles ;
- adresses actives ;
- commandes récentes.

### Édition bornée

Le formulaire intégré à la fiche permet d'éditer :

- `firstName`
- `lastName`
- `displayName`
- `phone`
- `status`
- `acceptsEmail`
- `acceptsSms`
- `notes`

---

## 3. Hors périmètre assumé

- split view clients ;
- création manuelle de client depuis l'admin ;
- archivage / restauration client via action dédiée ;
- fusion de clients ;
- édition des adresses client ;
- historique détaillé d'activité ;
- projections `crm`, support ou segmentation avancée ;
- bulk actions sur clientes.

---

## 4. Invariants métier et UI

- `customers` reste la vérité métier du client ; on ne dérive pas vers `users` ni `crm`.
- la fiche admin reste standalone et sobre ; pas de panneau détail parallèle.
- l'URL reste lisible mais la résolution métier reste stable grâce au suffixe `~id`.
- le formulaire général ne pilote pas l'archivage.
- le statut `ARCHIVED` n'est pas exposé dans l'édition standard.

---

## 5. Lifecycle géré dans ce lot

Le formulaire autorise uniquement les statuts :

- `LEAD`
- `ACTIVE`
- `INACTIVE`
- `BLOCKED`

Comportement serveur associé :

- passage à `ACTIVE` : initialise `activatedAt` si absent ;
- passage à `BLOCKED` : initialise `blockedAt` si absent ;
- sortie de `BLOCKED` : remet `blockedAt` à `null` ;
- flux standard : maintient `archivedAt = null`.

Le statut `ARCHIVED` suppose un flux dédié, non implémenté dans ce lot.

---

## 6. Capabilities

| Action | Capability |
| --- | --- |
| Lecture page liste / fiche | `admin.commerce.customers.read` |
| Mise à jour du client | `admin.commerce.customers.write` |

Note : la capability `read` est déjà utilisée dans la navigation admin. La capability `write` est consommée par la server action du formulaire.

---

## 7. Fichiers principaux

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/commerce/customers/page.tsx` | Entrée RSC de la liste clients |
| `app/admin/(protected)/commerce/customers/[customer]/page.tsx` | Fiche client standalone |
| `features/admin/customers/routes/customers-list-page.tsx` | Composition serveur de la liste |
| `features/admin/customers/components/customer-table.tsx` | Tableau + pagination + mobile cards |
| `features/admin/customers/components/customer-list-filters.tsx` | Barre filtres / tri |
| `features/admin/customers/components/customer-mobile-filters-drawer.tsx` | Drawer mobile |
| `features/admin/customers/components/customer-detail-form.tsx` | Formulaire client de la fiche |
| `features/admin/customers/actions/update-admin-customer.action.ts` | Server Action de mise à jour |
| `features/admin/customers/queries/list-admin-customers.query.ts` | Lecture paginée / triée du listing |
| `features/admin/customers/queries/get-admin-customer-detail.query.ts` | Lecture détaillée d'une cliente |
| `features/admin/customers/schemas/update-admin-customer.schema.ts` | Validation Zod du formulaire |
| `features/admin/customers/shared/admin-customers-routes.ts` | Convention de route canonique |
| `entities/customer/*` | libellés, statuts, filtres, pagination, tri |

---

## 8. Structure module

Le module `features/admin/customers` est organisé avec :

- `actions/`
- `components/`
- `queries/`
- `routes/`
- `schemas/`
- `shared/`
- `types/`
- barrels locaux et barrel module `features/admin/customers/index.ts`

Cette structure est intentionnelle et alignée avec la doctrine de modules admin déjà observée dans le repo.

---

## 9. Vérifications réalisées

- suppression du split view clients au profit d'une fiche standalone ;
- contrôle TypeScript global via `tsc --noEmit` avec le runtime Node local ;
- validation de la cohérence module :
  - routes ;
  - barrels ;
  - query ;
  - schema ;
  - action ;
  - formulaire.

---

## 10. Points ouverts

- capability `admin.commerce.customers.write` à expliciter plus largement si une matrice documentaire centralisée est ajoutée ;
- flux dédié d'archivage / restauration client ;
- édition des adresses depuis l'admin ;
- outillage support / CRM hors domaine coeur `customers`.

---

## Documents liés

- `docs/domains/core/commerce/customers.md`
- `AGENTS.md`
