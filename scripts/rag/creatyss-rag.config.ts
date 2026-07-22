export const CORPUS_VALUES = ["all", "docs", "prisma", "code"] as const;
export type CorpusType = (typeof CORPUS_VALUES)[number];

export const FORMAT_VALUES = ["list", "prompt"] as const;
export type FormatType = (typeof FORMAT_VALUES)[number];

export interface RagSource {
  readonly path: string;
  readonly priority: "high" | "medium";
  readonly description: string;
  readonly corpus: Exclude<CorpusType, "all">;
}

export interface RagConfig {
  readonly sources: readonly RagSource[];
  readonly excludePatterns: readonly string[];
  readonly allowedExtensions: readonly string[];
  readonly maxResults: number;
  readonly maxExcerptLength: number;
}

export const ragConfig: RagConfig = {
  sources: [
    {
      path: "AGENTS.md",
      priority: "high",
      description: "Doctrine canonique du repo",
      corpus: "docs",
    },
    {
      path: "docs/architecture",
      priority: "high",
      description: "Architecture système",
      corpus: "docs",
    },
    {
      path: "docs/domains",
      priority: "high",
      description: "Domaines métier",
      corpus: "docs",
    },
    {
      path: "docs/roadmap",
      priority: "high",
      description: "Roadmap projet",
      corpus: "docs",
    },
    {
      path: "docs/admin",
      priority: "high",
      description: "Documentation administration",
      corpus: "docs",
    },
    {
      path: "docs/lots",
      priority: "high",
      description: "Cadrages et bilans d'exécution des lots livrés",
      corpus: "docs",
    },
    {
      path: "docs/exploitation",
      priority: "high",
      description: "Documentation d'exploitation et de recette",
      corpus: "docs",
    },
    {
      path: "docs/audit",
      priority: "medium",
      description: "Audits ponctuels de cohérence documentaire",
      corpus: "docs",
    },
    {
      path: "docs/project-state",
      priority: "medium",
      description: "Photographies d'état du projet",
      corpus: "docs",
    },
    {
      path: "docs/testing",
      priority: "medium",
      description: "Stratégie et conventions de tests",
      corpus: "docs",
    },
    {
      path: "docs/ai",
      priority: "high",
      description: "Documentation IA locale",
      corpus: "docs",
    },
    {
      path: "prisma/schema.prisma",
      priority: "high",
      description: "Schéma Prisma principal",
      corpus: "prisma",
    },
    {
      path: "prisma/core",
      priority: "high",
      description: "Modèles Prisma core",
      corpus: "prisma",
    },
    {
      path: "prisma/optional",
      priority: "high",
      description: "Modèles Prisma optionnels",
      corpus: "prisma",
    },
    {
      path: "prisma/cross-cutting",
      priority: "high",
      description: "Modèles Prisma transverses",
      corpus: "prisma",
    },
    {
      path: "prisma/satellites",
      priority: "high",
      description: "Modèles Prisma satellites",
      corpus: "prisma",
    },
    {
      path: "features",
      priority: "medium",
      description: "Features métier",
      corpus: "code",
    },
  ],
  excludePatterns: [
    "node_modules",
    ".git",
    ".next",
    "coverage",
    "public/uploads",
    "logs",
    "dist",
    "__MACOSX",
    ".DS_Store",
  ],
  allowedExtensions: [".md", ".prisma", ".ts", ".tsx"],
  maxResults: 10,
  maxExcerptLength: 300,
};
