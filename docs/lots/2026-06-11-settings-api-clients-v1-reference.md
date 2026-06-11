# Settings API Clients V1 — Référence d'implémentation

**Date :** 2026-06-11
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** clients d'API machine-to-machine (`/admin/settings/api-clients`)

---

## 1. Objectif fonctionnel

Déclarer des clients d'API (nom, code, description), leur émettre un secret et pouvoir les révoquer. La révocation est définitive (pas de réactivation en V1).

---

## 2. Modèles

`ApiClient`, `ApiClientSecret` (`prisma/core/foundation/api-clients.prisma`) ; permissions de client via la relation dédiée (grantedBy). Le secret n'est affiché qu'à la création.

---

## 3. Capabilities

| Action | Capability |
| --- | --- |
| Page (liste) | `admin.settings.api-clients.read` |
| Création | `admin.settings.api-clients.write` |
| Révocation | `admin.settings.api-clients.revoke` |

---

## 4. Fichiers

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/api-clients/page.tsx` | Page RSC, liste via `list-admin-api-clients.query` |
| `features/admin/settings/schemas/create-api-client.schema.ts` | Zod (name 2-100, code kebab/underscore, description ≤ 500) |
| `features/admin/settings/actions/create-api-client.action.ts` | Création + émission du secret |
| `features/admin/settings/actions/revoke-api-client.action.ts` | Révocation |

---

## 5. Limites assumées

Rotation de secret, scopes fins par client et journal d'usage hors périmètre V1. La capability `admin.settings.webhooks.read` est réservée (aucune surface webhooks à ce jour).
