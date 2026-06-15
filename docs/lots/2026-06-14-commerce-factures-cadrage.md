<!-- docs/lots/2026-06-14-commerce-factures-cadrage.md -->

# Cadrage — Chantier factures (`INVOICE` / `CREDIT_NOTE`)

> Suite de `docs/lots/2026-06-13-commerce-documents-cadrage.md` (options A1 + A2
> réalisées : seed + `DELIVERY_NOTE`). Ouvre le « chantier factures »
> explicitement réservé par `docs/domains/satellites/documents.md`, section
> « Décisions d'implémentation ».
>
> **Nature de ce document : cadrage uniquement.** Aucune implémentation, aucune
> migration. Les décisions de persistance relèvent de `prisma-architect` ; les
> arbitrages fiscaux/légaux relèvent du métier (Laurent) avant tout code.

## Pourquoi un chantier dédié (et pas une extension A3)

La confirmation de commande et le bon de préparation sont des documents
**opérationnels internes** : pas de numérotation séquentielle obligatoire,
contenu dérivable de la commande, aucune contrainte d'immuabilité. La facture
est un **document fiscal et légal** : numérotation séquentielle sans rupture,
contenu figé à l'émission, conservation longue, impossibilité de suppression
après émission. Le changement de nature impose un cadrage séparé.

## État actuel (audit)

### Modèle Prisma déjà en place

`prisma/optional/commerce/documents.prisma` (`Level: L2`,
`DependsOn: foundation.store, commerce.orders`) :

- `DocumentTypeCode` contient déjà `INVOICE` et `CREDIT_NOTE`.
- `Document` : `documentNumber String?`, `@@unique([storeId, documentNumber])`,
  `status` (`DRAFT|GENERATED|ISSUED|SENT|CANCELLED|ARCHIVED`),
  `issuedAt`/`sentAt`/`cancelledAt`/`archivedAt`, pointeurs fichier
  (`fileName`/`mimeType`/`storageKey`/`publicUrl`, tous `null` aujourd'hui),
  relation `order Order?` (`onDelete: Restrict`).
- `DocumentVersion` : versionnement présent, **non alimenté**.
- **Manques structurels pour une facture** : aucun champ de **snapshot légal**
  (le modèle ne fige rien : ni identité vendeur, ni identité acheteur, ni lignes,
  ni ventilation TVA au moment de l'émission) ; aucune **relation avoir → facture
  d'origine** (un `CREDIT_NOTE` doit référencer l'`INVOICE` qu'il corrige) ;
  aucune table **compteur** de numérotation.

### Données disponibles pour le contenu

- **Vendeur** (`Store`) : `legalName`, `siret`, `vatNumber`, `addressLine1`,
  `addressCity`, `addressPostalCode`, `addressCountry` — présents mais **tous
  nullables** (à fiabiliser : une facture exige ces mentions).
- **Acheteur** (`Order` + `OrderAddress` type `BILLING`) : `customerEmail`,
  `customerFirstName`/`customerLastName`, et adresse de facturation (`company`,
  `line1`/`line2`, `postalCode`, `city`, `region`, `countryCode`). **Pas de
  numéro de TVA acheteur** (mentions B2B intracommunautaires non couvertes).
- **Montants** (`Order`) : `subtotalAmount`, `shippingAmount`, `discountAmount`,
  `taxAmount`, `totalAmount` (`Decimal(12,2)`). **Par ligne** (`OrderLine`) :
  `unitPriceAmount`, `lineSubtotalAmount`, `lineDiscountAmount`,
  `lineTaxAmount`, `lineTotalAmount`.
- **Point dur** : `OrderLine` ne stocke **que le montant de TVA agrégé**
  (`lineTaxAmount`), **pas le taux** appliqué. `TaxRule`
  (`prisma/optional/commerce/taxation.prisma`) porte `ratePercent`, mais le lien
  taux ↔ ligne n'est **pas figé** sur la commande. La **ventilation TVA par taux**
  (obligatoire sur une facture) n'est donc pas reconstituable de façon fiable a
  posteriori : c'est la décision la plus structurante du chantier.

### Doctrine déjà tranchée

`docs/domains/satellites/documents.md`, section « Décisions d'implémentation » :

- Numérotation recommandée : table `DocumentCounter` + `SELECT FOR UPDATE` dans
  une transaction Prisma — **pas de séquence PostgreSQL native, pas de SQL brut**.
- `INVOICE`/`CREDIT_NOTE` réservés à ce chantier, conditionnés à des décisions
  préalables : contenu légal (snapshot vs dérivé), champs fiscaux, format de
  numérotation, rétention/archivage.

## ⛔ Constat bloquant — la TVA n'est pas calculée (2026-06-14)

Audit du code : à la création de commande
(`features/commerce/orders/lib/order.repository.ts`), `taxAmount: 0` et
`lineTaxAmount: 0` sont **codés en dur**. `commerce.taxation` n'a **aucun code
applicatif** (modèle Prisma seul, `TaxRule` jamais utilisé hors schéma) — L0 pur.

**Le chantier factures est donc bloqué en amont.** Une facture fige la TVA
réellement appliquée ; tant que la commande enregistre zéro, toute facture serait
fausse et devrait être refaite. Ordre imposé :

1. **`commerce.taxation` d'abord** : détermination du taux par territoire
   (métropole + DOM-TOM ; conçue pour UE/hors-UE), câblage checkout pour peupler
   le taux + montant TVA par ligne sur la commande. Cadrage dédié
   `architect-review` + `prisma-architect`.
2. **Chantier factures ensuite** : le présent document reste valable comme cadre,
   à reprendre une fois la TVA réellement appliquée sur les commandes.

Le reste de ce cadrage (numérotation, snapshot, avoirs, cycle de vie) demeure
pertinent mais **en attente** de la brique TVA.

## Bilan d'exécution (2026-06-14) — prérequis levé, facture V1 livrée

`commerce.taxation` étant fait, la facture V1 (donnée structurée, sans Factur-X)
est implémentée :

- **Schéma** (migration `20260614130000_add_invoice_schema`) : `documents.snapshot`
  (JSONB), `documents.parentDocumentId` (avoir→facture), table `document_counters`.
- **Numérotation** : `allocate-document-number.service.ts` — `INSERT … ON CONFLICT`
  + `SELECT … FOR UPDATE`, séquence sans trou par (store, type, année),
  format `FA-{année}-{0000}`.
- **Émission** : `issue-invoice.service.ts` — snapshot légal figé (vendeur,
  acheteur, lignes HT/TVA/TTC), numéro alloué, `Document` INVOICE `ISSUED`, une
  seule active par commande. Action + bouton « Émettre la facture ».
- **PDF** : `render-document-pdf.ts` (pdf-lib) + route
  `GET /admin/commerce/documents/[id]/pdf` + lien « Télécharger le PDF » — pour
  confirmation, bon de préparation et facture.

**Reste** : avoir (`CREDIT_NOTE` via `parentDocumentId`), Factur-X (PDF/A-3 + XML
EN 16931), transmission e-reporting PPF, stockage persistant des fichiers
(`storageKey`). Le PDF est généré à la demande (pas stocké) en V1.

## Réforme facturation électronique FR (vérifié web le 2026-06-14)

> Réserve : ce document n'est pas un conseil fiscal/juridique. Les arbitrages
> fiscaux doivent être validés par l'expert-comptable. Synthèse des sources
> officielles/secteur ci-dessous.

- **Calendrier** : réception obligatoire pour **toutes** les entreprises
  assujetties TVA au **1ᵉʳ sept. 2026** ; émission obligatoire grandes
  entreprises/ETI au **1ᵉʳ sept. 2026** ; TPE/PME au **1ᵉʳ sept. 2027** (pilote
  dès févr. 2026).
- **Régimes distincts** : B2B domestique → **e-invoicing** (facture structurée
  transmise via plateforme) ; **B2C et transfrontalier → e-reporting** (données
  de transaction transmises, pas de facture électronique normée entre parties).
  Le régime applicable à Creatyss dépend donc de la cible (cf. prérequis P4).
- **Formats** : **Factur-X** (hybride PDF/A-3 + XML embarqué), **UBL 2.1** ou
  **CII**, tous conformes à la norme européenne **EN 16931**.
- **Transmission** : via **PDP** (plateforme de dématérialisation partenaire,
  agréée) ou **PPF** (portail public de facturation). L'échange direct B2B de
  factures ne sera plus autorisé.

**Conséquences d'architecture (structurantes) :**

1. **Donnée structurée d'abord, rendu ensuite.** L'artefact de référence est la
   facture **structurée EN 16931** (mentions obligatoires complètes), dont on
   dérive le PDF lisible *et* le XML. Construire un générateur de PDF autonome =
   non conforme et à refaire. Cela renforce D2 (snapshot) et D3 (taux par ligne).
2. **Snapshot EN 16931-complet.** Le snapshot de D2 doit couvrir tous les champs
   obligatoires EN 16931 (identité+SIREN/TVA vendeur, identité acheteur,
   numéro/dates, ventilation TVA par taux, totaux HT/TVA/TTC, conditions de
   paiement, mentions légales).
3. **Transmission PDP/PPF = chantier séparé.** Ne pas l'embarquer ici. Concevoir
   la donnée structurée pour qu'une PDP puisse la consommer plus tard.

## Décision verrouillée — cible B2C (2026-06-14)

**Creatyss vend uniquement à des particuliers (B2C).** Conséquences :

- **Régime = e-reporting**, pas e-invoicing. Pas de Factur-X obligatoire *entre
  parties*, pas de routage PDP/PPF des factures B2B. L'obligation est de
  **reporter les données de transaction** (e-reporting), pas d'émettre une
  facture électronique normée à chaque client. → **simplifie nettement** D6 et la
  transmission.
- **Pas de SIREN/TVA acheteur**, pas de mentions d'autoliquidation. → D4/contenu
  allégé côté acheteur (identité + adresse de facturation suffisent).
- **Reste requis** : une facture B2C demandée par le client est un document
  légal (numérotation séquentielle sans trou, immuabilité, conservation). D1, D2,
  D5, D7 restent pleinement applicables.
- **TVA** : la ventilation par taux reste nécessaire si le catalogue est
  multi-taux (FR : 20 / 10 / 5,5 / 2,1 %). Le trou amont (taux par ligne sur
  `OrderLine`) reste à corriger (D3 P4).

## Décision verrouillée — géographie & multi-taux (2026-06-14)

**Aujourd'hui : France métropole + DOM-TOM. Cible future : UE + hors-UE.**

La présence des DOM-TOM rend le système **multi-taux et multi-territoire dès le
jour 1** (vérifié web, fiscal à confirmer par l'expert-comptable) :

- Métropole : 20 / 10 / 5,5 / 2,1 %.
- Guadeloupe, Martinique, Réunion : **8,5 %** (normal), 2,1 / 1,75 / 1,05 %.
- Guyane, Mayotte : **TVA non applicable** (exonéré).

Pour un même produit, le taux **dépend du territoire de livraison**. Conséquences :

1. **Multi-taux confirmé** — la question mono/multi est tranchée par la
   géographie, pas par le catalogue.
2. **Détermination du taux par territoire = `commerce.taxation` + checkout, en
   amont.** C'est un **prérequis** au chantier factures : la facture fige le taux,
   elle ne le calcule pas. Si cette brique amont est immature, elle doit être
   cadrée/assainie **avant** d'émettre des factures.
3. **Capture du taux par ligne sur la commande** (D3 P4) devient le socle
   non négociable, et doit porter l'origine (territoire/règle) du taux.
4. **Future UE/hors-UE** : concevoir la capture de taux et le snapshot pour
   accueillir OSS (taux pays UE au-delà du seuil) et exonération export sans
   refonte — pas d'implémentation maintenant, juste un modèle qui ne ferme pas
   la porte.

**Défauts recommandés (future-proof, pour ne pas refaire) :**

1. Concevoir le snapshot **EN 16931-complet** même en B2C — coût marginal faible,
   rend une bascule Factur-X (e-reporting structuré / évolution réglementaire)
   triviale plus tard.
2. **Capturer le taux TVA par ligne dès la commande** (D3 option 1) — nécessaire
   dès qu'il y a plus d'un taux, non rétro-actif : à faire tôt.
3. Numérotation `FA-{année}-{séquence}` par store, réinit annuelle (D1) — à
   confirmer P3.
4. V1 = donnée structurée + **PDF lisible** ; Factur-X et e-reporting PPF =
   différés, conçus pour brancher sans refonte.

## Décisions à trancher (avant tout code)

### D1 — Stratégie de numérotation

Contrainte légale (FR) : séquence **continue, sans trou**, attribuée à
l'émission, non réutilisable.

1. **`DocumentCounter` + `SELECT FOR UPDATE`** (recommandé, conforme doctrine) :
   table `(storeId, typeCode, year)` → `lastValue`, incrément dans la transaction
   d'émission. Garantit l'absence de trou même en concurrence.
2. Champ atomique sur `Store` : rejeté (ne porte pas la dimension type/année,
   verrou trop large).

À trancher dans D1 : **portée du compteur** (par store + type + année ?),
**format** (`FA-2026-0001` factures / `AV-2026-0001` avoirs ?), **réinitialisation
annuelle** ou continue.

### D2 — Contenu légal : snapshot vs dérivé

Une facture émise est **immuable** ; or `Order`/`Store` peuvent changer ensuite.

1. **Snapshot à l'émission** (recommandé) : figer identité vendeur, identité
   acheteur, lignes, ventilation TVA, totaux dans une structure dédiée (champ
   JSON sur `Document` **ou** table `DocumentLine` + colonnes d'en-tête). Décision
   de forme = `prisma-architect`.
2. Dérivation au rendu depuis `Order` : rejeté (l'immuabilité légale n'est pas
   garantie si la commande est modifiée/archivée).

### D3 — Ventilation TVA (dépend de D2)

Au vu du point dur ci-dessus, et **la facture fige, ne calcule pas** : la
détermination du taux (national, OSS pays destination UE au-delà du seuil
10 000 €, exonération export hors-UE, autoliquidation B2B intra-UE) relève du
moteur `commerce.taxation` / du checkout **en amont**, pas du chantier factures.

**Trou amont à corriger en priorité** : `OrderLine` ne stocke pas le taux
appliqué (seulement `lineTaxAmount`). Sans ça, aucune ventilation TVA fiable.

1. **Capturer le taux appliqué au niveau ligne dès la commande** (recommandé) :
   ajouter le taux (et son origine : règle/pays) sur `OrderLine` au moment du
   checkout, puis le snapshot facture le reprend tel quel. Décision de schéma =
   `prisma-architect`, et touche `commerce.orders`/`commerce.checkout` (au-delà
   du seul domaine documents — à cadrer comme prérequis).
2. Taux unique boutique : acceptable seulement si catalogue mono-taux **et**
   ventes franco-françaises uniquement — à confirmer (cf. P1).

### D4 — Avoir (`CREDIT_NOTE`)

1. **Relation `Document.parentDocumentId` → facture d'origine** (recommandé) :
   l'avoir référence l'`INVOICE`, reprend tout ou partie des lignes, numérotation
   propre (`AV-…`). Champ à ajouter au schéma (`prisma-architect`).
2. Avoir libre non rattaché : hors périmètre V1.

### D5 — Cycle de vie & immuabilité

- `DRAFT` (modifiable, pas de numéro) → `ISSUED` (numéro attribué, snapshot figé,
  **plus aucune modification**) → `SENT`.
- **Annulation** : interdiction de supprimer une facture émise ; correction
  uniquement via `CREDIT_NOTE`. `CANCELLED` réservé aux brouillons.
- À trancher : autorise-t-on l'état `DRAFT` éditable, ou émission directe ?

### D6 — Génération du fichier (PDF / Factur-X)

`storageKey`/`publicUrl` sont vides aujourd'hui (aucun rendu réel n'existe dans
le repo). Décidé (cf. réforme) : **structuré d'abord**, le fichier en découle.

1. **V1 = donnée structurée EN 16931 + PDF lisible dérivé** (recommandé) ; le
   PDF est rendu depuis le snapshot, jamais l'inverse. Vérifier le backend de
   stockage réel (`storageKey` — quel objet store ?) avant ce sous-lot.
2. **V2 = Factur-X** (PDF/A-3 + XML EN 16931 embarqué) : packaging au-dessus de
   V1, sans refonte. Activable quand l'obligation d'émission s'applique.
3. **Transmission PDP/PPF : hors de ce chantier** (intégration dédiée).

À trancher : V1 (structuré + PDF) maintenant, V2 Factur-X plus tard — ou viser
Factur-X directement si l'échéance d'émission est proche pour l'entité.

### D7 — Rétention / archivage

Conservation légale (FR : 10 ans). `archivedAt` existe. À trancher : politique de
rétention, accès aux factures archivées, lien éventuel avec `export`.

## Sous-lots proposés (indicatif, après arbitrages D1–D7)

Cadre **prisma-architect** d'abord (D1–D4 touchent le schéma), puis
implémentation, puis quality gate.

1. **Sous-lot schéma** (`prisma-architect`) : `DocumentCounter`, champs/table de
   snapshot légal (D2/D3), `parentDocumentId` (D4), migration. Vérif
   `prisma validate` + `prisma migrate`.
2. **Sous-lot numérotation** : service transactionnel `SELECT FOR UPDATE`
   (allocation atomique, sans trou), tests de concurrence.
3. **Sous-lot émission facture** : service `issueInvoice` (snapshot + numéro +
   passage `ISSUED`), action, garde feature `commerce.documents` active.
4. **Sous-lot avoir** : service `issueCreditNote` (rattachement facture,
   reprise lignes, numéro propre).
5. **Sous-lot UI admin** : intégration dans le détail commande / écran documents
   (boutons émission, lecture, statuts), `next-admin-ui-builder`.
6. **Sous-lot PDF** (si D6 = inclus) : rendu + stockage `storageKey`/`publicUrl`.
7. **Sous-lot doc** : `documents.md` (décisions D1–D7 tranchées), roadmap audit,
   bilan.

## Hors périmètre de ce cadrage

- Mentions B2B intracommunautaires (TVA acheteur) — non porté par le modèle
  actuel, à cadrer séparément si besoin.
- Fiabilisation des champs vendeur `Store` (passer `legalName`/`siret`/`vatNumber`
  de nullable à requis-à-l'émission) : à intégrer comme garde d'émission, pas
  comme refonte `Store`.
- `commerce.taxation` en tant que moteur de calcul TVA complet (le chantier
  factures consomme la TVA, ne la recalcule pas).

## Prérequis de décision (à confirmer par Laurent avant ouverture)

**P0 — PIVOT : cible commerciale.** Creatyss vend-il à des **professionnels
(B2B)** ou **uniquement à des particuliers (B2C)** ? Détermine le régime légal
(e-invoicing vs e-reporting), le besoin SIREN/TVA acheteur, les mentions
d'autoliquidation, et l'architecture de transmission. **Bloque tout le reste.**

**P1 — Périmètre géographique des ventes** : franco-français uniquement, UE,
ou hors-UE ? Conditionne D3 (mono-taux vs OSS/exonération/autoliquidation).
Réponse Laurent (à préciser) : taux du pays de l'acheteur si étranger — vrai
pour B2C UE au-delà du seuil OSS seulement ; export hors-UE = exonération.

**P2 — Conformité visée et échéance** : émission Factur-X dès maintenant
(D6 option directe) ou V1 structuré + PDF puis Factur-X V2 ? Dépend de la date
d'obligation d'émission pour l'entité (TPE/PME = sept. 2027).

**P3 — Numérotation** : format (`FA-2026-0001` / `AV-2026-0001` ?), portée
(store + type + année), réinitialisation annuelle ou continue.

**P4 — Prérequis amont confirmé** : capture du taux TVA par ligne sur la
commande (D3 option 1) — à traiter avant l'émission de factures, car non
rétro-actif sur les commandes existantes.
