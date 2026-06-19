# Lot — Channels : Google Merchant Center ou Meta Catalog

## Statut

A faire

## Objectif

Synchroniser le catalogue produits vers Google Merchant Center ou Meta Catalog pour permettre la présence sur ces canaux de distribution. Le modèle `Channel`/`ChannelProductStatus`/`ChannelVariantStatus` est observé en Prisma et la page admin de lecture est observée, mais aucune synchronisation n'existe.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/satellites/channels.prisma` — modèles `Channel`, `ChannelProductStatus`, `ChannelVariantStatus` déjà posés (observés)
- `features/admin/settings/channels/` — extension de la page lecture existante :
  - Configuration du canal (credentials OAuth, paramètres de synchronisation)
  - Déclenchement manuel d'une synchronisation
  - Affichage du statut par produit/variante (`ChannelProductStatus`, `ChannelVariantStatus`)
  - Journal des erreurs de synchronisation
- Service de synchronisation asynchrone : mapping catalogue Prisma → format attendu par le canal (Google Product Feed ou Meta Catalog)
- Gestion des erreurs par produit (un produit refusé ne bloque pas les autres)

## Hors périmètre

- Publicité payante et enchères automatiques (Google Ads, Meta Ads)
- Synchronisation des commandes depuis les canaux
- Synchronisation des prix dynamiques ou promotions spécifiques aux canaux
- Multi-canaux simultanés dans le même lot (un canal cible par lot)

## Dépendances

- Credentials OAuth Google ou Meta (prérequis externe — compte marchand actif)
- Catalogue stable avec produits publiés, images, descriptions et prix cohérents (H1/H2 recommandés)
- Décision sur le canal cible : Google Merchant Center ou Meta Catalog en premier

## Invariants

- La synchronisation ne doit pas modifier les données du catalogue Prisma — elle ne fait que les lire et les envoyer
- Un échec de synchronisation vers le canal externe ne doit pas impacter le fonctionnement de la boutique
- Les credentials OAuth doivent être stockés chiffrés (pattern `IntegrationCredential` déjà en place comme référence)

## Risques

- APIs tierces sujettes à changements : les formats Google Product Feed et Meta Catalog évoluent — maintenir une version d'API explicite
- Synchronisation asynchrone non triviale : la cohérence entre le catalogue Prisma et l'état du canal (produit approuvé, refusé, en attente) nécessite une gestion d'état explicite via `ChannelProductStatus`
- Images : Google et Meta ont des exigences strictes sur les images (format, taille, ratio) — les produits sans image conforme seront refusés
- Données requises : certains champs obligatoires pour Google (GTIN, MPN, marque) peuvent ne pas être présents dans le catalogue actuel

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test manuel : connexion OAuth, synchronisation d'un produit test, vérification du statut dans l'admin et dans la console Google/Meta

## Critères de fin

- Le catalogue est synchronisé vers le canal cible (Google ou Meta)
- Le statut par produit/variante est visible dans l'admin (`ChannelProductStatus`)
- Les erreurs de synchronisation par produit sont visibles et corrigeables
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour le choix du canal cible et la conception du mapping produit → format canal.
