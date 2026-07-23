# Lot — Gifting

## Statut

A faire

## Objectif

Activer le domaine `satellites.gifting` : mécanismes de cadeau (bénéficiaire, message, contexte de remise) distincts d'une commande standard. Le modèle Prisma est posé et le domaine est documenté comme `satellites` / `activable: oui`, mais aucune implémentation applicative n'existe à ce jour — ce lot n'a jamais été scopé malgré la maturité du schéma.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/commerce/gifting.prisma` — modèles `GiftRequest`, `GiftRequestItem` déjà posés (observés)
- Achat en mode cadeau : rattachement d'un bénéficiaire, d'un message et d'un contexte de remise à une commande
- Parcours checkout dédié (option cadeau, saisie bénéficiaire/message)
- Admin : consultation des demandes cadeau rattachées aux commandes

## Hors périmètre

- Cartes cadeaux (`commerce.gift-cards`) — domaine distinct déjà cadré (cf. `docs/roadmap/h3-administration-avancee/lot-gift-cards.md`), à ne pas confondre : `gifting` porte le contexte cadeau d'un achat, `gift-cards` porte un moyen de paiement/valeur stockée
- Bundles commerciaux (`bundles`) — domaine distinct (cf. `docs/roadmap/h3-administration-avancee/lot-bundles.md`)
- Fidélité (`loyalty`) — domaine distinct déjà cadré
- Envoi automatisé d'e-mail de notification au bénéficiaire (dépend de `notifications`, à cadrer séparément si retenu)

## Dépendances

- Décision produit : le mode cadeau est-il réellement prioritaire pour le business, ou le schéma Prisma a-t-il été posé par anticipation sans besoin confirmé ? — à trancher avant tout cadrage détaillé
- `commerce.orders` actif comme rattachement de la commande cadeau
- `docs/domains/satellites/gifting.md` comme référence doctrinale du domaine (distinction explicite avec `bundles`, `gift-cards`, `discounts`, `loyalty`)

## Invariants

- Le système reste maître de la vérité sur le contexte cadeau (bénéficiaire, message, statut) rattaché à une commande
- Distinction stricte avec `gift-cards`, `bundles`, `discounts` et `loyalty` — cf. `docs/domains/satellites/gifting.md`
- Une commande annulée en mode cadeau doit rester cohérente avec l'état du contexte cadeau associé

## Risques

- Confusion fonctionnelle avec `commerce.gift-cards` si les deux lots sont cadrés indépendamment sans clarifier leur articulation dans le parcours checkout
- Complexité du parcours checkout si l'option cadeau interagit mal avec la logique panier existante

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Tests unitaires sur le rattachement d'un contexte cadeau à une commande

## Critères de fin

- Une commande peut être passée en mode cadeau avec bénéficiaire et message rattachés
- La distinction avec `commerce.gift-cards` est documentée et respectée dans le parcours checkout
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour trancher la priorité produit et la frontière avec `commerce.gift-cards`, avant `prisma-architect` (si évolution du schéma nécessaire) et `next-feature-builder`.
