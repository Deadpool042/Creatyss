import * as fs from "node:fs";
import * as path from "node:path";

import { ragConfig } from "./creatyss-rag.config";

interface SearchResult {
  filePath: string;
  relativePath: string;
  score: number;
  excerpt: string;
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

  let bestPos = -1;
  for (const keyword of keywords) {
    const pos = contentLower.indexOf(keyword);
    if (pos !== -1 && (bestPos === -1 || pos < bestPos)) {
      bestPos = pos;
    }
  }

  const start = bestPos === -1 ? 0 : Math.max(0, bestPos - 80);
  const end = Math.min(content.length, start + maxLength);
  const excerpt = content.slice(start, end).replace(/\n+/g, " ").trim();

  const prefix = start > 0 ? "…" : "";
  const suffix = end < content.length ? "…" : "";
  return prefix + excerpt + suffix;
}

function search(query: string): SearchResult[] {
  const rootDir = process.cwd();
  const keywords = query
    .toLowerCase()
    .split(/\s+/)
    .filter((k) => k.length >= 2);

  if (keywords.length === 0) {
    console.error("La requête doit contenir au moins un mot-clé de 2 caractères minimum.");
    process.exit(1);
  }

  // Première source trouvée détermine la priorité (sources triées par priorité décroissante)
  const filesByPriority = new Map<string, "high" | "medium">();

  for (const source of ragConfig.sources) {
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

function formatResults(results: SearchResult[], query: string): void {
  if (results.length === 0) {
    console.log(`Aucun résultat pour : "${query}"`);
    return;
  }

  console.log(`\n── Résultats RAG Creatyss pour : "${query}" (${results.length} fichiers) ──\n`);

  for (const [i, result] of results.entries()) {
    console.log(`${i + 1}. ${result.relativePath}`);
    console.log(`   Score : ${result.score.toFixed(1)}`);
    console.log(`   Extrait : ${result.excerpt}`);
    console.log("");
  }
}

// ─── Entrée principale ────────────────────────────────────────────────────────
// Doit être exécuté depuis la racine du projet :
//   pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>"

const query = process.argv.slice(2).join(" ").trim();

if (!query) {
  console.error('Usage : pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>"');
  console.error('Exemple : pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags"');
  process.exit(1);
}

const results = search(query);
formatResults(results, query);
