import * as fs from "node:fs";
import * as path from "node:path";

import { ragConfig } from "./creatyss-rag.config";

/**
 * Le RAG Creatyss (`search_context`) scanne les fichiers en direct sur disque
 * à chaque requête — il n'y a pas d'index persistant à reconstruire. La seule
 * dette possible est une désynchronisation entre l'arborescence réelle de
 * `docs/` et `ragConfig.sources` : un nouveau dossier top-level sous `docs/`
 * qui n'apparaît dans aucune source reste invisible du RAG jusqu'à ce que
 * quelqu'un pense à l'ajouter manuellement (cf. `docs/lots` oublié à sa
 * création — corrigé le 2026-07-22).
 *
 * Ce script détecte cet oubli : tout dossier top-level sous `docs/` qui n'est
 * couvert par aucune entrée `ragConfig.sources` fait échouer la vérification.
 */

const ROOT_DIR = process.cwd();
const DOCS_DIR = path.join(ROOT_DIR, "docs");

function listTopLevelDirs(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];

  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();
}

function isCovered(docsRelativePath: string): boolean {
  return ragConfig.sources.some((source) => {
    const normalizedSourcePath = source.path.replace(/\/+$/, "");
    return (
      normalizedSourcePath === docsRelativePath ||
      normalizedSourcePath.startsWith(`${docsRelativePath}/`)
    );
  });
}

function main(): void {
  const topLevelDirNames = listTopLevelDirs(DOCS_DIR);
  const uncovered = topLevelDirNames
    .map((name) => `docs/${name}`)
    .filter((relativePath) => !isCovered(relativePath));

  if (uncovered.length === 0) {
    console.log(`[rag:check-sources] OK — ${topLevelDirNames.length} dossiers docs/* couverts.`);
    return;
  }

  console.error("[rag:check-sources] Dossiers docs/* non couverts par ragConfig.sources :");
  for (const dir of uncovered) {
    console.error(`  - ${dir}`);
  }
  console.error(
    '\nAjoute une entrée dans scripts/rag/creatyss-rag.config.ts (corpus "docs") pour chacun,\n' +
      "sinon le RAG ne trouvera jamais ce contenu via search_context."
  );
  process.exit(1);
}

main();
