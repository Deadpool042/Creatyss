# RAG local Creatyss

## Objectif

Fournir aux IA (Claude, ChatGPT, Codex) un contexte documentaire pertinent sur le projet Creatyss, sans infrastructure externe, sans coût récurrent et sans impact sur l'application en production.

Ce lot est une expérimentation locale de récupération documentaire. Il ne constitue pas une fonctionnalité métier de Creatyss.

---

## Architecture du lot

```
scripts/rag/
├── creatyss-rag.config.ts       # Configuration typée (sources, corpus, exclusions, limites)
└── search-creatyss-context.ts   # Script de recherche lexicale avec filtrage par corpus

docs/ai/
└── rag-local.md                 # Ce document
```

### Fonctionnement

1. Le script lit les fichiers indexés depuis le disque à chaque exécution (pas de cache).
2. Les arguments CLI sont parsés : requête libre + option `--corpus`.
3. Les sources sont filtrées selon le corpus demandé.
4. La requête est découpée en mots-clés (mots de 2 caractères minimum).
5. Chaque fichier reçoit un score basé sur :
   - la fréquence des mots-clés dans le contenu (×1)
   - la présence des mots-clés dans le nom de fichier (×5)
   - la présence des mots-clés dans les titres Markdown `#` (×3)
6. Un multiplicateur de priorité est appliqué (`high` = ×2, `medium` = ×1).
7. Les N meilleurs résultats sont affichés avec score et extrait.

---

## Corpus disponibles

Chaque source de la config appartient à un corpus. Le filtrage est appliqué avant la recherche.

| Corpus   | Sources indexées                              | Cas d'usage                                   |
| -------- | --------------------------------------------- | --------------------------------------------- |
| `all`    | Toutes les sources (comportement par défaut)  | Recherche transversale, requête inconnue      |
| `docs`   | `AGENTS.md` + `docs/**`                       | Questions de doctrine, architecture, domaines |
| `prisma` | `prisma/**/*.prisma` + `prisma/schema.prisma` | Modèles de données, relations, enums          |
| `code`   | `features/**`                                 | Implémentation, services, queries, composants |

### Quand utiliser quel corpus

- `--corpus=docs` : « Quelle est la doctrine sur les feature flags ? », « Comment est défini le domaine availability ? »
- `--corpus=prisma` : « Quels modèles sont liés aux produits ? », « Comment est structurée la table Order ? »
- `--corpus=code` : « Où est implémenté le service de mise à jour homepage ? », « Quelles queries existent pour le catalog ? »
- `--corpus=all` (défaut) : quand le sujet est transversal ou inconnu

---

## Fichiers indexés

### Priorité haute — corpus `docs`

| Source                 | Description                  |
| ---------------------- | ---------------------------- |
| `AGENTS.md`            | Doctrine canonique du repo   |
| `docs/architecture/**` | Architecture système         |
| `docs/domains/**`      | Domaines métier              |
| `docs/roadmap/**`      | Roadmap projet               |
| `docs/admin/**`        | Documentation administration |
| `docs/ai/**`           | Documentation IA locale      |

### Priorité haute — corpus `prisma`

| Source                    | Description                |
| ------------------------- | -------------------------- |
| `prisma/schema.prisma`    | Schéma Prisma principal    |
| `prisma/core/**`          | Modèles Prisma core        |
| `prisma/optional/**`      | Modèles Prisma optionnels  |
| `prisma/cross-cutting/**` | Modèles Prisma transverses |
| `prisma/satellites/**`    | Modèles Prisma satellites  |

### Priorité moyenne — corpus `code`

| Source        | Description                            |
| ------------- | -------------------------------------- |
| `features/**` | Features métier (`.ts`, `.tsx`, `.md`) |

### Extensions autorisées

`.md` · `.prisma` · `.ts` · `.tsx`

---

## Exclusions

Les dossiers suivants sont ignorés :

- `node_modules/`
- `.git/`
- `.next/`
- `coverage/`
- `public/uploads/`
- `logs/`
- `dist/`
- `__MACOSX/`
- `.DS_Store`

---

## Utilisation

**Prérequis** : exécuter depuis la racine du projet.

```bash
pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code]
```

### Exemples

```bash
# Recherche transversale (défaut)
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation"

# Doctrine uniquement
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation" --corpus=docs

# Modèles Prisma liés aux produits
pnpm tsx scripts/rag/search-creatyss-context.ts "product image category" --corpus=prisma

# Implémentation homepage
pnpm tsx scripts/rag/search-creatyss-context.ts "homepage editable" --corpus=code

# Disponibilité stock (transversal)
pnpm tsx scripts/rag/search-creatyss-context.ts "availability stock" --corpus=all
```

### Validation CLI

Option inconnue :

```
Option inconnue : --foo
Usage : pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code]
```

Corpus invalide :

```
Corpus inconnu : xyz
Valeurs autorisées : all, docs, prisma, code
```

---

## Limites actuelles

- **Recherche lexicale uniquement** : pas de compréhension sémantique, pas de synonymes.
- **Pas de cache** : le corpus est relu à chaque exécution.
- **Pas de découpage en chunks** : les gros fichiers sont scorés mais l'extrait est tronqué à 300 caractères.
- **Exécution depuis la racine obligatoire** : `process.cwd()` doit pointer vers `/Projects/CREATYSS`.
- **Pas d'indexation des imports TypeScript** : les relations entre fichiers `.ts` ne sont pas exploitées.
- **Corpus `code` limité à `features/**`** : `app/`, `components/`, `lib/` ne sont pas indexés pour éviter un bruit excessif.
- **Premier match uniquement pour l'extrait** : si le passage pertinent est en fin de fichier, l'extrait peut être peu informatif.

---

## Pistes d'évolution futures

Ce lot est conçu pour évoluer en niveaux indépendants. Chaque niveau est optionnel et peut être ignoré.

### Niveau 2 — Filtrage par corpus ✅ (lot RAG-2, 2026-06-22)

Ajout d'une option `--corpus=all|docs|prisma|code` pour restreindre le corpus indexé et réduire le bruit sur les requêtes ciblées.

### Niveau 3 — Embeddings locaux

Remplacer le score lexical par un vecteur sémantique généré localement (ex. : `@xenova/transformers` avec un modèle SBERT). Aucune API externe, aucun coût. Nécessite un index pré-calculé.

### Niveau 4 — Base vectorielle

Stocker les embeddings dans une base vectorielle locale (ChromaDB, Qdrant en mode local). Permet une recherche ANN (Approximate Nearest Neighbors) plus rapide sur un corpus plus grand.

### Niveau 5 — Mémoire conversationnelle

Intégrer un système de mémoire persistante par session IA (MemPalace ou équivalent). Permet à l'IA de retrouver le contexte de conversations précédentes sur le projet.

### Niveau 6 — Graphe de connaissances

Construire un graphe des relations entre domaines, modèles Prisma et features (Graphiti ou équivalent). Permet des requêtes structurelles : « quels domaines dépendent de `inventory` ? ».

### Niveau 7 — MCP local

Exposer le RAG comme un serveur MCP pour Claude Code, permettant des appels directs depuis les agents sans passer par la CLI.

---

## Décisions techniques

| Décision                        | Raison                                                        |
| ------------------------------- | ------------------------------------------------------------- |
| Pas de LangChain / LlamaIndex   | Zéro dépendance supplémentaire, contrôle total                |
| Pas d'embeddings                | Zéro coût, zéro infrastructure pour ce lot                    |
| `node:fs` natif uniquement      | Pas de bibliothèque tierce nécessaire                         |
| Score lexical pondéré par zone  | Meilleur signal que TF brut sans complexité                   |
| Multiplicateur priorité ×2 / ×1 | Visible dans le classement sans écraser le signal lexical     |
| Isolé dans `scripts/rag/`       | Supprimable sans impact sur l'application                     |
| Champ `corpus` dans `RagSource` | La config reste source de vérité unique, pas de liste séparée |
| `CORPUS_VALUES` as const        | Validation au runtime sans duplication de type                |
| Pas de commander/yargs          | Parsing minimal sans dépendance, requête suffisamment simple  |
