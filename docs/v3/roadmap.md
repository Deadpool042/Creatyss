# Roadmap V3

## Direction retenue

La V3 avance par petits lots autour de l'exploitation post-achat :

1. admin commandes actionnable
2. expedition simple
3. emails transactionnels minimaux
4. petits gains UX post-achat

Chaque lot doit rester utile seul et prolonger la V2 sans refonte.

## Lot 1 - Admin commandes actionnable

Objectif :

- permettre a l'admin de faire avancer une commande au-dela de la lecture seule

Livrables minimaux :

- statuts commande plus utiles cote admin
- actions simples sur la commande
- detail admin commande plus actionnable
- coherence de statut avec la vue publique

Dependance :

- V2 actuelle

## Lot 2 - Expedition simple

Objectif :

- rattacher une expedition minimale a la commande

Livrables minimaux :

- informations simples d'expedition
- date d'expedition
- suivi optionnel
- affichage simple cote admin et cote public

Dependance :

- lot 1

## Lot 3 - Emails transactionnels minimaux

Objectif :

- informer la cliente lors des evenements post-achat utiles

Livrables minimaux :

- email de confirmation de commande
- email d'expedition
- trace minimale d'envoi
- logique simple d'idempotence

Dependance :

- lot 1
- lot 2 pour l'email d'expedition

## Lot 4 - Petits gains UX post-achat

Objectif :

- rendre le post-achat plus lisible sans ouvrir un nouveau chantier majeur

Livrables minimaux :

- page de confirmation plus claire
- etat de commande plus lisible cote public
- messages admin plus actionnables
- petits ajustements de flux utiles

Dependance :

- lots 1 a 3

## Strategie d'implementation

- garder les lots petits et testables localement
- prolonger les commandes V2 au lieu de refondre le modele
- privilegier des etats simples et lisibles
- garder l'admin centre sur l'exploitation concrete
- deferer toute logique avancee de support, marketing ou logistique

## Base utile de V3

La V3 devient utile des que le projet permet :

- de faire avancer une commande apres paiement
- de renseigner une expedition simple
- d'afficher un suivi minimal
- d'envoyer les emails transactionnels essentiels
- de garder un etat coherent entre public et admin

## Note sur les emails transactionnels

Brevo est intégré pour les emails transactionnels.

L’envoi réel reste à valider tant qu’un domaine expéditeur dédié n’est pas disponible et authentifié.

Cela ne bloque pas le flux métier, car l’envoi reste en mode best-effort.
