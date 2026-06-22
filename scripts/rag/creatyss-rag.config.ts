export interface RagSource {
  readonly path: string;
  readonly priority: "high" | "medium";
  readonly description: string;
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
    },
    {
      path: "docs/architecture",
      priority: "high",
      description: "Architecture système",
    },
    {
      path: "docs/domains",
      priority: "high",
      description: "Domaines métier",
    },
    {
      path: "docs/roadmap",
      priority: "high",
      description: "Roadmap projet",
    },
    {
      path: "docs/admin",
      priority: "high",
      description: "Documentation administration",
    },
    {
      path: "docs/ai",
      priority: "high",
      description: "Documentation IA locale",
    },
    {
      path: "prisma/schema.prisma",
      priority: "high",
      description: "Schéma Prisma principal",
    },
    {
      path: "prisma/core",
      priority: "high",
      description: "Modèles Prisma core",
    },
    {
      path: "prisma/optional",
      priority: "high",
      description: "Modèles Prisma optionnels",
    },
    {
      path: "prisma/cross-cutting",
      priority: "high",
      description: "Modèles Prisma transverses",
    },
    {
      path: "prisma/satellites",
      priority: "high",
      description: "Modèles Prisma satellites",
    },
    {
      path: "features",
      priority: "medium",
      description: "Features métier",
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
