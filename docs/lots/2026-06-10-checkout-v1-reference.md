# Checkout V1 — Référence d'implémentation

**Date :** 2026-06-10
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** flux checkout complet de bout en bout, depuis l'ajout panier jusqu'à la gestion admin des paiements

---

## 1. Vue d'ensemble du flux

Le flux Checkout V1 couvre l'intégralité du parcours d'achat :

```
Boutique → Panier → Checkout (infos client + adresse)
       → Sélection livraison → Sélection paiement
       → Submit commande → Email transactionnel (non fatal)
       → Clear cookies → Confirmation publique
       → Admin : gestion des paiements
```

Le flux est entièrement sans authentification côté acheteur (guest checkout).

L'identité du panier circule via un cookie httpOnly signé HMAC (`cartToken`).

La transaction de création de commande est atomique : toutes les vérifications métier et toutes les écritures DB sont effectuées dans un seul bloc transactionnel.

---

## 2. Sources de vérité

Pour chaque donnée critique, la source d'autorité est :

| Donnée | Source d'autorité | Emplacement |
|---|---|---|
| Identité du panier | Cookie httpOnly signé HMAC `creatyss_cart` | `core/sessions/cart.ts` |
| Draft checkout (infos client, adresse) | Table `Checkout` + table `CheckoutAddress` | DB |
| Sélection livraison | Table `CheckoutShippingSelection` | DB |
| Mode de paiement sélectionné | Cookie httpOnly `creatyss_checkout_payment` | `core/sessions/checkout-payment.ts` |
| Enregistrement paiement | Table `Payment`, statut `PENDING` | DB (créé dans la transaction) |
| Stock réel | `InventoryItem.onHandQuantity` | DB |
| Montants (subtotal, livraison, total) | Calculés depuis la DB dans la transaction | DB — jamais depuis FormData ni cookie |

Les valeurs acceptées pour le mode de paiement sont : `bank_transfer` et `cash_on_delivery`.

---

## 3. Étapes du flux

### 3.1 Ajout panier

**Fichier principal :** `add-to-cart-action.ts`

- Vérifie la disponibilité de l'article.
- Vérifie que le prix est non nul.
- Crée ou met à jour la ligne de panier.

### 3.2 Saisie checkout

**Fichier principal :** `save-guest-checkout-action.ts`

- Persiste les informations client et l'adresse en DB sous forme de draft (`Checkout` + `CheckoutAddress`).
- Le checkout est créé à l'état `OPEN`.

### 3.3 Sélection de la méthode de livraison

**Fichier principal :** `select-shipping-method-form.action.ts` → `selectShippingMethodAction`

- Valide que la méthode de livraison est à l'état `ACTIVE`.
- Vérifie le respect des seuils (minimum de commande, seuil de livraison offerte si applicable).
- Persiste la sélection dans `CheckoutShippingSelection` en DB.

### 3.4 Sélection du mode de paiement

**Fichier principal :** `select-payment-method-form.action.ts` → `selectPaymentMethodAction`

- Valide le code de paiement via `isCheckoutPaymentMethod`.
- Persiste la sélection dans le cookie httpOnly `creatyss_checkout_payment`.

### 3.5 Submit de la commande

**Fichier principal :** `create-order-action.ts`

Séquence :

1. Upsert du draft checkout si nécessaire.
2. Re-lecture du contexte complet depuis la DB.
3. Guard shipping : vérifie que la livraison a été sélectionnée.
4. Guard payment : vérifie que le mode de paiement a été sélectionné.
5. Appel de `createOrderFromGuestCartToken`.
6. Envoi de l'email transactionnel via `sendOrderTransactionalEmail` — hors bloc fatal (voir §3.6 et §3.7).
7. Clear des cookies panier et paiement.
8. Redirect vers la page de confirmation.

### 3.6 Transaction `createOrderFromGuestCartToken`

La transaction vérifie et écrit dans l'ordre suivant :

**Vérifications (toutes bloquantes) :**

- Cart à l'état `ACTIVE`.
- Checkout à l'état `OPEN` ou `READY`.
- ShippingMethod à l'état `ACTIVE`, appartenant au bon store.
- Respect des seuils de la méthode de livraison.
- Stock suffisant pour chaque ligne : `onHandQuantity - reservedQuantity >= quantity`.

**Écritures :**

- Création de `Order`.
- Création des `OrderLine` (lignes de commande).
- Création des `OrderAddress` (adresses figées sur la commande).
- Création de `OrderShippingSelection`.
- Création de `Payment` avec `status: PENDING` et `amountAuthorized` calculé depuis la DB.
- Création de `InventoryMovement` pour chaque ligne.
- Mise à jour de `InventoryItem.onHandQuantity` (décrémentation).
- Marquage du cart à l'état `CONVERTED`.
- Marquage du checkout à l'état `COMPLETED`.

### 3.7 Email transactionnel

**Fonction :** `sendOrderTransactionalEmail`

- Appelée après la transaction, hors bloc fatal.
- En cas d'échec, l'erreur est loguée avec le préfixe `[checkout-email]`.
- Un échec email n'interrompt pas le flux : la commande est créée, les cookies sont effacés, la redirection vers la confirmation a lieu normalement.

### 3.8 Confirmation publique

**Fonction :** `findPublicOrderByReference`

Affiche pour l'acheteur :

- Subtotal.
- Frais de livraison.
- Total.
- Mode de paiement sélectionné.
- Instructions spécifiques au mode de paiement (coordonnées bancaires pour `bank_transfer`, instructions atelier pour `cash_on_delivery`).

### 3.9 Admin — gestion des paiements

**Fonction de lecture :** `listAdminPayments` (filtrée par `storeId`)

**Actions disponibles :**

- `captureAdminPaymentAction` : transition `PENDING → CAPTURED`.
- `cancelAdminPaymentAction` : transition `PENDING → CANCELLED`.

Les deux actions vérifient que `payment.storeId === currentStoreId` avant toute mutation.

---

## 4. Règles de sécurité

- Les montants (subtotal, frais de livraison, total, `Payment.amountAuthorized`) sont calculés exclusivement depuis les données DB dans la transaction. Ils ne sont jamais lus depuis FormData ni depuis un cookie.
- La `ShippingMethod` est rechargée depuis la DB dans la transaction (statut, `storeId`, seuils). La sélection initiale en cookie n'est pas suffisante.
- Le mode de paiement lu depuis le cookie est validé par `isCheckoutPaymentMethod` avant tout usage dans la transaction.
- Le stock est vérifié dans la transaction (`onHandQuantity - reservedQuantity >= quantity`) avant la création de la commande.
- Les actions admin capture et annulation vérifient `payment.storeId === currentStoreId` : aucune mutation cross-store n'est possible.

---

## 5. Limitations V1

- Pas de PSP réel (Stripe, PayPal, Mollie, etc.) — les paiements sont exclusivement manuels : `bank_transfer` ou `cash_on_delivery`.
- `reservedQuantity` n'est pas utilisé en écriture lors de l'ajout au panier. La réservation de stock intervient uniquement au moment de la création de la commande.
- Le modèle `PaymentRefund` existe en DB mais n'est pas utilisé. Aucun flux de remboursement n'est implémenté en V1.
- Pas de transporteur externe ni de calcul de frais par poids ou par dimension. Les frais de livraison sont définis statiquement sur la méthode de livraison.
- La transition `Payment.status` de `PENDING` vers `CAPTURED` est manuelle, via `/admin/commerce/payments`.
- La transition `Order.status` de `PENDING` vers `CONFIRMED` dépend de l'action admin manuelle sur le paiement associé.
- Protection contre les accès concurrents au niveau `READ COMMITTED`. Aucun `SELECT FOR UPDATE` n'est utilisé. Une race condition légère reste possible en cas de commandes ultra-concurrentes sur le même article avec un stock proche de zéro.

---

## 6. Checklist QA manuelle

Pour chaque scénario : précondition → action → résultat attendu.

---

### Scénario 1 — Commande avec virement bancaire

**Précondition :** panier non vide, checkout saisi, livraison sélectionnée, mode de paiement `bank_transfer` sélectionné.

**Action :** soumettre la commande.

**Résultat attendu :** commande créée, paiement `PENDING` créé, stock décrémenté, cookies effacés, redirection vers la page de confirmation affichant les coordonnées bancaires.

---

### Scénario 2 — Commande avec paiement à l'atelier

**Précondition :** panier non vide, checkout saisi, livraison sélectionnée, mode de paiement `cash_on_delivery` sélectionné.

**Action :** soumettre la commande.

**Résultat attendu :** commande créée, paiement `PENDING` créé, stock décrémenté, cookies effacés, redirection vers la page de confirmation affichant les instructions de paiement atelier.

---

### Scénario 3 — Livraison standard (frais non nuls)

**Précondition :** panier dont le montant est inférieur au seuil de livraison offerte, méthode de livraison avec frais non nuls.

**Action :** sélectionner la méthode de livraison, soumettre la commande.

**Résultat attendu :** le total affiché en confirmation inclut les frais de livraison. `Payment.amountAuthorized` reflète le total incluant la livraison.

---

### Scénario 4 — Livraison offerte (au-delà du seuil)

**Précondition :** panier dont le montant dépasse le seuil de livraison offerte défini sur la méthode.

**Action :** sélectionner la méthode de livraison, soumettre la commande.

**Résultat attendu :** frais de livraison à zéro en confirmation. `Payment.amountAuthorized` égal au subtotal seul.

---

### Scénario 5 — Stock insuffisant au submit

**Précondition :** article en panier dont le stock réel (`onHandQuantity - reservedQuantity`) est inférieur à la quantité commandée au moment du submit.

**Action :** soumettre la commande.

**Résultat attendu :** la transaction échoue, aucune commande n'est créée, aucun stock n'est décrémenté, une erreur métier est retournée à l'acheteur.

---

### Scénario 6 — Erreur email non bloquante

**Précondition :** commande valide, `sendOrderTransactionalEmail` configuré pour échouer (simulé en environnement de test).

**Action :** soumettre la commande.

**Résultat attendu :** la commande est créée normalement, l'erreur est loguée avec le préfixe `[checkout-email]`, les cookies sont effacés, la redirection vers la confirmation a lieu. L'acheteur n'est pas bloqué.

---

### Scénario 7 — Admin marque un paiement comme reçu

**Précondition :** paiement à l'état `PENDING` dans `/admin/commerce/payments`, appartenant au store courant.

**Action :** l'administrateur déclenche `captureAdminPaymentAction`.

**Résultat attendu :** `Payment.status` passe à `CAPTURED`.

---

### Scénario 8 — Admin annule un paiement pending

**Précondition :** paiement à l'état `PENDING` dans `/admin/commerce/payments`, appartenant au store courant.

**Action :** l'administrateur déclenche `cancelAdminPaymentAction`.

**Résultat attendu :** `Payment.status` passe à `CANCELLED`.

---

### Scénario 9 — Tentative de commande sans sélection de livraison

**Précondition :** checkout saisi, mode de paiement sélectionné, mais aucune méthode de livraison sélectionnée.

**Action :** soumettre la commande.

**Résultat attendu :** le guard shipping bloque la soumission avant l'entrée en transaction. Aucune commande n'est créée.

---

### Scénario 10 — Tentative de commande sans sélection de paiement

**Précondition :** checkout saisi, livraison sélectionnée, mais cookie `creatyss_checkout_payment` absent ou invalide.

**Action :** soumettre la commande.

**Résultat attendu :** le guard payment bloque la soumission avant l'entrée en transaction. Aucune commande n'est créée.

---

## Documents liés

- `docs/domains/core/commerce/checkout.md`
- `docs/domains/core/commerce/orders.md`
- `docs/domains/core/commerce/cart.md`
- `docs/domains/optional/commerce/payments.md`
- `docs/domains/optional/commerce/shipping.md`
- `docs/domains/optional/commerce/inventory.md`
- `AGENTS.md`
