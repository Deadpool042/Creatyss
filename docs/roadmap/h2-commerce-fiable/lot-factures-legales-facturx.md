# Lot — Factures légales et Factur-X

## Statut

A faire

## Objectif

Générer des factures conformes à la norme Factur-X (PDF/A-3 embarquant un XML EN 16931) et stocker les fichiers de façon persistante. La génération PDF à la volée est observée (`pdf-lib`, documenté dans `2026-06-14-etat-des-lieux-session.md`) mais le format Factur-X et le stockage persistant sont absents.

## Périmètre

Proposition — non implémenté à ce jour :

- `features/admin/commerce/documents/` — service de génération Factur-X (PDF/A-3 + XML EN 16931)
- `storageKey` dans le modèle `Document` (champ déjà posé en Prisma, non alimenté — observé dans `2026-06-14-etat-des-lieux-session.md`)
- Choix et intégration d'une librairie Factur-X compatible Node.js/TypeScript
- Stockage persistant des fichiers générés (volume Docker ou stockage objet)
- Route admin de téléchargement depuis le `storageKey` plutôt que régénération à la volée

## Hors périmètre

- E-reporting PPF (portail public de facturation — délai légal B2B à confirmer, peut suivre)
- Piste comptable automatisée (export comptable, synchronisation avec un logiciel de comptabilité)
- Factures B2C dématérialisées obligatoires (calendrier légal à suivre)
- Avoir électronique structuré (peut suivre le même pattern une fois la facture faite)

## Dépendances

- `lot-tva-validation-prod` terminé (les montants TVA doivent être validés avant d'être inscrits dans une facture légale)
- Décision sur le mode de stockage des fichiers (volume Docker local vs stockage objet S3-compatible)
- Décision sur la librairie Factur-X : `pdf-lib` seule ne produit pas de PDF/A-3 conforme — un choix de librairie dédié est nécessaire (`architect-review`)

## Invariants

- Le snapshot légal de la facture (numéros, montants, TVA) ne doit pas être modifiable après émission — invariant déjà posé dans `issue-invoice.service.ts` (observé)
- La numérotation sans trou (`FA-{année}-{0000}`) déjà implémentée ne doit pas être redessinée
- Le modèle `Document` existant ne doit pas être restructuré sans validation `architect-review`

## Risques

- Factur-X est une norme technique non triviale — la conformité du XML EN 16931 doit être vérifiée par un outil de validation officiel (Factur-X Validator ou équivalent)
- `pdf-lib` ne produit pas de PDF/A-3 nativement — migration ou wrapper requis
- Le stockage persistant des fichiers en production (volume Docker) doit être inclus dans la procédure de sauvegarde et de redéploiement
- Si un délai légal oblige à l'e-reporting PPF avant la date de lancement prévue, ce lot devient bloquant

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — tests unitaires sur la génération du XML Factur-X
- Validation du fichier généré par un outil de conformité Factur-X officiel
- Test de téléchargement admin depuis le `storageKey` persistant

## Critères de fin

- Une facture émise produit un fichier PDF/A-3 avec XML EN 16931 embarqué, validé comme conforme Factur-X
- Le fichier est stocké de façon persistante et téléchargeable depuis l'admin via son `storageKey`
- Le stockage est inclus dans la procédure de sauvegarde documentée dans `docs/exploitation/`
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour le choix de la librairie Factur-X et la décision de stockage, puis `next-feature-builder` pour l'implémentation.
