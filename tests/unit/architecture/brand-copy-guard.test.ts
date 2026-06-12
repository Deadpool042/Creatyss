import { readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Garde anti-régression clonabilité (Horizon 4 — R1).
 *
 * Les composants du socle storefront/homepage ne doivent porter aucun texte
 * de marque en dur : la marque vit dans `core/config/brand.ts` et les copy
 * de feature dans `features/<domaine>/config/*.config.ts`.
 *
 * Si ce test échoue : déplacer le texte vers la config concernée, ne pas
 * ajouter d'exception sans décision explicite.
 */

const ROOT = join(__dirname, "../../..");

/** Zones du socle déjà nettoyées (R1a/b/c) — périmètre du garde. */
const GUARDED_DIRECTORIES = [
  "features/storefront",
  "features/homepage",
  "components/storefront",
] as const;

/** Emplacements légitimes pour le copy de marque. */
const ALLOWED_PATH_SEGMENTS = ["/config/", "/data/"] as const;

/** Termes de marque interdits dans les composants du socle. */
const BRAND_TERMS = [
  /creatyss/i,
  /saint[-‑]étienne/i,
  /stéphanois/i,
  /sans cuir/i,
] as const;

function collectSourceFiles(directory: string): string[] {
  const entries = readdirSync(directory, { withFileTypes: true });

  return entries.flatMap((entry) => {
    const fullPath = join(directory, entry.name);

    if (entry.isDirectory()) {
      return collectSourceFiles(fullPath);
    }

    if (/\.(ts|tsx)$/.test(entry.name)) {
      return [fullPath];
    }

    return [];
  });
}

describe("brand copy guard", () => {
  it("ne contient aucun texte de marque en dur hors config/data", () => {
    const violations: string[] = [];

    for (const guardedDirectory of GUARDED_DIRECTORIES) {
      const files = collectSourceFiles(join(ROOT, guardedDirectory));

      for (const file of files) {
        const relativePath = relative(ROOT, file);

        if (ALLOWED_PATH_SEGMENTS.some((segment) => `/${relativePath}/`.includes(segment))) {
          continue;
        }

        const content = readFileSync(file, "utf8");
        const lines = content.split("\n");

        lines.forEach((line, index) => {
          for (const term of BRAND_TERMS) {
            if (term.test(line)) {
              violations.push(`${relativePath}:${index + 1} → ${line.trim().slice(0, 80)}`);
            }
          }
        });
      }
    }

    expect(violations, `Texte de marque en dur détecté :\n${violations.join("\n")}`).toEqual([]);
  });
});
