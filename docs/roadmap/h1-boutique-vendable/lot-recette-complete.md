# Lot — Recette complète en production

## Statut

Partiellement complété en staging (2026-06-30) — Stripe test et Brevo validés ; production finale `creatyss.com` non basculée

## Objectif

Valider manuellement le parcours achat complet de bout en bout en production, avec un vrai paiement Stripe, sur le VPS déployé, afin de confirmer que la boutique est prête à accueillir de vraies clientes.

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

## Dépendances

- `lot-paiement-en-ligne` terminé et validé
- `lot-deploiement-vps-prod` terminé et validé
- Provider email transactionnel configuré en production (Resend, Postmark ou SMTP)
- Compte Stripe en mode test avec carte test disponible
- Au moins un produit publié et disponible dans le catalogue de production

## Invariants

- La recette doit être effectuée par un humain — l'IA ne valide pas à la place de l'humain (doctrine `projet-creatyss.md`)
- Une commande test créée en production doit pouvoir être annulée ou marquée comme test
- Les données de carte test Stripe ne constituent pas un risque — utiliser exclusivement les cartes test Stripe documentées

## Risques

- Email non reçu si SPF/DKIM/DMARC non configurés sur le domaine d'envoi — peut bloquer la recette sans être un blocage technique de la commande elle-même
- Stripe en mode live vs mode test : s'assurer de ne pas traiter de vraies transactions pendant la recette
- Disponibilité produit : si le stock est à zéro, le checkout sera bloqué — vérifier avant la recette

## Vérifications

Liste de contrôle humaine :

- [ ] Catalogue navigable sans erreur visible (mobile + desktop)
- [ ] Fiche produit avec images, variantes, prix corrects
- [ ] Ajout panier et mise à jour quantité fonctionnels
- [ ] Checkout : saisie adresse, sélection livraison, paiement Stripe (carte test)
- [ ] Page de confirmation affichée avec la bonne référence commande
- [ ] Email de confirmation reçu avec les bonnes informations
- [ ] Commande visible dans l'admin avec statut paiement correct
- [ ] Cas d'erreur : produit indisponible bloque l'ajout ou le checkout
- [ ] Cas d'erreur : carte refusée (carte test Stripe `4000000000000002`) affiche un message d'erreur clair

## Critères de fin

- Le parcours complet a été validé manuellement par un humain en production
- Aucune erreur visible ni page cassée sur le parcours principal
- La commande est correctement enregistrée en DB et visible dans l'admin
- La boutique est déclarée ouverte

## Agent recommandé

Validation humaine uniquement. Pas d'agent.
