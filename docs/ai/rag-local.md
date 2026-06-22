# RAG local Creatyss

## Objectif

Fournir aux IA (Claude, ChatGPT, Codex) un contexte documentaire pertinent sur le projet Creatyss, sans infrastructure externe, sans coût récurrent et sans impact sur l'application en production.

Ce lot est une expérimentation locale de récupération documentaire. Il ne constitue pas une fonctionnalité métier de Creatyss.

---

## Architecture du lot

```
scripts/rag/
├── creatyss-rag.config.ts       # Configuration typée (sources, exclusions, limites)
└── search-creatyss-context.ts   # Script de recherche lexicale

docs/ai/
└── rag-local.md                 # Ce document
```

### Fonctionnement

1. Le script lit les fichiers indexés depuis le disque à chaque exécution (pas de cache).
2. La requête est découpée en mots-clés (mots de 2 caractères minimum).
3. Chaque fichier reçoit un score basé sur :
   - la fréquence des mots-clés dans le contenu (×1)
   - la présence des mots-clés dans le nom de fichier (×5)
   - la présence des mots-clés dans les titres Markdown `#` (×3)
4. Un multiplicateur de priorité est appliqué (`high` = ×2, `medium` = ×1).
5. Les N meilleurs résultats sont affichés avec score et extrait.

---

## Fichiers indexés

### Priorité haute

| Source                    | Description                  |
| ------------------------- | ---------------------------- |
| `AGENTS.md`               | Doctrine canonique du repo   |
| `docs/architecture/**`    | Architecture système         |
| `docs/domains/**`         | Domaines métier              |
| `docs/roadmap/**`         | Roadmap projet               |
| `docs/admin/**`           | Documentation administration |
| `docs/ai/**`              | Documentation IA locale      |
| `prisma/schema.prisma`    | Schéma Prisma principal      |
| `prisma/core/**`          | Modèles Prisma core          |
| `prisma/optional/**`      | Modèles Prisma optionnels    |
| `prisma/cross-cutting/**` | Modèles Prisma transverses   |
| `prisma/satellites/**`    | Modèles Prisma satellites    |

### Priorité moyenne

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
pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>"
```

### Exemples

```bash
# Trouver les docs sur les feature flags
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags"

# Trouver la doctrine sur le domaine availability
pnpm tsx scripts/rag/search-creatyss-context.ts "availability stock"

# Trouver les modèles Prisma liés aux commandes
pnpm tsx scripts/rag/search-creatyss-context.ts "order fulfillment prisma"

# Rechercher la configuration Stripe
pnpm tsx scripts/rag/search-creatyss-context.ts "stripe webhook payment"
```

### Exemple de sortie

```
── Résultats RAG Creatyss pour : "feature flags" (3 fichiers) ──

1. docs/admin/settings-advanced-feature-system.md
   Score : 48.0
   Extrait : …# Système de feature flags avancé…

2. docs/architecture/20-structure/22-capacites-optionnelles.md
   Score : 12.0
   Extrait : …les capacités optionnelles sont activées via des feature flags…

3. features/admin/settings/feature-flags/index.ts
   Score : 6.0
   Extrait : …export { FeatureFlagService }…
```

---

## Limites actuelles

- **Recherche lexicale uniquement** : pas de compréhension sémantique, pas de synonymes.
- **Pas de cache** : le corpus est relu à chaque exécution.
- **Pas de découpage en chunks** : les gros fichiers sont scorés mais l'extrait est tronqué à 300 caractères.
- **Exécution depuis la racine obligatoire** : `process.cwd()` doit pointer vers `/Projects/CREATYSS`.
- **Pas d'indexation des imports TypeScript** : les relations entre fichiers `.ts` ne sont pas exploitées.

---

## Pistes d'évolution futures

Ce lot est conçu pour évoluer en niveaux indépendants. Chaque niveau est optionnel et peut être ignoré.

### Niveau 2 — Embeddings locaux

Remplacer le score lexical par un vecteur sémantique généré localement (ex. : `@xenova/transformers` avec un modèle SBERT). Aucune API externe, aucun coût. Nécessite un index pré-calculé.

### Niveau 3 — Base vectorielle

Stocker les embeddings dans une base vectorielle locale (ChromaDB, Qdrant en mode local). Permet une recherche ANN (Approximate Nearest Neighbors) plus rapide sur un corpus plus grand.

### Niveau 4 — Mémoire conversationnelle

Intégrer un système de mémoire persistante par session IA (MemPalace ou équivalent). Permet à l'IA de retrouver le contexte de conversations précédentes sur le projet.

### Niveau 5 — Graphe de connaissances

Construire un graphe des relations entre domaines, modèles Prisma et features (Graphiti ou équivalent). Permet des requêtes structurelles : « quels domaines dépendent de `inventory` ? ».

### Niveau 6 — MCP local

Exposer le RAG comme un serveur MCP pour Claude Code, permettant des appels directs depuis les agents sans passer par la CLI.

---

## Décisions techniques

| Décision                        | Raison                                                    |
| ------------------------------- | --------------------------------------------------------- |
| Pas de LangChain / LlamaIndex   | Zéro dépendance supplémentaire, contrôle total            |
| Pas d'embeddings                | Zéro coût, zéro infrastructure pour ce lot                |
| `node:fs` natif uniquement      | Pas de bibliothèque tierce nécessaire                     |
| Score lexical pondéré par zone  | Meilleur signal que TF brut sans complexité               |
| Multiplicateur priorité ×2 / ×1 | Visible dans le classement sans écraser le signal lexical |
| Isolé dans `scripts/rag/`       | Supprimable sans impact sur l'application                 |
