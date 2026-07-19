# H2 — Commerce fiable

## Objectif métier

Consolider le commerce pour qu'il soit légalement conforme et techniquement fiable en production : TVA validée, factures légales, retours et remboursements réels, gestion logistique partielle, et couverture automatisée des flux critiques. Cet horizon transforme la boutique vendable (H1) en boutique exploitable durablement.

---

## État au 2026-06-25

### Observé comme terminé

- `commerce.taxation` L3 : moteur TVA par territoire (métropole + DOM), câblage checkout, seed taux, UI admin lecture — implémentation technique validée, bloqué uniquement sur la confirmation expert-comptable (non technique)
- `commerce.documents` L3 : confirmation de commande, bon de préparation, facture (`INVOICE`), avoir (`CREDIT_NOTE`) ; Factur-X (XML CII BASIC + PDF/A-3) et stockage persistant (`storageKey`, volume `documents_data`) livrés pour `INVOICE` — `lot-factures-legales-facturx`
- `commerce.fulfillment` L3 V1+ : lignes partielles, lien `Shipment` optionnel, sans mutation d'inventaire (stock consommé à la commande, `FULFILLED` ne décrémente pas) — `lot-fulfillment-partiel`, implémenté 2026-06-24
- `commerce.returns` L3 V1+ (admin) : sélection lignes/quantités, restock transactionnel, remboursement Stripe réel (Stripe-first) — `lot-retours-remboursement-complets`, implémenté 2026-06-24
- Tests E2E discounts, taxation, fulfillment, returns : 4 specs livrés avec helpers DB dédiés — `lot-tests-e2e-commerce`, implémenté 2026-06-24

### Reste non terminé (bloqueurs non techniques ou hors périmètre)

- `commerce.taxation` : validation des taux par expert-comptable (externe, non technique), OSS UE absent (hors périmètre)
- `commerce.documents` : validation Factur-X par un outil de conformité officiel (action humaine restante) ; e-reporting PPF absent (hors périmètre documenté) ; `storageKey` reste `null` pour `DELIVERY_NOTE`/`ORDER_CONFIRMATION` (non requis par ce lot)
- `commerce.returns` : formulaire de **demande** de retour côté storefront client (création d'un `ReturnRequest` depuis `/compte`) différé (périmètre séparé, non requis pour la conformité commerce). Le formulaire de **vérification d'éligibilité** (sans création de `ReturnRequest`) est livré — cf. mise à jour 2026-07-19 ci-dessous.

### Mise à jour 2026-07-19 (storefront returns — vérification d'éligibilité)

Formulaire storefront de **vérification d'éligibilité au retour** livré sur `/compte` (PR #16, commit final `18269fed`) : la cliente renseigne référence de commande, email et motif ; le système répond si au moins une ligne de la commande est potentiellement éligible. Distinct de la **demande de retour** (création d'un `ReturnRequest`), qui reste hors périmètre (cf. ligne ci-dessus, non modifiée).

- Gating double : `meetsFeatureLevel("commerce.returns", "manual")` résolu côté Server Component (`app/(public)/compte/page.tsx`, async) pour ne rendre ni le titre, ni la description, ni le formulaire quand la feature n'atteint pas `manual` ; re-vérifié dans la Server Action (`check-storefront-return-eligibility-action.ts`) en défense en profondeur.
- Contrat public minimal côté Server Action : `{ available: true, eligibility: { outcome: "ELIGIBLE" | "MANUAL_REVIEW" | "INELIGIBLE" } }` ou `{ available: false }`. `code`, `message` (interne) et `details` de l'objet métier `ReturnEligibilityResult` ne sont jamais sérialisés vers le client.
- `{ available: false }` reste volontairement indiscernable entre : feature inactive, entrée invalide, commande/couple référence-email inconnu, et exception technique inattendue (interceptée côté client via `try/catch`, aucune donnée journalisée, aucun détail technique affiché).
- UX/accessibilité : résultat effacé à toute modification de champ, champs et bouton désactivés pendant la soumission, erreurs liées via `aria-invalid`/`aria-describedby`, résultat annoncé via `aria-live="polite"`, lien `/contact` proposé.
- Validations exécutées avant merge : 20 tests unitaires storefront returns passés, `pnpm run typecheck` OK, `pnpm run lint` OK, `git diff --check` OK. Revue indépendante ChatGPT : GO (après une itération NO GO corrigée sur le gating serveur et la gestion des exceptions techniques).

### Vérifications complémentaires de recette — 2026-07-01

Hors modules `commerce.*` ci-dessus, quelques gaps de recette identifiés dans `docs/exploitation/06-recette-commerce-complete.md` ont été vérifiés (local et staging/prod-like) : checkout sans panier (local, OK), confirmation avec référence inexistante (local, OK), admin paiements (local, OK technique minimal — UX non finalisée), email `order_shipped` (local via Mailpit, staging via Brevo, OK). Le cas produit indisponible est désormais **validé localement** (`mini-sac-clarte`, correction `cbb8c34a`, 2026-07-01), y compris le bug de désynchronisation admin/storefront/panier sur `AvailabilityRecord` identifié en parallèle (déjà corrigé dans `main`, indépendamment de la branche `fix/catalog-availability-sync`) ; non vérifié en staging/prod-like. Détail : `docs/exploitation/06-recette-commerce-complete.md` et `docs/roadmap/h1-boutique-vendable/lot-recette-complete.md`.

---

## Dépendances

- Paiement Stripe opérationnel (requis pour le remboursement réel dans `lot-retours-remboursement-complets`)
- Validation externe par expert-comptable pour la TVA (prérequis non technique)
- Provider email transactionnel configuré en production

---

## Lots

| Fichier                                                                          | Description                                                                          | Statut                                           |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ------------------------------------------------ |
| [lot-tva-validation-prod.md](./lot-tva-validation-prod.md)                       | Valider les taux TVA et la conformité légale avant activation en production          | En attente — validation externe expert-comptable |
| [lot-factures-legales-facturx.md](./lot-factures-legales-facturx.md)             | Générer des factures conformes Factur-X et stocker les fichiers                      | Implémenté (code) — TVA externe en attente       |
| [lot-retours-remboursement-complets.md](./lot-retours-remboursement-complets.md) | Compléter les retours — sélection lignes, remboursement Stripe réel, restock         | Terminé (admin) — 2026-06-24                     |
| [lot-fulfillment-partiel.md](./lot-fulfillment-partiel.md)                       | Gérer la préparation par quantité, lier les expéditions (sans mutation d'inventaire) | Terminé — 2026-06-24                             |
| [lot-tests-e2e-commerce.md](./lot-tests-e2e-commerce.md)                         | Couvrir automatiquement les flux discounts, taxation, fulfillment, returns           | Terminé — 2026-06-24                             |

`lot-tva-validation-prod` est un prérequis de `lot-factures-legales-facturx`. `lot-retours-remboursement-complets` dépend du paiement Stripe (H1). `lot-fulfillment-partiel` peut avancer en parallèle sans dépendance bloquante. `lot-tests-e2e-commerce` attend que les modules fonctionnels soient complets.

---

## Risques

- TVA : obligation légale — ne pas activer en production sans validation expert-comptable
- Factur-X : XML CII BASIC et PDF/A-3 générés en code mais jamais passés dans un outil de conformité Factur-X officiel — risque de non-conformité non détecté avant un contrôle externe
- Si un délai légal impose l'e-reporting PPF avant la mise en production prévue, ce lot devient bloquant (actuellement hors périmètre)

---

## Éléments reportables sans bloquer la valeur métier

- Factur-X et e-reporting PPF : exigibles légalement mais le délai légal précis est à confirmer — peuvent suivre la mise en production initiale
- OSS UE et export hors-UE : hors périmètre boutique artisanale sans vente hors France significative
- Transporteurs intégrés et étiquettes d'expédition automatiques (H4)
- Tests de performance et tests de charge
