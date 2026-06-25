# H1 — Boutique vendable

## Objectif métier

Permettre à la boutique de recevoir de vraies commandes payées en ligne et d'être accessible publiquement sur un VPS en production. C'est le prérequis absolu avant tout lancement commercial : sans paiement en ligne ni déploiement stabilisé, la boutique ne peut pas générer de revenus.

---

## État au 2026-06-19

### Documenté comme terminé dans `projet-creatyss.md` et les lots associés

- Catalogue complet, storefront, blog, homepage éditable, admin produits/blog/médias
- Checkout invité avec paiement par virement bancaire (smoke E2E vert, revalidé 2026-06-17)
- `pnpm run build` passe localement
- `Dockerfile.prod` écrit (multi-stage, non-root)
- Documentation d'exploitation complète dans `docs/exploitation/`
- Clone à blanc validé (2026-06-16)
- 32/32 modules à L3 dans le FEATURE_CATALOG

### Documenté comme terminé depuis 2026-06-22

- Stripe Checkout intégré : webhook idempotent, `payment_failed` géré, email `payment_succeeded` déclenché depuis le webhook — cf. `lot-paiement-en-ligne.md`

### Documenté comme terminé depuis 2026-06-24

- Onglet "Caractéristiques" ajouté à l'éditeur produit admin : ajout, édition, réordonnancement, suppression de caractéristiques clés/valeur (max 20, label ≤ 80 car., valeur ≤ 220 car.) — cf. commit `0832833c`
- Tests unitaires `validateAdminProductCharacteristics` et scénario E2E golden path ajoutés pour couvrir la dette de test de cette feature

### Documenté comme non terminé

- Build image Docker non validé (observé dans `projet-creatyss.md` : case non cochée)
- Déploiement VPS répétable non réalisé (observé dans `projet-creatyss.md` : case non cochée)
- Recette humaine complète en production non effectuée : bloquée par l'absence de VPS et de domaine HTTPS public

---

## Dépendances

- Compte Stripe marchand réel (externe, non technique)
- VPS OVH provisionné avec DNS configuré et certificat TLS opérationnel
- HTTPS en production (requis par Stripe pour les webhooks)

---

## Lots

| Fichier                                                      | Description                                                          | Statut                                       |
| ------------------------------------------------------------ | -------------------------------------------------------------------- | -------------------------------------------- |
| [lot-paiement-en-ligne.md](./lot-paiement-en-ligne.md)       | Intégration Stripe pour accepter les paiements par carte             | Implémenté — recette production non exécutée |
| [lot-deploiement-vps-prod.md](./lot-deploiement-vps-prod.md) | Valider le build image Docker et rendre le déploiement VPS répétable | En cours — documentation posée, validation réelle en attente |
| [lot-recette-complete.md](./lot-recette-complete.md)         | Recette humaine du parcours achat complet en production              | A faire                                      |

Les trois lots sont séquentiels : le paiement en ligne et le déploiement VPS doivent être terminés avant la recette complète. Les deux premiers peuvent avancer en parallèle.

---

## Risques

- Stripe webhooks requièrent HTTPS — impossible à tester localement sans tunnel (ngrok ou équivalent)
- `db:push --accept-data-loss` dangereux en production — sauvegarde obligatoire avant tout push
- Email transactionnel avec provider réel non configuré — recette peut bloquer sur la confirmation email
- Conformité PCI-DSS : les numéros de carte ne doivent jamais transiter par le serveur applicatif (Stripe.js obligatoire)

---

## Éléments reportables sans bloquer la valeur métier

- Apple Pay, Google Pay, paiement en plusieurs fois, 3DS avancé, multi-devises (H4 ou ultérieur)
- CI/CD automatisé, CDN, auto-scaling (hors périmètre boutique artisanale)
- Factur-X et e-reporting PPF (délai légal à confirmer, H2)
