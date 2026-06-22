# RAG local Creatyss

## Objectif

Fournir aux IA (Claude, ChatGPT, Codex) un contexte documentaire pertinent sur le projet Creatyss, sans infrastructure externe, sans coût récurrent et sans impact sur l'application en production.

Ce lot est une expérimentation locale de récupération documentaire. Il ne constitue pas une fonctionnalité métier de Creatyss.

---

## Architecture du lot

```
scripts/rag/
├── creatyss-rag.config.ts       # Configuration typée (sources, corpus, exclusions, limites)
├── rag-search.ts                # Module importable : searchCreatyssContext, buildCreatyssContextOutput
├── search-creatyss-context.ts   # Entrée CLI : parsing, validation, écriture console/fichier
└── mcp-server.ts                # Serveur MCP stdio : expose l'outil search_context

docs/ai/
└── rag-local.md                 # Ce document
```

### Fonctionnement

1. Le script lit les fichiers indexés depuis le disque à chaque exécution (pas de cache).
2. Les arguments CLI sont parsés : requête libre + options `--corpus`, `--format` et `--output`.
3. Les sources sont filtrées selon le corpus demandé.
4. La requête est découpée en mots-clés (mots de 2 caractères minimum).
5. Chaque fichier reçoit un score basé sur :
   - la fréquence des mots-clés dans le contenu (×1)
   - la présence des mots-clés dans le nom de fichier (×5)
   - la présence des mots-clés dans les titres Markdown `#` (×3)
6. Un multiplicateur de priorité est appliqué (`high` = ×2, `medium` = ×1).
7. Les N meilleurs résultats sont affichés selon le format demandé.

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
pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code] [--format=list|prompt] [--output=<chemin>]
```

### Formats de sortie

| Format   | Description                                     | Cas d'usage                                  |
| -------- | ----------------------------------------------- | -------------------------------------------- |
| `list`   | Sortie lisible dans le terminal (défaut)        | Exploration rapide, vérification des sources |
| `prompt` | Bloc Markdown structuré avec rappel de doctrine | À copier-coller dans Claude, ChatGPT, Codex  |

Le mode `--format=prompt` produit un bloc autonome prêt à être collé en début de conversation IA. Il ne sert pas à automatiser les modifications — il prépare un contexte que l'utilisateur soumet ensuite manuellement.

### Export vers fichier (`--output`)

L'option `--output=<chemin>` écrit la sortie dans un fichier Markdown au lieu de l'afficher dans le terminal. Elle est combinable avec tous les formats et corpus.

```bash
# Générer un fichier de contexte pour une session IA
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation" \
  --corpus=docs --format=prompt --output=tmp/rag-context.md
```

Le fichier produit est un contexte figé au moment de l'exécution. Il peut être :

- attaché dans une conversation Claude ou ChatGPT ;
- ouvert dans un éditeur et copié manuellement ;
- versionné ponctuellement si besoin.

**Contraintes de sécurité :**

- Le chemin doit être relatif à la racine du projet.
- Les chemins absolus sont refusés.
- Les chemins sortant du projet via `..` sont refusés.
- Le dossier parent est créé automatiquement si nécessaire.

> `tmp/` peut être ignoré par Git en ajoutant `tmp/` à `.gitignore` si les exports ne doivent pas être versionnés.

### Exemples

```bash
# Recherche transversale, affichage terminal (défaut)
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation"

# Doctrine uniquement, affichage terminal
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation" --corpus=docs

# Doctrine → bloc IA copiable (pour Claude ou ChatGPT)
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation" --corpus=docs --format=prompt

# Doctrine → fichier Markdown exporté
pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags gradation" \
  --corpus=docs --format=prompt --output=tmp/rag-context.md

# Modèles Prisma → bloc IA copiable
pnpm tsx scripts/rag/search-creatyss-context.ts "product image category" --corpus=prisma --format=prompt

# Implémentation homepage, affichage terminal
pnpm tsx scripts/rag/search-creatyss-context.ts "homepage editable" --corpus=code

# Disponibilité stock (transversal) → bloc IA copiable
pnpm tsx scripts/rag/search-creatyss-context.ts "availability stock" --corpus=all --format=prompt
```

### Validation CLI

Option inconnue :

```
Option inconnue : --badflag
Usage : pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code] [--format=list|prompt] [--output=<chemin>]
```

`--output` sans valeur :

```
Option --output requiert une valeur : --output=<chemin>
```

Chemin absolu refusé :

```
Chemin absolu refusé : /tmp/rag-context.md
Utiliser un chemin relatif depuis la racine du projet.
```

Chemin sortant du projet :

```
Chemin invalide : le fichier de sortie doit rester dans le projet.
Chemin refusé : ../rag-context.md
```

Corpus invalide :

```
Corpus inconnu : xyz
Valeurs autorisées : all, docs, prisma, code
```

Format invalide :

```
Format inconnu : unknown
Valeurs autorisées : list, prompt
```

---

## Serveur MCP local

Le fichier `scripts/rag/mcp-server.ts` expose le RAG Creatyss comme un serveur MCP stdio.

### Outil exposé : `search_context`

```json
{
  "name": "search_context",
  "description": "Recherche du contexte documentaire Creatyss (doctrine, architecture, Prisma, code).",
  "inputSchema": {
    "query": "string (obligatoire, non vide)",
    "corpus": "\"all\" | \"docs\" | \"prisma\" | \"code\" (optionnel, défaut : \"all\")",
    "format": "\"list\" | \"prompt\" (optionnel, défaut : \"prompt\")"
  }
}
```

La sortie est le texte produit par `buildCreatyssContextOutput` — identique à la sortie CLI `--format=prompt` par défaut.

### Test local (sans configuration Claude Code)

```bash
# Démarrer le serveur et envoyer une requête JSON-RPC manuellement
pnpm tsx scripts/rag/mcp-server.ts
```

Le serveur attend des messages JSON-RPC sur stdin et répond sur stdout. Il est conçu pour être lancé par Claude Code en tant que processus enfant — pas pour être utilisé directement dans un terminal interactif.

Pour vérifier que le fichier compile sans erreur :

```bash
pnpm run typecheck
```

### Statut d'activation

**Le serveur n'est pas actif tant qu'il n'est pas déclaré dans la configuration Claude Code.**

La configuration MCP locale (`.claude/settings.local.json` ou `.mcp.json`) sera réalisée dans le lot suivant **RAG-8**. Ce fichier ne doit pas être modifié dans le lot RAG-7.

### Dépendance

Le serveur requiert `@modelcontextprotocol/sdk` en devDependency :

```bash
pnpm add -D @modelcontextprotocol/sdk
```

Cette dépendance est importée uniquement depuis `scripts/rag/` — aucun import depuis l'application Next.js.

---

## Limites actuelles

- **Recherche lexicale uniquement** : pas de compréhension sémantique, pas de synonymes.
- **Pas de cache** : le corpus est relu à chaque exécution.
- **Pas de découpage en chunks** : les gros fichiers sont scorés mais l'extrait est tronqué à 300 caractères.
- **Exécution depuis la racine obligatoire** : `process.cwd()` doit pointer vers `/Projects/CREATYSS`.
- **Pas d'indexation des imports TypeScript** : les relations entre fichiers `.ts` ne sont pas exploitées.
- **Corpus `code` limité à `features/**`** : `app/`, `components/`, `lib/` ne sont pas indexés pour éviter un bruit excessif.
- **Densité lexicale, non sémantique** : la fenêtre choisie maximise les occurrences des mots-clés dans 300 caractères, mais ne comprend pas le sens — un passage dense en mots-clés peut être moins pertinent qu'un passage plus rare mais plus ciblé.

---

## Pistes d'évolution futures

Ce lot est conçu pour évoluer en niveaux indépendants. Chaque niveau est optionnel et peut être ignoré.

### Niveau 1 — Module importable ✅ (lot RAG-6, 2026-06-22)

Extraction de la logique de recherche dans `rag-search.ts`, exporté sous deux fonctions publiques :

- `searchCreatyssContext({ query, corpus })` — retourne les résultats scorés
- `buildCreatyssContextOutput({ results, query, corpus, format })` — retourne la sortie formatée

La CLI (`search-creatyss-context.ts`) conserve son comportement inchangé. Cette extraction prépare l'intégration MCP (RAG-7) sans l'implémenter.

### Niveau 2 — Filtrage par corpus ✅ (lot RAG-2, 2026-06-22)

Ajout d'une option `--corpus=all|docs|prisma|code` pour restreindre le corpus indexé et réduire le bruit sur les requêtes ciblées.

### Niveau 3 — Format prompt copiable ✅ (lot RAG-3, 2026-06-22)

Ajout d'une option `--format=list|prompt` pour produire un bloc Markdown structuré avec rappel de doctrine, prêt à être collé dans Claude, ChatGPT ou Codex.

### Niveau 4 — Embeddings locaux

Remplacer le score lexical par un vecteur sémantique généré localement (ex. : `@xenova/transformers` avec un modèle SBERT). Aucune API externe, aucun coût. Nécessite un index pré-calculé.

### Niveau 4 — Base vectorielle

Stocker les embeddings dans une base vectorielle locale (ChromaDB, Qdrant en mode local). Permet une recherche ANN (Approximate Nearest Neighbors) plus rapide sur un corpus plus grand.

### Niveau 5 — Mémoire conversationnelle

Intégrer un système de mémoire persistante par session IA (MemPalace ou équivalent). Permet à l'IA de retrouver le contexte de conversations précédentes sur le projet.

### Niveau 6 — Graphe de connaissances

Construire un graphe des relations entre domaines, modèles Prisma et features (Graphiti ou équivalent). Permet des requêtes structurelles : « quels domaines dépendent de `inventory` ? ».

### Niveau 7 — MCP local ✅ (lot RAG-7, 2026-06-22)

Exposer le RAG comme un serveur MCP pour Claude Code, permettant des appels directs depuis les agents sans passer par la CLI.

---

## Décisions techniques

| Décision                                    | Raison                                                                                                           |
| ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Pas de LangChain / LlamaIndex               | Zéro dépendance supplémentaire, contrôle total                                                                   |
| Pas d'embeddings                            | Zéro coût, zéro infrastructure pour ce lot                                                                       |
| `node:fs` natif uniquement                  | Pas de bibliothèque tierce nécessaire                                                                            |
| Score lexical pondéré par zone              | Meilleur signal que TF brut sans complexité                                                                      |
| Multiplicateur priorité ×2 / ×1             | Visible dans le classement sans écraser le signal lexical                                                        |
| Isolé dans `scripts/rag/`                   | Supprimable sans impact sur l'application                                                                        |
| Champ `corpus` dans `RagSource`             | La config reste source de vérité unique, pas de liste séparée                                                    |
| `CORPUS_VALUES` as const                    | Validation au runtime sans duplication de type                                                                   |
| Pas de commander/yargs                      | Parsing minimal sans dépendance, requête suffisamment simple                                                     |
| `FORMAT_VALUES` as const                    | Même pattern que `CORPUS_VALUES` — cohérence et validation sans duplication                                      |
| Rappel de doctrine fixe                     | Pas de génération dynamique — les invariants sont stables et connus d'avance                                     |
| Bloc ` ```text ``` ` pour les extraits      | Évite les ambiguïtés si l'extrait contient du Markdown                                                           |
| Fenêtre d'extrait par densité (RAG-4)       | Maximise les occurrences de mots-clés dans la fenêtre de 300 chars — tie-break : fenêtre la plus proche du début |
| `--output` relatif seulement (RAG-5)        | Chemins absolus et `..` refusés — l'export ne peut pas sortir du projet                                          |
| `build*` → `string` au lieu de `void`       | Séparation construction/effet — le choix console/fichier est centralisé à l'entrée principale                    |
| `rag-search.ts` séparé (RAG-6)              | Logique importable sans effet de bord — CLI reste l'usage principal, MCP peut importer sans dupliquer            |
| `@modelcontextprotocol/sdk` devDep (RAG-7)  | Évite une implémentation JSON-RPC stdio fragile — usage local scripts uniquement, aucun import depuis Next.js    |
| `registerTool` avec `z.object` (RAG-7)      | API explicite avec `description` séparée du schema — lisible dans l'UI d'appel d'outil de Claude Code            |
| `format` défaut `"prompt"` côté MCP (RAG-7) | Le contexte MCP sert à alimenter une IA — le format prompt est plus pertinent que `list` dans ce cas d'usage     |
