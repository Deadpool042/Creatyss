# Settings Notifications V1 — Référence d'implémentation

**Date :** 2026-06-11
**Type :** Référence d'implémentation — lecture seule
**Périmètre :** pilotage des emails transactionnels et adresse de réponse de la boutique

---

## 1. Objectif fonctionnel

Permettre à l'administrateur de contrôler quels emails transactionnels sont envoyés à l'acheteur, et de configurer une adresse de réponse visible par les clientes.

En V1, deux emails sont pilotés :
- l'email de confirmation envoyé après une commande créée ;
- l'email d'expédition envoyé lors du marquage d'une commande comme expédiée.

Un troisième champ optionnel, `replyToEmail`, est injecté dans les headers SMTP et dans l'API Brevo pour orienter les réponses des clientes vers une adresse métier.

---

## 2. Champs ajoutés au modèle `Store`

| Champ | Type | Défaut | Rôle |
| --- | --- | --- | --- |
| `emailConfirmationEnabled` | `Boolean` | `true` | Active l'envoi de l'email de confirmation de commande |
| `emailShippingEnabled` | `Boolean` | `true` | Active l'envoi de l'email d'expédition |
| `replyToEmail` | `String?` | `null` | Adresse de réponse injectée dans les emails transactionnels |

Les deux flags sont activés par défaut pour garantir la rétrocompatibilité avec les commandes passées avant la configuration de ces réglages. `replyToEmail` est facultatif ; s'il est absent, aucun header `Reply-To` n'est ajouté.

---

## 3. Page admin — `/admin/settings/notifications`

### Accès

| Capability | Usage |
| --- | --- |
| `admin.settings.notifications.read` | Chargement de la page et lecture des réglages |
| `admin.settings.notifications.write` | Soumission du formulaire de mise à jour |

### Composants

| Fichier | Rôle |
| --- | --- |
| `app/admin/(protected)/settings/notifications/page.tsx` | Page RSC, vérifie `notifications.read`, charge les settings |
| `features/admin/settings/components/notification-settings-form.tsx` | Formulaire client, gère l'état via `useActionState` |
| `features/admin/settings/actions/update-admin-notification-settings.action.ts` | Server Action, vérifie `notifications.write`, persiste en DB |
| `features/admin/settings/queries/get-admin-notification-settings.query.ts` | Lecture des 3 champs depuis le premier store |
| `features/admin/settings/schemas/notification-settings.schema.ts` | Validation Zod (`NotificationSettingsSchema`) |

### Comportement de l'action

1. Vérifie la capability `admin.settings.notifications.write`.
2. Parse le `FormData` via `NotificationSettingsSchema`.
3. Charge le `storeId` courant via `getCurrentStoreId`.
4. Met à jour les 3 champs sur le store via `db.store.update`.
5. Revalide le cache de `/admin/settings/notifications`.
6. Retourne un état `success` ou `error` avec messages de champs si pertinent.

### Validation des champs

- `emailConfirmationEnabled` et `emailShippingEnabled` : `z.coerce.boolean()`. Les hidden inputs soumettent `"true"` ou `""` — jamais `"false"`. Une valeur vide est interprétée comme `false`.
- `replyToEmail` : optionnel, max 254 caractères, doit être une adresse email valide ou vide. Une valeur vide est transformée en `null` avant la persistance.

---

## 4. Couche email — support `replyTo`

### Contrat

`TransactionalEmailPayload` expose un champ `replyTo?: string | null`. Il est optionnel : les appels existants sans ce champ compilent et fonctionnent sans changement.

### Mailpit

Si `payload.replyTo` est truthy, un header `Reply-To: <adresse>` est ajouté aux lignes SMTP du message brut. Si `replyTo` est `null` ou absent, aucun header n'est émis.

### Brevo

Si `payload.replyTo` est truthy, le body JSON de la requête API inclut `replyTo: { email: "<adresse>" }` au format attendu par l'API Brevo v3. Si `replyTo` est `null` ou absent, le champ est omis du body.

Dans les deux cas, `sender` (Mailpit : `From:`, Brevo : `sender`) reste inchangé.

---

## 5. Guards conditionnels d'envoi — `sendOrderTransactionalEmail`

### Principe

Au démarrage de chaque envoi, le service charge en une seule requête les trois champs du store (`emailConfirmationEnabled`, `emailShippingEnabled`, `replyToEmail`). Le guard est évalué **avant** la création de l'`EmailMessage` en base et avant tout appel au provider.

### Mapping eventType → flag

| `eventType` | Flag contrôlant l'envoi |
| --- | --- |
| `order_created` | `emailConfirmationEnabled` |
| `order_shipped` | `emailShippingEnabled` |
| `payment_succeeded` | non piloté en V1 — toujours envoyé |

### Comportement selon le flag

| Situation | Résultat |
| --- | --- |
| Flag `true` (ou store absent) | Envoi normal, `EmailMessage` créé, provider appelé |
| Flag `false` | Retour propre sans throw, aucun `EmailMessage` créé, provider non appelé |
| Store absent | Fallback `true` pour les deux flags — rétrocompatibilité garantie |

### Point d'attention — store context

`sendOrderTransactionalEmail` charge le store via `db.store.findFirst({ orderBy: { createdAt: "asc" } })`. Ce pattern est cohérent avec l'ensemble de la codebase en mono-store. En cas de passage multi-store, il faudra charger le store via `order.storeId` (le champ existe sur le modèle `Order`).

---

## 6. Limitations V1

- **Pas d'historique des changements de settings.** Les modifications de ces réglages ne sont pas tracées dans l'audit log.
- **Pas de template éditable.** Le contenu des emails est défini dans `order-email-templates.ts` — non pilotable par l'administrateur en V1.
- **Pas de `senderName` configurable.** L'expéditeur affiché dans les emails reste celui défini dans les variables d'environnement (`emailFromName` / `brevoFromName`).
- **`payment_succeeded` non piloté.** L'email de confirmation de paiement est toujours envoyé en V1.
- **replyToEmail écrasable si FormData manipulée.** Si le champ `replyToEmail` est absent de la soumission (hors usage normal de l'UI), la valeur actuelle en DB est remplacée par `null`. En usage normal via l'interface, le champ est toujours soumis.
- **Store unique.** `getAdminNotificationSettings` et `sendOrderTransactionalEmail` lisent le premier store par `createdAt`.

---

## 7. Checklist QA

Pour chaque scénario : précondition → action → résultat attendu.

---

### Scénario 1 — Email de confirmation désactivé

**Précondition :** `emailConfirmationEnabled=false` enregistré depuis `/admin/settings/notifications`.

**Action :** passer une commande complète via le checkout.

**Résultat attendu :** aucun email `order_created` dans Mailpit. Aucune ligne `email_messages` créée pour cette commande avec `event_type = 'order_created'`.

---

### Scénario 2 — Email de confirmation réactivé

**Précondition :** `emailConfirmationEnabled=true` enregistré.

**Action :** passer une commande complète.

**Résultat attendu :** un email `order_created` arrive dans Mailpit. Une ligne `email_messages` est créée avec `status = 'sent'`.

---

### Scénario 3 — Email d'expédition désactivé

**Précondition :** `emailShippingEnabled=false` enregistré.

**Action :** marquer une commande comme expédiée via l'admin.

**Résultat attendu :** aucun email `order_shipped` dans Mailpit. Aucune ligne `email_messages` créée pour cette expédition.

---

### Scénario 4 — Email d'expédition réactivé

**Précondition :** `emailShippingEnabled=true` enregistré.

**Action :** marquer une commande comme expédiée.

**Résultat attendu :** un email `order_shipped` arrive dans Mailpit.

---

### Scénario 5 — replyTo présent dans les headers

**Précondition :** `replyToEmail=contact@test.fr` enregistré, les deux flags activés.

**Action :** passer une commande.

**Résultat attendu :** l'email dans Mailpit contient le header `Reply-To: contact@test.fr` (visible dans l'onglet "Headers").

---

### Scénario 6 — replyTo absent — pas de header Reply-To

**Précondition :** `replyToEmail` vidé et enregistré.

**Action :** passer une commande.

**Résultat attendu :** l'email dans Mailpit ne contient pas de header `Reply-To`.

---

### Scénario 7 — Validation email invalide

**Précondition :** saisir `notanemail` dans le champ Reply-to et soumettre.

**Résultat attendu :** message d'erreur `"Adresse email invalide."` affiché sous le champ. Aucune mise à jour en DB.

---

### Scénario 8 — Fallback store absent

**Précondition :** aucun store en base (environnement vide).

**Action :** appeler `sendOrderTransactionalEmail`.

**Résultat attendu :** l'envoi s'effectue normalement (`fallback true`). Pas d'exception levée.

---

## Documents liés

- `docs/lots/2026-06-10-settings-payments-v1-reference.md`
- `docs/lots/2026-06-10-settings-orders-v1-reference.md`
- `docs/lots/2026-06-10-checkout-v1-reference.md`
- `AGENTS.md`
