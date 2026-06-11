# Settings Équipe V1 — Référence d'implémentation

**Date :** 2026-06-11
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** gestion des comptes administrateurs (`/admin/settings/team`)

---

## 1. Objectif fonctionnel

Créer, suspendre et réactiver des comptes administrateurs. Pas de gestion fine des rôles en V1 : un admin créé reçoit les rôles `admin` et `internal_super_admin` existants.

---

## 2. Modèles

`User`, `UserCredential`, `UserRole`, `Role` (`prisma/core/foundation/identity.prisma`). Création en transaction : user + credential (mot de passe ≥ longueur minimale, confirmation) + liaisons rôles. Suspension/réactivation par statut, sans suppression.

---

## 3. Capabilities

| Action | Capability |
| --- | --- |
| Page (lecture, liste) | `admin.settings.team.read` |
| Création | `admin.settings.team.write` |
| Suspension / réactivation | `admin.settings.team.suspend` |

---

## 4. Fichiers

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/team/page.tsx` | Page RSC, liste via `list-admin-users.query` |
| `features/admin/settings/schemas/create-admin-user.schema.ts` | Zod (email, displayName 2-100, password + confirmation) |
| `features/admin/settings/actions/create-admin-user.action.ts` | Création transactionnelle, refus email existant |
| `features/admin/settings/actions/{suspend,reactivate}-admin-user.action.ts` | Changement de statut |

---

## 5. Limites assumées

Attribution de rôles personnalisés, invitations par email et reset de mot de passe hors périmètre V1 ; pas de suppression de compte (suspension uniquement).
