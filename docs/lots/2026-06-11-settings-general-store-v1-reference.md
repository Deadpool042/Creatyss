# Settings Général & Boutique V1 — Référence d'implémentation

**Date :** 2026-06-11
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** identité de la boutique (`/admin/settings/general`) et configuration technique du store (`/admin/settings/store`)

---

## 1. Objectif fonctionnel

Deux pages distinctes sur le même modèle `Store` :

- **Général** : tout ce qui décrit la boutique — identité légale, contact, adresse, réseaux sociaux, texte « Livraison & retours » des fiches produit, paramètres régionaux ;
- **Boutique** : la configuration technique du store — statut (`StoreStatus`) et drapeau production.

---

## 2. Champs `Store` édités

### `/admin/settings/general` (action `update-admin-store-settings`)

| Champ | Validation | Consommation |
| --- | --- | --- |
| `name` | requis, max 100 | partout |
| `legalName`, `siret` (max 20), `vatNumber` (uppercase, max 20) | optionnels | mentions légales (seed), identité légale |
| `supportEmail`, `supportPhone` | email/max 30 | contact storefront |
| `addressLine1/City/PostalCode/Country` | optionnels | contact, mentions légales |
| `instagramUrl`, `facebookUrl` | URL | footer/contact |
| `shippingReturnsPolicy` | max 2000 | bloc « Livraison & retours » des fiches produit (PAS la page légale `/politique-retour` — voir réf. legal-v1) ; aussi éditable dans Contenu > Homepage |
| `defaultCurrency`, `defaultLocaleCode`, `timezone` | enum/min | calculs prix, formats |

### `/admin/settings/store` (action `update-admin-store-config`)

| Champ | Comportement |
| --- | --- |
| `status` | enum `StoreStatus` ; `activatedAt` posé au premier passage actif |
| `isProduction` | drapeau prod-like |

---

## 3. Capabilities

| Page | Read | Write |
| --- | --- | --- |
| general | `admin.settings.general.read` | `admin.settings.general.write` |
| store | `admin.settings.store.read` | `admin.settings.store.write` |

---

## 4. Fichiers

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/{general,store}/page.tsx` | Pages RSC, guard read |
| `features/admin/settings/components/store-settings-form.tsx` | Form général (`useActionState`, erreurs champ, sticky footer) |
| `features/admin/settings/schemas/store-settings.schema.ts` | Validation Zod |
| `features/admin/settings/actions/update-admin-store-{settings,config}.action.ts` | Server Actions, guard write |
| `features/admin/settings/queries/get-admin-store-{settings,config}.query.ts` | Lectures |

---

## 5. Limites assumées

- `shippingReturnsPolicy` éditable sur deux surfaces (general + homepage) — signalé dans les deux hints, consolidation éventuelle future ;
- pas d'upload de logo ni multi-adresse en V1.
