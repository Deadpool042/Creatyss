import * as fs from "node:fs";
import * as path from "node:path";

import {
  CORPUS_VALUES,
  FORMAT_VALUES,
  type CorpusType,
  type FormatType,
} from "./creatyss-rag.config";
import { buildCreatyssContextOutput, searchCreatyssContext } from "./rag-search";

interface ParsedArgs {
  query: string;
  corpus: CorpusType;
  format: FormatType;
  outputPath: string | null;
}

const USAGE =
  'Usage : pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code] [--format=list|prompt] [--output=<chemin>]';
const USAGE_EXAMPLE =
  'Exemple : pnpm tsx scripts/rag/search-creatyss-context.ts "feature flags" --corpus=docs --format=prompt --output=tmp/rag-context.md';

function parseArgs(argv: string[]): ParsedArgs {
  const args = argv.slice(2);
  const queryParts: string[] = [];
  let corpus: CorpusType = "all";
  let format: FormatType = "list";
  let outputPath: string | null = null;

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

    if (arg === "--output") {
      console.error("Option --output requiert une valeur : --output=<chemin>");
      console.error(USAGE);
      process.exit(1);
    }

    if (arg.startsWith("--output=")) {
      const rawOutput = arg.slice("--output=".length);

      if (!rawOutput) {
        console.error("Chemin de sortie vide : --output=<chemin>");
        process.exit(1);
      }

      if (path.isAbsolute(rawOutput)) {
        console.error(`Chemin absolu refusé : ${rawOutput}`);
        console.error("Utiliser un chemin relatif depuis la racine du projet.");
        process.exit(1);
      }

      const rootDir = process.cwd();
      const resolved = path.resolve(rootDir, rawOutput);
      if (!resolved.startsWith(rootDir + path.sep)) {
        console.error(`Chemin invalide : le fichier de sortie doit rester dans le projet.`);
        console.error(`Chemin refusé : ${rawOutput}`);
        process.exit(1);
      }

      outputPath = resolved;
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

  return { query, corpus, format, outputPath };
}

// ─── Entrée principale ────────────────────────────────────────────────────────
// Doit être exécuté depuis la racine du projet :
//   pnpm tsx scripts/rag/search-creatyss-context.ts "<requête>" [--corpus=all|docs|prisma|code] [--format=list|prompt] [--output=<chemin>]

const { query, corpus, format, outputPath } = parseArgs(process.argv);

const results = searchCreatyssContext({ query, corpus });
const output = buildCreatyssContextOutput({ results, query, corpus, format });

if (outputPath !== null) {
  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, output, "utf-8");
  const relativePath = path.relative(process.cwd(), outputPath);
  console.log(`Fichier écrit : ${relativePath}`);
} else {
  console.log(output);
}
