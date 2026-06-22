import * as fs from "node:fs";
import * as path from "node:path";

import { ragConfig, type CorpusType, type FormatType, type RagSource } from "./creatyss-rag.config";

export interface SearchResult {
  filePath: string;
  relativePath: string;
  score: number;
  excerpt: string;
}

// ─── Helpers internes ─────────────────────────────────────────────────────────

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

function buildResultsList(results: SearchResult[], query: string, corpus: CorpusType): string {
  const corpusLabel = corpus === "all" ? "tous corpus" : `corpus:${corpus}`;

  if (results.length === 0) {
    return `Aucun résultat pour : "${query}" [${corpusLabel}]`;
  }

  const lines: string[] = [
    `\n── Résultats RAG Creatyss pour : "${query}" [${corpusLabel}] (${results.length} fichiers) ──\n`,
  ];

  for (const [i, result] of results.entries()) {
    lines.push(`${i + 1}. ${result.relativePath}`);
    lines.push(`   Score : ${result.score.toFixed(1)}`);
    lines.push(`   Extrait : ${result.excerpt}`);
    lines.push("");
  }

  return lines.join("\n");
}

function buildResultsPrompt(results: SearchResult[], query: string, corpus: CorpusType): string {
  const corpusLabel = corpus === "all" ? "all (tous corpus)" : corpus;

  const DOCTRINE = `## Rappel de doctrine

- Respecter AGENTS.md.
- Respecter docs/architecture/** pour la doctrine générale.
- Respecter docs/domains/** pour les domaines métier.
- Respecter Prisma comme source de vérité du modèle réel.
- Appliquer le plus petit changement fiable.
- Ne pas ajouter de dépendance inutile.
- Ne pas modifier Prisma ni les features métier si la demande ne le nécessite pas.`;

  if (results.length === 0) {
    return `# Contexte Creatyss récupéré

Requête :
"${query}"

Corpus :
${corpusLabel}

## Sources pertinentes

Aucun résultat pertinent trouvé.

${DOCTRINE}`;
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

  return `# Contexte Creatyss récupéré

Requête :
"${query}"

Corpus :
${corpusLabel}

## Sources pertinentes

${sources}

${DOCTRINE}`;
}

// ─── API publique ─────────────────────────────────────────────────────────────

export function searchCreatyssContext(params: {
  query: string;
  corpus: CorpusType;
}): SearchResult[] {
  const { query, corpus } = params;
  const rootDir = process.cwd();

  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((k) => k.length >= 2);

  if (keywords.length === 0) return [];

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

export function buildCreatyssContextOutput(params: {
  results: SearchResult[];
  query: string;
  corpus: CorpusType;
  format: FormatType;
}): string {
  const { results, query, corpus, format } = params;
  if (format === "prompt") {
    return buildResultsPrompt(results, query, corpus);
  }
  return buildResultsList(results, query, corpus);
}
