# QA checklist V2

## Pre-requis

- `ENV_FILE=.env.local make up`
- `make db-reset-dev`
- `stripe listen --forward-to http://localhost:3000/api/stripe/webhook`
- vraies cles Stripe de test dans `.env.local`

## Tunnel succes

1. Ajouter une variante disponible au panier.
2. Aller sur `/checkout`, enregistrer un checkout valide, puis creer la commande.
3. Ouvrir `/checkout/confirmation/[reference]`.
4. Verifier :
   - commande `pending`
   - paiement `pending`
   - bouton `Payer la commande`
5. Lancer Stripe Checkout et payer avec une carte de test.
6. Verifier apres retour + webhook :
   - commande `paid`
   - paiement `succeeded`
   - meme etat visible sur la page publique et dans `/admin/orders`

## Paiement interrompu ou echoue

1. Creer une commande `pending`.
2. Lancer Stripe Checkout puis annuler ou laisser la session expirer.
3. Verifier :
   - message public simple et actionnable
   - commande toujours `pending`
   - paiement `failed` apres expiration
   - bouton de relance disponible tant que la commande est `pending`

## Relance d'un paiement pending

1. Creer une commande `pending`.
2. Cliquer `Payer la commande`, puis revenir sans payer sur la page de confirmation.
3. Cliquer a nouveau `Payer la commande`.
4. Verifier :
   - la relance reouvre la session Stripe encore valide au lieu d'en creer une nouvelle
   - la commande reste `pending`
   - le paiement reste `pending` tant que le webhook de succes n'est pas recu

## Idempotence webhook

1. Completer un paiement et verifier le passage a `paid` / `succeeded`.
2. Rejouer le meme evenement Stripe depuis le dashboard ou le CLI.
3. Verifier :
   - aucune duplication de commande ou de paiement
   - aucune regression d'etat
   - un paiement `succeeded` ne revient jamais a `failed`

## Coherence public / admin

- `/checkout/confirmation/[reference]` et `/admin/orders/[id]` doivent afficher :
  - le meme statut de commande
  - le meme statut de paiement
  - la meme reference de commande
- `/admin/orders` doit refléter le meme etat que le detail admin
