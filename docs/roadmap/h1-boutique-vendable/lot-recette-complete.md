# Lot — Recette complète staging/prod-like

## Statut

Validé en staging/prod-like (2026-07-01) — production finale `creatyss.com` hors périmètre

## Objectif

Valider manuellement le parcours achat complet de bout en bout en staging/prod-like (`staging.creatyss.lpwebstudio.fr`), avec Stripe test et Brevo staging, sur le VPS déployé, afin de confirmer que les flux techniques sont corrects avant bascule en production.

## Périmètre

Validation humaine — pas d'implémentation technique :

- Parcours storefront complet : navigation catalogue → fiche produit → ajout panier → checkout → paiement Stripe (carte test) → page de confirmation
- Vérification email de confirmation reçu (provider transactionnel réel)
- Accès admin : commande visible dans la liste → détail commande avec statut paiement correct
- Vérification des cas d'erreur principaux : produit indisponible, carte refusée
- Navigation mobile et desktop

## Hors périmètre

- Tests automatisés E2E en production (couverts dans H2 `lot-tests-e2e-commerce`)
- Tests de charge ou de performance
- Recette des modules optionnels (fulfillment, retours, factures — H2)
- Bascule domaine `creatyss.com` — hors périmètre, non réalisée
- Stripe live (vraies transactions clientes) — hors périmètre
- Ouverture officielle de la boutique — hors périmètre
- Vraie transaction cliente en production — hors périmètre

## Dépendances

- `lot-paiement-en-ligne` terminé et validé
- `lot-deploiement-vps-prod` terminé et validé
- Provider email transactionnel configuré en staging/prod-like (Brevo — validé)
- Compte Stripe en mode test avec carte test disponible (validé)
- Au moins un produit publié et disponible dans le catalogue staging/prod-like

## Invariants

- La recette doit être effectuée par un humain — l'IA ne valide pas à la place de l'humain (doctrine `projet-creatyss.md`)
- Une commande test créée en staging doit pouvoir être annulée ou marquée comme test
- Les données de carte test Stripe ne constituent pas un risque — utiliser exclusivement les cartes test Stripe documentées

## Risques

- Email non reçu si SPF/DKIM/DMARC non configurés sur le domaine d'envoi — peut bloquer la recette sans être un blocage technique de la commande elle-même
- Stripe en mode live vs mode test : s'assurer de ne pas traiter de vraies transactions pendant la recette
- Disponibilité produit : si le stock est à zéro, le checkout sera bloqué — vérifier avant la recette

## Vérifications

Liste de contrôle humaine :

- [x] Catalogue navigable sans erreur visible (mobile + desktop) — staging, 2026-06-29
- [x] Fiche produit avec images, variantes, prix corrects — staging, 2026-06-29
- [x] Ajout panier et mise à jour quantité fonctionnels — staging, 2026-06-29
- [x] Checkout : saisie adresse, sélection livraison, paiement Stripe (carte test) — staging, 2026-06-30
- [x] Page de confirmation affichée avec la bonne référence commande — staging, 2026-06-29
- [x] Email de confirmation reçu avec les bonnes informations (`order_created` + `payment_succeeded`) — staging, 2026-06-30
- [x] Commande visible dans l'admin avec statut paiement correct — staging, 2026-06-30
- [ ] Cas d'erreur : produit indisponible bloque l'ajout ou le checkout — **non vérifié / reporté H2**
- [x] Cas d'erreur : carte refusée (carte test Stripe `4000000000000002`) affiche un message d'erreur clair ; relance après refus validée (fix `d5b48106`, 2026-07-01)

## Critères de fin

- Le parcours complet a été validé manuellement par un humain en staging/prod-like
- Aucune erreur visible ni page cassée sur le parcours principal
- La commande est correctement enregistrée en DB et visible dans l'admin
- Stripe test et Brevo staging validés

## État actuel (2026-07-01)

- **Validé en staging :** parcours virement complet (2026-06-29), admin commerce complet (2026-06-30), Stripe test (2026-06-30), Brevo staging (2026-06-30), relance paiement après refus (fix `d5b48106`, 2026-07-01)
- **Vérifications complémentaires H2 (local + staging/prod-like, 2026-07-01) :** checkout sans panier (local, OK), confirmation référence inexistante (local, OK), admin paiements (local, OK technique minimal — UX reportée), email `order_shipped` (local Mailpit + staging Brevo, OK) — détail dans `docs/exploitation/06-recette-commerce-complete.md`
- **Toujours non vérifié :** produit indisponible bloque l'ajout ou le checkout — reste reporté H2 (cf. ligne dédiée ci-dessus)
- **Non validé / hors périmètre :** bascule `creatyss.com`, Stripe live, ouverture boutique, vraie transaction cliente, validation externe Factur-X, validation TVA expert-comptable

## Agent recommandé

Validation humaine uniquement. Pas d'agent.
