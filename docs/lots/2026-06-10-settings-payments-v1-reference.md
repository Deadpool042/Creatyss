# Settings Payments V1 — Référence d'implémentation

**Date :** 2026-06-10
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** configuration des moyens de paiement manuels et impact sur le checkout

---

## 1. Objectif fonctionnel

Permettre à l'administrateur d'activer ou désactiver chaque moyen de paiement manuel disponible en V1 (virement bancaire, paiement à l'atelier), et d'associer des instructions texte à chacun.

Ces réglages conditionnent directement les méthodes proposées à l'acheteur dans le checkout, ainsi que les instructions affichées sur la page de confirmation de commande.

---

## 2. Champs ajoutés au modèle `Store`

| Champ | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `bankTransferEnabled` | `Boolean` | `false` | Active le virement bancaire comme moyen de paiement |
| `cashOnDeliveryEnabled` | `Boolean` | `false` | Active le paiement à l'atelier comme moyen de paiement |
| `bankTransferInstructions` | `String?` | `null` | Instructions affichées en confirmation pour le virement |
| `cashOnDeliveryInstructions` | `String?` | `null` | Instructions affichées en confirmation pour l'atelier |

Les deux champs `*Enabled` sont indépendants. Les deux champs `*Instructions` sont optionnels (max 1000 caractères, validés par `PaymentSettingsSchema`).

---

## 3. Page admin — `/admin/settings/payments`

### Accès

| Capability | Usage |
| --- | --- |
| `admin.settings.payments.read` | Chargement de la page et lecture des réglages |
| `admin.settings.payments.write` | Soumission du formulaire de mise à jour |

### Composants

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/payments/page.tsx` | Page RSC, vérifie `payments.read`, charge les settings |
| `features/admin/settings/components/payment-settings-form.tsx` | Formulaire client, gère l'état via `useFormState` |
| `features/admin/settings/actions/update-admin-payment-settings.action.ts` | Server Action, vérifie `payments.write`, persiste en DB |
| `features/admin/settings/queries/get-admin-payment-settings.query.ts` | Lecture des 4 champs depuis le premier store |
| `features/admin/settings/schemas/payment-settings.schema.ts` | Validation Zod (`PaymentSettingsSchema`) |

### Comportement de l'action

1. Vérifie la capability `admin.settings.payments.write`.
2. Parse le `FormData` via `PaymentSettingsSchema`.
3. Charge le `storeId` courant via `getCurrentStoreId`.
4. Met à jour les 4 champs sur le store via `db.store.update`.
5. Revalide le cache de `/admin/settings/payments`.
6. Retourne un état `success` ou `error` avec messages de champs si pertinent.

---

## 4. Impact sur le checkout

### 4.1 Méthodes filtrées selon les settings

`getAvailablePaymentMethods({ storeId })` lit les 4 champs du store et retourne uniquement les méthodes dont le flag `*Enabled` est `true`.

```text
bankTransferEnabled=true   → méthode "bank_transfer"    (label: "Virement bancaire")
cashOnDeliveryEnabled=true → méthode "cash_on_delivery" (label: "Paiement à l'atelier")
```

Si aucun flag n'est activé, la liste est vide : aucune méthode n'est proposée au checkout.

### 4.2 Validation à la sélection

`selectPaymentMethodAction` effectue les vérifications suivantes avant de persister la sélection dans le cookie `creatyss_checkout_payment` :

1. Validité du code soumis via `isCheckoutPaymentMethod` (type guard).
2. Chargement des méthodes disponibles via `getAvailablePaymentMethods`.
3. Vérification que la méthode soumise figure dans la liste — si ce n'est pas le cas, l'action retourne `"Ce mode de paiement n'est pas disponible."` sans écrire le cookie.

### 4.3 Revalidation au submit

`create-order-action.ts` effectue deux niveaux de vérification avant d'entrer en transaction :

1. **Validité syntaxique** : le code lu depuis le cookie est vérifié via `isCheckoutPaymentMethod`. S'il est absent ou invalide, le guard payment bloque la soumission (`?error=missing_payment_method`).
2. **Disponibilité effective** : les méthodes actives du store sont rechargées via `getAvailablePaymentMethods`. Si la méthode sélectionnée n'est plus disponible (désactivée par l'admin depuis la sélection), le cookie est effacé et l'acheteur est redirigé vers `/checkout?error=payment_method_unavailable` avec le message : _"Le mode de paiement sélectionné n'est plus disponible. Veuillez en choisir un autre."_

---

## 5. Limitations V1

- **Pas de PSP.** Aucun Stripe, PayPal, Mollie ni équivalent. Les deux seules méthodes supportées sont `bank_transfer` et `cash_on_delivery`. Tout encaissement est manuel.
- **Pas de remboursement.** Le modèle `PaymentRefund` existe en DB mais aucun flux de remboursement n'est implémenté.
- **Instructions non structurées.** Les `*Instructions` sont des champs texte libres (max 1000 caractères). Pas de champs IBAN/BIC structurés, pas de validation de format bancaire.
- **Pas d'historique des changements de settings.** Les modifications des réglages paiements ne sont pas tracées dans l'audit log en V1.
- **Store unique.** `getAdminPaymentSettings` lit le premier store par `createdAt`. Pas de contexte multi-store pour ces réglages en V1.

---

## 6. Checklist QA

Pour chaque scénario : précondition → action → résultat attendu.

---

### Scénario 1 — Les deux méthodes désactivées

**Précondition :** `bankTransferEnabled=false`, `cashOnDeliveryEnabled=false`.

**Action :** atteindre l'étape de sélection du mode de paiement dans le checkout.

**Résultat attendu :** aucune méthode proposée. La sélection est impossible.

---

### Scénario 2 — Virement seul activé

**Précondition :** `bankTransferEnabled=true`, `cashOnDeliveryEnabled=false`.

**Action :** atteindre l'étape de sélection du mode de paiement.

**Résultat attendu :** seul "Virement bancaire" est affiché. "Paiement à l'atelier" n'apparaît pas.

---

### Scénario 3 — Paiement à l'atelier seul activé

**Précondition :** `bankTransferEnabled=false`, `cashOnDeliveryEnabled=true`.

**Action :** atteindre l'étape de sélection du mode de paiement.

**Résultat attendu :** seul "Paiement à l'atelier" est affiché. "Virement bancaire" n'apparaît pas.

---

### Scénario 4 — Les deux méthodes activées

**Précondition :** `bankTransferEnabled=true`, `cashOnDeliveryEnabled=true`.

**Action :** atteindre l'étape de sélection du mode de paiement.

**Résultat attendu :** les deux méthodes sont proposées. L'acheteur peut en sélectionner une.

---

### Scénario 5 — Désactivation d'une méthode entre sélection et submit

**Précondition :** `bankTransferEnabled=true`. L'acheteur sélectionne "Virement bancaire" (cookie écrit). L'administrateur désactive ensuite `bankTransferEnabled` avant que l'acheteur soumette.

**Action :** l'acheteur soumet la commande.

**Résultat attendu :** `createOrderAction` recharge les méthodes disponibles, détecte que `bank_transfer` n'est plus active, efface le cookie de paiement et redirige vers `/checkout?error=payment_method_unavailable`. Le message affiché est : _"Le mode de paiement sélectionné n'est plus disponible. Veuillez en choisir un autre."_ Aucune commande n'est créée.

---

## Documents liés

- `docs/lots/2026-06-10-checkout-v1-reference.md`
- `docs/domains/optional/commerce/payments.md`
- `docs/domains/core/commerce/checkout.md`
- `AGENTS.md`
