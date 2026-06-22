import * as fs from "node:fs";
import * as path from "node:path";

import {
  CORPUS_VALUES,
  FORMAT_VALUES,
  ragConfig,
  type CorpusType,
  type FormatType,
  type RagSource,
} from "./creatyss-rag.config";

interface SearchResult {
  filePath: string;
  relativePath: string;
  score: number;
  excerpt: string;
}

interface ParsedArgs {
  query: string;
  corpus: CorpusType;
  format: FormatType;
}

const USAGE =
  'Usage : pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code] [--format=list|prompt]';
const USAGE_EXAMPLE =
  'Exemple : pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags" --corpus=docs --format=prompt';

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const queryParts: string[] = [];
  let corpus: CorpusType = "all";
  let format: FormatType = "list";

  for (const arg of args) {
    if (!arg.startsWith("--")) {
      queryParts.push(arg);
      continue;
    }

    if (arg.startsWith("--corpus=")) {
      const rawCorpus = arg.slice("--corpus=".length);
      if (!CORPUS_VALUES.includes(rawCorpus as CorpusType)) {
        console.error(`Corpus inconnu : ${rawCorpus}`);
        console.error(`Valeurs autorisées : ${CORPUS_VALUES.join(", ")}`);
        process.exit(1);
      }
      corpus = rawCorpus as CorpusType;
      continue;
    }

    if (arg.startsWith("--format=")) {
      const rawFormat = arg.slice("--format=".length);
      if (!FORMAT_VALUES.includes(rawFormat as FormatType)) {
        console.error(`Format inconnu : ${rawFormat}`);
        console.error(`Valeurs autorisées : ${FORMAT_VALUES.join(", ")}`);
        process.exit(1);
      }
      format = rawFormat as FormatType;
      continue;
    }

    console.error(`Option inconnue : ${arg}`);
    console.error(USAGE);
    process.exit(1);
  }

  const query = queryParts.join(" ").trim();

  if (!query) {
    console.error(USAGE);
    console.error(USAGE_EXAMPLE);
    process.exit(1);
  }

  return { query, corpus, format };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isExcluded(relativePath: string, excludePatterns: readonly string[]): boolean {
  return excludePatterns.some(
    (pattern) => relativePath.includes(pattern) || relativePath === pattern
  );
}

function collectFiles(
  sourcePath: string,
  rootDir: string,
  excludePatterns: readonly string[],
  allowedExtensions: readonly string[]
): string[] {
  const absolute = path.resolve(rootDir, sourcePath);

  if (!fs.existsSync(absolute)) return [];

  const stat = fs.statSync(absolute);

  if (stat.isFile()) {
    const ext = path.extname(absolute);
    if (!allowedExtensions.includes(ext)) return [];
    return [absolute];
  }

  const results: string[] = [];

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relative = path.relative(rootDir, fullPath);

      if (isExcluded(relative, excludePatterns)) continue;

      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name);
        if (allowedExtensions.includes(ext)) {
          results.push(fullPath);
        }
      }
    }
  }

  walk(absolute);
  return results;
}

function extractHeadings(content: string): string {
  return content
    .split("\n")
    .filter((line) => /^#{1,6}\s/.test(line))
    .map((line) => line.replace(/^#{1,6}\s+/, ""))
    .join(" ");
}

function scoreFile(
  content: string,
  fileName: string,
  keywords: string[],
  priority: "high" | "medium"
): number {
  const contentLower = content.toLowerCase();
  const fileNameLower = path.basename(fileName, path.extname(fileName)).toLowerCase();
  const headings = extractHeadings(content).toLowerCase();

  let score = 0;
  const priorityMultiplier = priority === "high" ? 2.0 : 1.0;

  for (const keyword of keywords) {
    const escaped = escapeRegex(keyword);

    const contentMatches = (contentLower.match(new RegExp(escaped, "g")) ?? []).length;
    score += contentMatches;

    if (fileNameLower.includes(keyword)) score += 5;

    const headingMatches = (headings.match(new RegExp(escaped, "g")) ?? []).length;
    score += headingMatches * 3;
  }

  return score * priorityMultiplier;
}

function extractExcerpt(content: string, keywords: string[], maxLength: number): string {
  const contentLower = content.toLowerCase();

  // Collect all keyword occurrence positions across the full content
  const hitPositions: number[] = [];
  for (const keyword of keywords) {
    const re = new RegExp(escapeRegex(keyword), "g");
    let match: RegExpExecArray | null;
    while ((match = re.exec(contentLower)) !== null) {
      hitPositions.push(match.index);
    }
  }

  if (hitPositions.length === 0) {
    const end = Math.min(content.length, maxLength);
    const excerpt = content.slice(0, end).replace(/\n+/g, " ").trim();
    const suffix = end < content.length ? "…" : "";
    return excerpt + suffix;
  }

  // Candidate window starts: anchor ~80 chars before each hit, plus start-of-file
  const candidateStarts = [
    ...new Set<number>([0, ...hitPositions.map((pos) => Math.max(0, pos - 80))]),
  ].sort((a, b) => a - b);

  let bestStart = 0;
  let bestCount = -1;

  for (const start of candidateStarts) {
    const windowEnd = start + maxLength;
    let count = 0;
    for (const pos of hitPositions) {
      if (pos >= start && pos < windowEnd) count++;
    }
    // Update only on strictly greater count — tie-break: earliest start wins (ascending iteration)
    if (count > bestCount) {
      bestCount = count;
      bestStart = start;
    }
  }

  const end = Math.min(content.length, bestStart + maxLength);
  const excerpt = content.slice(bestStart, end).replace(/\n+/g, " ").trim();

  const prefix = bestStart > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + excerpt + suffix;
}

function filterSources(sources: readonly RagSource[], corpus: CorpusType): readonly RagSource[] {
  if (corpus === "all") return sources;
  return sources.filter((s) => s.corpus === corpus);
}

function search(query: string, corpus: CorpusType): SearchResult[] {
  const rootDir = process.cwd();
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((k) => k.length >= 2);

  if (keywords.length === 0) {
    console.error("La requête doit contenir au moins un mot-clé de 2 caractères minimum.");
    process.exit(1);
  }

  const activeSources = filterSources(ragConfig.sources, corpus);

  const filesByPriority = new Map<string, "high" | "medium">();

  for (const source of activeSources) {
    const files = collectFiles(
      source.path,
      rootDir,
      ragConfig.excludePatterns,
      ragConfig.allowedExtensions
    );
    for (const file of files) {
      if (!filesByPriority.has(file)) {
        filesByPriority.set(file, source.priority);
      }
    }
  }

  const results: SearchResult[] = [];

  for (const [filePath, priority] of filesByPriority) {
    let content: string;
    try {
      content = fs.readFileSync(filePath, "utf-8");
    } catch {
      continue;
    }

    const score = scoreFile(content, filePath, keywords, priority);
    if (score === 0) continue;

    const relativePath = path.relative(rootDir, filePath);
    const excerpt = extractExcerpt(content, keywords, ragConfig.maxExcerptLength);

    results.push({ filePath, relativePath, score, excerpt });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, ragConfig.maxResults);
}

function formatResultsList(results: SearchResult[], query: string, corpus: CorpusType): void {
  const corpusLabel = corpus === "all" ? "tous corpus" : `corpus:${corpus}`;

  if (results.length === 0) {
    console.log(`Aucun résultat pour : "${query}" [${corpusLabel}]`);
    return;
  }

  console.log(
    `\n── Résultats RAG Creatyss pour : "${query}" [${corpusLabel}] (${results.length} fichiers) ──\n`
  );

  for (const [i, result] of results.entries()) {
    console.log(`${i + 1}. ${result.relativePath}`);
    console.log(`   Score : ${result.score.toFixed(1)}`);
    console.log(`   Extrait : ${result.excerpt}`);
    console.log("");
  }
}

function formatResultsPrompt(results: SearchResult[], query: string, corpus: CorpusType): void {
  const corpusLabel = corpus === "all" ? "all (tous corpus)" : corpus;

  if (results.length === 0) {
    console.log(`# Contexte Creatyss récupéré

Requête :
"${query}"

Corpus :
${corpusLabel}

## Sources pertinentes

Aucun résultat pertinent trouvé.

## Rappel de doctrine

- Respecter AGENTS.md.
- Respecter docs/architecture/** pour la doctrine générale.
- Respecter docs/domains/** pour les domaines métier.
- Respecter Prisma comme source de vérité du modèle réel.
- Appliquer le plus petit changement fiable.
- Ne pas ajouter de dépendance inutile.
- Ne pas modifier Prisma ni les features métier si la demande ne le nécessite pas.`);
    return;
  }

  const sources = results
    .map(
      (result, index) => `### ${index + 1}. ${result.relativePath}
Score : ${result.score.toFixed(1)}

\`\`\`text
${result.excerpt}
\`\`\``
    )
    .join("\n\n");

  console.log(`# Contexte Creatyss récupéré

Requête :
"${query}"

Corpus :
${corpusLabel}

## Sources pertinentes

${sources}

## Rappel de doctrine

- Respecter AGENTS.md.
- Respecter docs/architecture/** pour la doctrine générale.
- Respecter docs/domains/** pour les domaines métier.
- Respecter Prisma comme source de vérité du modèle réel.
- Appliquer le plus petit changement fiable.
- Ne pas ajouter de dépendance inutile.
- Ne pas modifier Prisma ni les features métier si la demande ne le nécessite pas.`);
}

function formatResults(
  results: SearchResult[],
  query: string,
  corpus: CorpusType,
  format: FormatType
): void {
  if (format === "prompt") {
    formatResultsPrompt(results, query, corpus);
  } else {
    formatResultsList(results, query, corpus);
  }
}

// ─── Entrée principale ────────────────────────────────────────────────────────
// Doit être exécuté depuis la racine du projet :
//   pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code] [--format=list|prompt]

const { query, corpus, format } = parseArgs(process.argv);

const results = search(query, corpus);
formatResults(results, query, corpus, format);
