# Settings Orders V1 — Référence d'implémentation

**Date :** 2026-06-10
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** configuration de la numérotation des commandes et impact sur la création de commande

---

## 1. Objectif fonctionnel

Permettre à l'administrateur de définir un préfixe personnalisé pour les références de commande. Ce préfixe est appliqué à toutes les nouvelles commandes créées après l'enregistrement du réglage. Les commandes existantes ne sont pas modifiées.

---

## 2. Modèle de données utilisé

Un seul champ sur le modèle `Store` :

| Champ | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `orderNumberPrefix` | `String?` | `null` | Préfixe des références de commande |

Contraintes de validation (`orderSettingsSchema`) :
- Transformé en majuscules automatiquement.
- Lettres majuscules et chiffres uniquement (`/^[A-Z0-9]+$/`).
- 1 à 10 caractères.
- Valeur vide soumise → `null` persisté (retour au préfixe par défaut).

---

## 3. Page admin — `/admin/settings/orders`

### Accès

| Capability | Usage |
| --- | --- |
| `admin.settings.orders.read` | Chargement de la page et lecture des réglages |
| `admin.settings.orders.write` | Soumission du formulaire de mise à jour |

### Composants

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/orders/page.tsx` | Page RSC, vérifie `orders.read`, charge les settings |
| `features/admin/settings/components/order-settings-form.tsx` | Formulaire client avec aperçu de référence en temps réel |
| `features/admin/settings/actions/update-admin-order-settings.action.ts` | Server Action, vérifie `orders.write`, persiste en DB |
| `features/admin/settings/queries/get-admin-order-settings.query.ts` | Lecture de `orderNumberPrefix` depuis le premier store |
| `features/admin/settings/schemas/order-settings.schema.ts` | Validation Zod (`orderSettingsSchema`) |

### Comportement de l'action

1. Vérifie la capability `admin.settings.orders.write`.
2. Normalise la valeur brute : chaîne vide → `null`.
3. Parse via `orderSettingsSchema` (transformation majuscules + validation regex).
4. Charge le `storeId` courant via `getCurrentStoreId`.
5. Met à jour `Store.orderNumberPrefix` via `db.store.update`.
6. Revalide le cache de `/admin/settings/orders`.
7. Retourne un état `success` ou `error` avec messages de champs si pertinent.

### Comportement de la page

La page gère explicitement le cas `null` retourné par `getAdminOrderSettings` (boutique introuvable) : elle affiche un message d'erreur à la place du formulaire. Le formulaire affiche un aperçu dynamique de la référence générée (`PREFIX-XXXXXXXXXX`), mis à jour en temps réel sans soumission.

---

## 4. Impact sur la création de commande

Dans `order.repository.ts`, la fonction `createOrderFromGuestCartToken` lit `store.orderNumberPrefix` avant d'entrer en transaction et le passe à `createOrderReference(orderPrefix)`.

```text
orderNumberPrefix = "CMD"  → référence : "CMD-XXXXXXXXXX"
orderNumberPrefix = null   → référence : "CRY-XXXXXXXXXX"  (DEFAULT_ORDER_REFERENCE_PREFIX)
```

Le préfixe par défaut `"CRY"` est défini dans `entities/order/order-reference.ts` (`DEFAULT_ORDER_REFERENCE_PREFIX`). La partie aléatoire (`XXXXXXXXXX`) est générée via `randomBytes` avec l'alphabet `ABCDEFGHJKLMNPQRSTUVWXYZ23456789` (10 caractères, ambiguïtés visuelles exclues).

La validation de format `isValidOrderReference` accepte `^[A-Z0-9]{1,10}-[A-Z0-9]{10}$`.

---

## 5. Limitations V1

- **Pas de séquence numérique.** Les références sont aléatoires, pas incrémentales. Il n'y a pas de compteur de commande configurable.
- **Pas de remise à zéro.** Aucun mécanisme de reset de numérotation par période (année, mois).
- **Préfixe unique par store.** Un seul préfixe est possible ; pas de format composite (ex. `ANNEE-PREFIX-NUMERO`).
- **Store unique.** `getAdminOrderSettings` lit le premier store par `createdAt`. Pas de contexte multi-store pour ces réglages en V1.
- **Aucun impact sur les commandes existantes.** Le changement de préfixe ne renumérote pas l'historique.

---

## 6. Checklist QA

Pour chaque scénario : précondition → action → résultat attendu.

---

### Scénario 1 — Définir un préfixe personnalisé

**Précondition :** `orderNumberPrefix` est `null` (valeur par défaut).

**Action :** saisir `"CMD"` dans le formulaire, soumettre.

**Résultat attendu :** réglage enregistré. La prochaine commande créée a une référence de la forme `CMD-XXXXXXXXXX`.

---

### Scénario 2 — Aperçu en temps réel

**Précondition :** formulaire ouvert.

**Action :** modifier le champ préfixe sans soumettre.

**Résultat attendu :** l'aperçu `PREFIX-XXXXXXXXXX` se met à jour immédiatement. Aucune requête serveur n'est déclenchée.

---

### Scénario 3 — Valeur vide (retour au défaut)

**Précondition :** `orderNumberPrefix` est `"CMD"`.

**Action :** vider le champ, soumettre.

**Résultat attendu :** `orderNumberPrefix` passe à `null`. La prochaine commande utilise le préfixe par défaut `"CRY"`.

---

### Scénario 4 — Valeur invalide (caractères non autorisés)

**Précondition :** formulaire ouvert.

**Action :** saisir `"cmd-!"` (minuscules et caractère spécial), soumettre.

**Résultat attendu :** le schéma transforme en majuscules (`"CMD-!"`), la regex `/^[A-Z0-9]+$/` rejette la valeur. Une erreur de champ est affichée. Aucune persistance.

---

### Scénario 5 — Préfixe trop long

**Précondition :** formulaire ouvert.

**Action :** saisir 11 caractères, soumettre.

**Résultat attendu :** erreur de validation `"Le préfixe ne peut pas dépasser 10 caractères"`. Aucune persistance.

---

### Scénario 6 — Commandes existantes non affectées

**Précondition :** des commandes avec préfixe `"CRY"` existent en base.

**Action :** changer le préfixe en `"CMD"`, soumettre.

**Résultat attendu :** les commandes existantes conservent leur référence `CRY-XXXXXXXXXX`. Seules les nouvelles commandes utilisent `CMD-XXXXXXXXXX`.

---

## Documents liés

- `docs/lots/2026-06-10-checkout-v1-reference.md`
- `docs/lots/2026-06-10-settings-payments-v1-reference.md`
- `docs/lots/2026-06-10-settings-shipping-v1-reference.md`
- `docs/domains/core/commerce/orders.md`
- `AGENTS.md`
