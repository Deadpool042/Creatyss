# Settings Shipping V1 — Référence d'implémentation

**Date :** 2026-06-10
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** configuration des tarifs de livraison et impact sur le checkout

---

## 1. Objectif fonctionnel

Permettre à l'administrateur de configurer les frais de livraison standard et le seuil de livraison offerte. Ces réglages créent ou mettent à jour des enregistrements `ShippingZone` et `ShippingMethod` en base, qui sont ensuite lus par le checkout pour proposer les méthodes disponibles à l'acheteur.

---

## 2. Modèle de données utilisé

Les settings livraison ne modifient pas le modèle `Store`. Ils opèrent sur deux entités dédiées :

### ShippingZone

| Champ | Valeur fixée en V1 | Rôle |
| --- | --- | --- |
| `code` | `"FR"` | Identifiant unique de la zone (France) |
| `name` | `"France"` | Libellé affiché |
| `status` | `"ACTIVE"` | Toujours active en V1 |

La zone `"FR"` est upsertée à chaque sauvegarde. Elle sert de rattachement obligatoire pour les méthodes de livraison.

### ShippingMethod

Deux méthodes sont gérées par convention de code :

| Code | Libellé | Rôle |
| --- | --- | --- |
| `"STANDARD"` | Livraison standard | Frais fixes appliqués à toutes les commandes |
| `"FREE"` | Livraison offerte | Activée si un seuil est défini, désactivée sinon |

Champs significatifs sur `ShippingMethod` :

| Champ | Type | Rôle |
| --- | --- | --- |
| `amount` | `Decimal` | Montant des frais (0 pour FREE) |
| `minSubtotalAmount` | `Decimal?` | Seuil de déclenchement de la livraison offerte |
| `status` | `"ACTIVE"` / `"INACTIVE"` | Contrôle la visibilité dans le checkout |
| `isDefault` | `Boolean` | `true` pour STANDARD, `false` pour FREE |
| `currencyCode` | `CurrencyCode` | Devise du store, transmise via champ caché |

---

## 3. Page admin — `/admin/commerce/shipping/settings`

L'ancienne URL `/admin/settings/shipping` reste une route de compatibilité qui redirige vers
`/admin/commerce/shipping/settings`.

### Accès

| Capability | Usage |
| --- | --- |
| `admin.settings.shipping.read` | Chargement de la page et lecture des réglages |
| `admin.settings.shipping.write` | Soumission du formulaire de mise à jour |

### Composants

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/commerce/shipping/settings/page.tsx` | Page RSC, vérifie `shipping.read`, charge les settings |
| `app/admin/(protected)/settings/shipping/page.tsx` | Redirect de compatibilité vers la page domaine |
| `features/admin/settings/components/shipping-settings-form.tsx` | Formulaire client avec champs montants décimaux |
| `features/admin/settings/actions/update-admin-shipping-settings.action.ts` | Server Action, vérifie `shipping.write`, upsert zone + méthodes |
| `features/admin/settings/queries/get-admin-shipping-settings.query.ts` | Lecture de STANDARD et FREE depuis la DB |
| `features/admin/settings/schemas/shipping-settings.schema.ts` | Validation Zod (`shippingSettingsSchema`) |

### Comportement de l'action

1. Vérifie la capability `admin.settings.shipping.write`.
2. Parse via `shippingSettingsSchema` : `standardShippingAmount` (number ≥ 0), `freeShippingThreshold` (number ≥ 0 ou `null` si vide), `currencyCode` (string).
3. Charge le `storeId` courant via `getCurrentStoreId`.
4. Upsert `ShippingZone` code `"FR"` (création si absente, sinon no-op).
5. Upsert `ShippingMethod` code `"STANDARD"` avec le montant saisi.
6. Si seuil défini → upsert `ShippingMethod` code `"FREE"` avec `minSubtotalAmount` et `status: "ACTIVE"`.
7. Si seuil absent → passe `ShippingMethod` code `"FREE"` en `status: "INACTIVE"` (jamais supprimé).
8. Revalide le cache de `/admin/commerce/shipping/settings`.

### Comportement de la query

`getAdminShippingSettings` lit :
- `ShippingMethod` code `"STANDARD"` → `amount` converti en `Number`.
- `ShippingMethod` code `"FREE"` → `minSubtotalAmount` si `status === "ACTIVE"`, sinon `null`.
- `Store.defaultCurrency` → passé comme `currencyCode` dans le formulaire via champ caché.

Retourne `null` si aucun store n'est trouvé (la page affiche alors "Boutique introuvable").

---

## 4. Impact sur le checkout

`getAvailableShippingMethods({ storeId, subtotalCents })` lit les `ShippingMethod` à l'état `ACTIVE` pour le store. La logique de sélection est :

```text
ShippingMethod "FREE" ACTIVE + minSubtotalAmount ≤ subtotalCents
  → livraison offerte (frais = 0)

ShippingMethod "STANDARD" ACTIVE
  → frais fixes (amount)

Aucune méthode ACTIVE
  → liste vide, checkout bloqué
```

Le checkout affiche le montant de livraison calculé dans le récapitulatif. La méthode sélectionnée est persistée dans `CheckoutShippingSelection` et revalidée dans la transaction de création de commande (`createOrderFromGuestCartToken`).

---

## 5. Limitations V1

- **Zone France uniquement.** La zone `"FR"` est hardcodée. Pas de gestion multi-zone, pas de zones par code postal ni par région.
- **Deux méthodes fixes.** Seules `STANDARD` et `FREE` existent. Pas de méthode express, pas de transporteur externe, pas de calcul par poids ou dimension.
- **Frais fixes.** Le montant de `STANDARD` est statique. Pas de calcul dynamique selon le panier.
- **Decimal → Number.** Les montants sont lus depuis Prisma (`Decimal`) et convertis via `Number()`. La précision des centimes n'est pas garantie pour des montants fractionnaires complexes.
- **Pas de suppression.** La méthode `FREE` n'est jamais supprimée, seulement désactivée (`INACTIVE`). Une réactivation ultérieure restaure la méthode existante.
- **Store unique.** `getAdminShippingSettings` lit le premier store par `createdAt`. Pas de contexte multi-store en V1.

---

## 6. Checklist QA

Pour chaque scénario : précondition → action → résultat attendu.

---

### Scénario 1 — Frais standard uniquement (livraison offerte désactivée)

**Précondition :** seuil livraison offerte vide.

**Action :** définir frais standard à `5.90`, soumettre.

**Résultat attendu :** `ShippingMethod "STANDARD"` à `5.90`. `ShippingMethod "FREE"` passée en `INACTIVE` si elle existait. Le checkout propose uniquement "Livraison standard – 5,90 €" quelle que soit la valeur du panier.

---

### Scénario 2 — Livraison offerte activée

**Précondition :** frais standard définis.

**Action :** définir seuil livraison offerte à `50.00`, soumettre.

**Résultat attendu :** `ShippingMethod "FREE"` upsertée `ACTIVE` avec `minSubtotalAmount = 50`. Le checkout propose "Livraison offerte" pour les paniers ≥ 50 €, "Livraison standard" sinon.

---

### Scénario 3 — Désactivation de la livraison offerte

**Précondition :** seuil livraison offerte défini à `50.00`.

**Action :** vider le champ seuil, soumettre.

**Résultat attendu :** `ShippingMethod "FREE"` passe en `INACTIVE`. Le checkout ne propose plus que "Livraison standard". La méthode FREE reste en DB avec `status: INACTIVE`.

---

### Scénario 4 — Frais standard à zéro

**Précondition :** aucun réglage.

**Action :** définir frais standard à `0`, laisser seuil vide, soumettre.

**Résultat attendu :** `ShippingMethod "STANDARD"` à `0`. Le checkout affiche "Offert" pour la livraison standard. Toutes les commandes bénéficient de la livraison gratuite sans condition de seuil.

---

### Scénario 5 — Valeur invalide (montant négatif)

**Précondition :** formulaire ouvert.

**Action :** saisir `-5` dans le champ frais standard, soumettre.

**Résultat attendu :** le schéma Zod rejette la valeur (`min(0)`). Une erreur de champ est affichée. Aucune persistance.

---

### Scénario 6 — Impact commande : frais inclus dans le total

**Précondition :** `ShippingMethod "STANDARD"` à `5.90`, panier sous le seuil de livraison offerte.

**Action :** sélectionner la méthode de livraison, soumettre la commande.

**Résultat attendu :** `Payment.amountAuthorized` inclut les frais de livraison (`subtotal + 5.90`). La page de confirmation affiche la ligne livraison à `5,90 €`.

---

### Scénario 7 — Aucune méthode active (checkout bloqué)

**Précondition :** `ShippingMethod "STANDARD"` inexistante ou `INACTIVE`, `ShippingMethod "FREE"` `INACTIVE`.

**Action :** accéder au checkout.

**Résultat attendu :** aucune méthode de livraison proposée. Le bouton "Créer la commande" reste désactivé.

---

## Documents liés

- `docs/lots/2026-06-10-checkout-v1-reference.md`
- `docs/lots/2026-06-10-settings-payments-v1-reference.md`
- `docs/lots/2026-06-10-settings-orders-v1-reference.md`
- `docs/domains/optional/commerce/shipping.md`
- `AGENTS.md`
