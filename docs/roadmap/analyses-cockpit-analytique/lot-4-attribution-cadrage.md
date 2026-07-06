# Lot 4 — Attribution marketing : cadrage

Suite de `docs/roadmap/analyses-cockpit-analytique/README.md`. Ce document cadre le lot 4 avant tout code — aucune implémentation ici, à l'image du cadrage initial du chantier.

## Observé (2026-07-06)

- `docs/domains/cross-cutting/attribution.md` : domaine entièrement conceptuel, `activable: oui`, aucun `FeatureFlag` seedé, aucun modèle Prisma, aucun code.
- Aucune capture de paramètres UTM (`utm_source`, `utm_medium`, `utm_campaign`) nulle part dans le repo (`app/`, `features/`, `prisma/`) — vérifié par recherche exhaustive.
- Aucun champ `source`/`channel`/`referrer` sur `Order`, `Customer`, `NewsletterSubscriber` ou `Checkout` — la commande et l'inscription newsletter n'ont aujourd'hui aucune trace de provenance marketing.
- Les lots 2 (tracking recherche) et 3 (relance panier abandonné), livrés le 2026-07-06, ne produisent pas de signal directement attribuable (ce sont des compteurs agrégés anonymes ou des transitions de statut panier, pas des événements de conversion identifiables individuellement à une source).

## Le fork architectural à trancher

Attribuer une commande ou une inscription newsletter à une source/canal/campagne nécessite deux briques qui n'existent pas :

1. **Capture à l'entrée** : lire les paramètres UTM de l'URL d'atterrissage (`?utm_source=instagram&utm_campaign=...`) sur la première visite.
2. **Mémorisation jusqu'à la conversion** : le visiteur peut naviguer plusieurs pages, revenir plusieurs jours plus tard — il faut donc **mémoriser** la source de premier contact (ou de dernier contact selon le modèle retenu) jusqu'à l'événement de conversion (commande, inscription).

Le point 2 est structurant : le repo n'a aujourd'hui que deux précédents de mémorisation storefront, tous deux des **cookies techniques** (panier, favoris — `core/sessions/`), jamais un cookie de tracking marketing. Le tracking analytics existant (`features/analytics/tracking/`) a été conçu explicitement **sans identifiant de session** ("les sessions et visiteurs uniques ne sont pas approximables sans identifiant : ils ne sont volontairement pas collectés" — commentaire du code). L'attribution, par nature, a besoin de relier une visite à une conversion ultérieure : elle **ne peut pas** fonctionner avec le même principe d'anonymat total.

Trois options, par ordre croissant d'intrusion :

- **A — Cookie technique de premier contact** (pattern `core/sessions/cart.ts` : signé HMAC, httpOnly, durée limitée, un seul usage : mémoriser `utm_source`/`utm_medium`/`utm_campaign` de la première visite). Pas de tracking cross-site, pas de fingerprinting, mais c'est un nouveau cookie dédié au marketing — à distinguer explicitement des cookies fonctionnels existants dans la doc RGPD/cookies du site si elle existe.
- **B — Paramètres portés dans l'URL jusqu'au checkout** (pas de cookie : les UTM sont propagés de page en page via un paramètre de requête ou un champ caché de formulaire). Zéro persistance serveur ou cookie, mais fragile (perdu si le visiteur ouvre un nouvel onglet, ferme puis revient plus tard, ou partage un lien sans les paramètres) — capte uniquement les conversions dans la même visite continue.
- **C — Rien côté Creatyss, lecture externe via Plausible/Umami** : les providers analytics externes déjà en place (`features/analytics/providers/`, lot 1) peuvent nativement rapprocher trafic entrant et objectifs (Umami a une notion de referrer/UTM par défaut). Aucune attribution _interne_ : le cockpit renverrait vers l'outil externe pour ces lectures, cohérent avec la frontière déjà actée dans `docs/domains/cross-cutting/analytics.md` ("providers externes analytics, qui relèvent de `integrations`").

## Recommandation (à valider, pas tranchée par ce document)

L'option C est la plus cohérente avec la trajectoire déjà suivie par ce chantier (lot 1 : ne pas dupliquer ce qu'un provider externe fait déjà — cf. la décision Umami). Elle évite d'introduire un nouveau cookie marketing et une nouvelle mémorisation de session, qui serait la première dérogation au principe d'anonymat strict du tracking interne. Les options A/B ne devraient être envisagées que si un besoin précis n'est pas couvert par Umami (ex: attribution fine par commande individuelle, pas seulement par agrégat de trafic).

## Dépendance réelle avec les lots 2/3

Le découpage initial du README supposait que les lots 2 et 3 fourniraient "des événements à attribuer" — en pratique, ils ne le font pas directement : le tracking recherche (lot 2) reste un agrégat anonyme sans lien à une conversion individuelle, et la relance panier abandonné (lot 3) est une automation sortante, pas un signal entrant à attribuer. La dépendance documentée dans le README est donc à corriger : lot 4 ne dépend pas techniquement de 2/3, seulement de la disponibilité d'un événement de conversion identifiable (`Order` créée, `NewsletterSubscriber` créé) — déjà présents indépendamment de ces deux lots.

## Hors périmètre de ce document

Toute implémentation. Ce cadrage sert à trancher le choix A/B/C avant d'écrire du code — la décision est un vrai choix produit/RGPD, pas un détail technique.
