# H1 — Boutique vendable

## Objectif métier

Permettre à la boutique de recevoir de vraies commandes payées en ligne et d'être accessible publiquement sur un VPS en production. C'est le prérequis absolu avant tout lancement commercial : sans paiement en ligne ni déploiement stabilisé, la boutique ne peut pas générer de revenus.

---

## État au 2026-07-01

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

### Documenté comme terminé depuis 2026-06-28

- Build image Docker validé sur VPS OVH
- Staging `https://staging.creatyss.lpwebstudio.fr` opérationnel : HTTPS (HTTP/2 200 + HSTS), PostgreSQL healthy, store/admin bootstrapés
- Scripts d'exploitation validés : `scripts/deploy.sh`, `scripts/backup.sh`, `scripts/prune-backups.sh`, `scripts/healthcheck.sh`
- Sauvegardes manuelles validées, cron sauvegarde/rotation configuré
- Sécurité VPS : UFW, Fail2Ban, unattended-upgrades, swap configurés
- Déploiement VPS répétable depuis zéro (cf. `lot-deploiement-vps-prod.md`)

### Documenté comme terminé depuis 2026-06-29 / 2026-07-01

- Recette staging/prod-like validée : parcours virement complet, admin commerce complet, Stripe test, Brevo staging, relance paiement après refus — cf. `lot-recette-complete.md`
- Vérifications complémentaires H2 traitées en local (2026-07-01) : checkout sans panier, confirmation référence inexistante, admin paiements, email `order_shipped`, produit indisponible (après correction d'un bug de désynchronisation `AvailabilityRecord`, branche `fix/catalog-availability-sync`) — détail dans `docs/exploitation/06-recette-commerce-complete.md`
- Restauration DB isolée validée le 2026-06-28 (dump → base temporaire, 173 tables, base principale intacte)

### Documenté comme non terminé

- Recette avec compte Stripe marchand réel (mode live) et bascule domaine `creatyss.com` : non effectuées — restent les seuls bloqueurs avant ouverture commerciale, non techniques (compte marchand réel, décision de lancement)
- Recette du cas produit indisponible : validée en local uniquement, non revérifiée en staging/prod-like

---

## Dépendances

- Compte Stripe marchand réel (externe, non technique)
- VPS OVH provisionné avec DNS configuré et certificat TLS opérationnel
- HTTPS en production (requis par Stripe pour les webhooks)

---

## Lots

| Fichier                                                      | Description                                                          | Statut                                                                                    |
| ------------------------------------------------------------ | -------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| [lot-paiement-en-ligne.md](./lot-paiement-en-ligne.md)       | Intégration Stripe pour accepter les paiements par carte             | Implémenté — recette production non exécutée                                              |
| [lot-deploiement-vps-prod.md](./lot-deploiement-vps-prod.md) | Valider le build image Docker et rendre le déploiement VPS répétable | Terminé (staging) — HTTPS opérationnel, restauration DB complète à confirmer              |
| [lot-recette-complete.md](./lot-recette-complete.md)         | Recette humaine du parcours achat complet en production              | Validé en staging/prod-like (2026-07-01) — Stripe live et bascule `creatyss.com` restants |

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
