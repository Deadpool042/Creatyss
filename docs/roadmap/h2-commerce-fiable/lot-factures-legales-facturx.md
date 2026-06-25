# Lot — Factures légales et Factur-X

## Statut

Implémenté (code) — TVA externe en attente

Le code est livré : génération XML CII (profil BASIC), PDF/A-3 avec XML
embarqué, `storageKey` alimenté et stockage persistant via le volume Docker
`documents_data` (`storage/documents`, monté dans `docker-compose.prod.yml`).
Reste : validation du XML par un outil de conformité Factur-X officiel
(action humaine), et la dépendance `lot-tva-validation-prod` qui n'est pas
encore levée — les montants TVA inscrits dans les factures ne sont garantis
conformes en production qu'une fois cette validation externe obtenue.

## Objectif

Générer des factures conformes à la norme Factur-X (PDF/A-3 embarquant un XML EN 16931) et stocker les fichiers de façon persistante. La génération PDF à la volée est observée (`pdf-lib`, documenté dans `2026-06-14-etat-des-lieux-session.md`) mais le format Factur-X et le stockage persistant sont absents.

## Périmètre

Implémenté (observé dans le code) :

- `features/admin/commerce/documents/services/build-facturx-invoice-xml.service.ts` — XML CII profil BASIC
- `features/admin/commerce/documents/services/build-facturx-pdf-with-xml.service.ts` — PDF/A-3 (XMP `pdfaid:part=3`) avec XML attaché via `pdf-lib`
- `features/admin/commerce/documents/services/persist-facturx-pdf.service.ts` — `storageKey` alimenté pour `INVOICE`, cache disque sous `storage/documents` (`DOCUMENTS_DIR`)
- Stockage persistant via le volume Docker nommé `documents_data` (`docker-compose.prod.yml`)
- Téléchargement admin : `resolve-document-pdf.service.ts` sert le fichier mis en cache, régénère si absent (pas de route de téléchargement distincte dédiée au `storageKey`)

Hors périmètre de ce lot (non couvert, à statuer séparément si besoin) :

- `storageKey` reste `null` pour `DELIVERY_NOTE` et `ORDER_CONFIRMATION` (régénération à la volée uniquement, ces types ne sont pas des factures légales Factur-X)

## Hors périmètre

- E-reporting PPF (portail public de facturation — délai légal B2B à confirmer, peut suivre)
- Piste comptable automatisée (export comptable, synchronisation avec un logiciel de comptabilité)
- Factures B2C dématérialisées obligatoires (calendrier légal à suivre)
- Avoir électronique structuré (peut suivre le même pattern une fois la facture faite)

## Dépendances

- `lot-tva-validation-prod` en attente — les montants TVA doivent être validés avant d'être considérés conformes en production
- Validation externe du fichier généré par un outil de conformité Factur-X officiel

## Invariants

- Le snapshot légal de la facture (numéros, montants, TVA) ne doit pas être modifiable après émission — invariant déjà posé dans `issue-invoice.service.ts` (observé)
- La numérotation sans trou (`FA-{année}-{0000}`) déjà implémentée ne doit pas être redessinée
- Le modèle `Document` existant ne doit pas être restructuré sans validation `architect-review`

## Risques

- Factur-X est une norme technique non triviale — la conformité du XML EN 16931 doit être vérifiée par un outil de validation officiel (Factur-X Validator ou équivalent)
- La preuve de conformité PDF/A-3/Factur-X reste incomplète tant qu'aucun validateur externe n'a confirmé le fichier généré
- Le stockage persistant des fichiers en production (volume Docker) doit être inclus dans la procédure de sauvegarde et de redéploiement
- Si un délai légal oblige à l'e-reporting PPF avant la date de lancement prévue, ce lot devient bloquant

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- `pnpm run test` — tests unitaires sur la génération du XML Factur-X
- Validation du fichier généré par un outil de conformité Factur-X officiel
- Test de téléchargement admin depuis le `storageKey` persistant

## Critères de fin

- [x] Une facture émise produit un fichier PDF/A-3 avec XML EN 16931 (CII BASIC) embarqué — **non encore validé par un outil de conformité Factur-X officiel** (action humaine restante)
- [x] Le fichier est stocké de façon persistante (`documents_data`) et résolu depuis l'admin via son `storageKey`
- [x] Le stockage est inclus dans la procédure de sauvegarde documentée dans `docs/exploitation/03-medias-persistants.md`
- [x] `typecheck` et `lint` passent sans erreur
- [ ] Validation Factur-X officielle effectuée
- [ ] `lot-tva-validation-prod` levé (montants TVA confirmés conformes par l'expert-comptable)

## Agent recommandé

`architect-review` pour la revue de conformité résiduelle et la stratégie de validation externe.
