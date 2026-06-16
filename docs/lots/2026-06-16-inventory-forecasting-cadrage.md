# Cadrage — `catalog.products.inventory` niveau `forecasting`

**Date :** 2026-06-16
**Statut :** cadrage court + lot borné exécuté

## Objectif

Donner un effet réel au niveau `forecasting` de `catalog.products.inventory`
sans ouvrir de moteur prédictif externe ni de notifications.

Le niveau doit exposer une lecture admin locale du risque de rupture à partir
de signaux déjà fiables :

- stock disponible par variante ;
- ventes récentes observées dans les lignes de commande ;
- estimation simple de couverture.

## Périmètre retenu

- fenêtre de lecture : 30 derniers jours ;
- source ventes : `OrderLine` liées à des `Order` non annulées/non archivées ;
- calcul borné par variante :
  - quantité vendue sur 30 jours ;
  - moyenne quotidienne ;
  - couverture estimée en jours sur stock disponible ;
- affichage seulement si `meetsFeatureLevel("catalog.products.inventory",
  "forecasting")` est vrai.

## Ce qui change réellement

- l'onglet stock produit expose maintenant une lecture prévisionnelle locale ;
- l'opérateur peut voir si une variante couvre encore environ :
  - moins de 7 jours ;
  - moins de 14 jours ;
  - plus de 14 jours ;
  - ou si aucun signal de vente récent n'existe.

## Invariants

- aucune mutation de stock ;
- aucun changement de vendabilité ;
- aucune notification automatique ;
- aucune promesse de prévision avancée : il s'agit d'une estimation simple
  fondée sur le débit récent observé.

## Hors périmètre

- prévision saisonnière ;
- tendances glissantes multi-périodes ;
- recommandations d'achat fournisseur ;
- alertes email ou dashboard transverse ;
- synchronisation WMS/ERP.

## Vérifications attendues

- `tsc --noEmit`
- vérification manuelle de l'onglet stock avec et sans ventes récentes
