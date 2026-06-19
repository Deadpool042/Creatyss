# H2 — Commerce fiable

## Objectif métier

Consolider le commerce pour qu'il soit légalement conforme et techniquement fiable en production : TVA validée, factures légales, retours et remboursements réels, gestion logistique partielle, et couverture automatisée des flux critiques. Cet horizon transforme la boutique vendable (H1) en boutique exploitable durablement.

---

## État au 2026-06-19

### Observé comme terminé

- `commerce.taxation` L3 : moteur TVA par territoire (métropole + DOM), câblage checkout, seed taux, UI admin lecture — observé dans `2026-06-13-audit-catalogue-modules.md`
- `commerce.documents` L3 : confirmation de commande, bon de préparation, facture (`INVOICE`), avoir (`CREDIT_NOTE`), génération PDF à la volée — observé dans `2026-06-14-etat-des-lieux-session.md`
- `commerce.fulfillment` L3 V1 : préparation "tout ou rien", transitions PENDING→READY→FULFILLED/CANCELLED, gated — observé
- `commerce.returns` L3 V1 : workflow REQUESTED→…→CLOSED, référence RET-…, gated — observé

### Observé comme non terminé (modules partiels)

- `commerce.taxation` : taux non validés par expert-comptable, OSS UE absent — observé
- `commerce.documents` : Factur-X / e-reporting PPF absents, stockage persistant des fichiers absent (`storageKey` non alimenté) — observé
- `commerce.fulfillment` : partiel par quantité absent, lien Shipment absent, impact inventaire absent — observé
- `commerce.returns` : `REFUNDED` déclaratif (pas de remboursement Stripe réel), sélection lignes absente, restock absent, demande client storefront absente — observé
- Tests E2E discounts, taxation, fulfillment, returns : non observés comme existants

---

## Dépendances

- H1 terminé : paiement Stripe opérationnel (requis pour le remboursement réel dans `lot-retours-remboursement-complets`)
- Validation externe par expert-comptable pour la TVA (prérequis non technique)
- Provider email transactionnel configuré en production

---

## Lots

| Fichier                                                                          | Description                                                                    | Statut  |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ------- |
| [lot-tva-validation-prod.md](./lot-tva-validation-prod.md)                       | Valider les taux TVA et la conformité légale avant activation en production    | A faire |
| [lot-factures-legales-facturx.md](./lot-factures-legales-facturx.md)             | Générer des factures conformes Factur-X et stocker les fichiers                | A faire |
| [lot-retours-remboursement-complets.md](./lot-retours-remboursement-complets.md) | Compléter les retours — sélection lignes, remboursement Stripe réel, restock   | A faire |
| [lot-fulfillment-partiel.md](./lot-fulfillment-partiel.md)                       | Gérer la préparation par quantité, lier les expéditions, impacter l'inventaire | A faire |
| [lot-tests-e2e-commerce.md](./lot-tests-e2e-commerce.md)                         | Couvrir automatiquement les flux discounts, taxation, fulfillment, returns     | A faire |

`lot-tva-validation-prod` est un prérequis de `lot-factures-legales-facturx`. `lot-retours-remboursement-complets` dépend du paiement Stripe (H1). `lot-fulfillment-partiel` peut avancer en parallèle sans dépendance bloquante. `lot-tests-e2e-commerce` attend que les modules fonctionnels soient complets.

---

## Risques

- TVA : obligation légale — ne pas activer sans validation expert-comptable
- Factur-X : norme technique complexe — vérifier la compatibilité de `pdf-lib` déjà en place ou migrer vers une lib dédiée
- Remboursements Stripe : le `REFUNDED` déclaratif actuel doit être remplacé sans casser les retours existants
- Fulfillment partiel : le décrément d'inventaire doit être transactionnel pour éviter les incohérences de stock

---

## Éléments reportables sans bloquer la valeur métier

- Factur-X et e-reporting PPF : exigibles légalement mais le délai légal précis est à confirmer — peuvent suivre la mise en production initiale
- OSS UE et export hors-UE : hors périmètre boutique artisanale sans vente hors France significative
- Transporteurs intégrés et étiquettes d'expédition automatiques (H4)
- Tests de performance et tests de charge
