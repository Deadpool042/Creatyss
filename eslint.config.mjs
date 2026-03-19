import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// @typescript-eslint/eslint-plugin est une peer dep de eslint-config-next.
// On l'extrait depuis la config déjà chargée pour éviter un import direct
// qui échouerait selon la résolution pnpm.
const tsPlugin = nextVitals.find((c) => c.plugins?.["@typescript-eslint"])?.plugins[
  "@typescript-eslint"
];

export default defineConfig([
  ...nextVitals,

  // ─── Paramètres globaux ──────────────────────────────────────────────────
  {
    settings: {
      react: { version: "19" },
    },
  },

  // ─── Règles générales ────────────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "react/no-unescaped-entities": "off", // On autorise les apostrophes non échappées dans le JSX
      eqeqeq: ["error", "always", { null: "ignore" }],
    },
  },

  // ─── Règles TypeScript ───────────────────────────────────────────────────
  {
    files: ["**/*.{ts,tsx}"],
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "inline-type-imports",
        },
      ],
    },
  },

  // ─── Accessibilité (a11y) ────────────────────────────────────────────────
  // Règles de base WCAG / JSX A11y sans sur-configuration
  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: {
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/anchor-is-valid": "error",
      "jsx-a11y/no-autofocus": "warn",
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
    },
  },

  // ─── Architecture : entities/ ────────────────────────────────────────────
  // entities/ = logique métier pure — pas d'import depuis la couche applicative
  {
    files: ["entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app", "@/app/**"],
              message: "entities/ ne doit pas importer depuis app/",
            },
            {
              group: ["@/components", "@/components/**"],
              message: "entities/ ne doit pas importer depuis components/",
            },
            {
              group: ["@/features", "@/features/**"],
              message: "entities/ ne doit pas importer depuis features/",
            },
          ],
        },
      ],
    },
  },

  // ─── Architecture : db/ ──────────────────────────────────────────────────
  // db/ = couche data — pas d'import depuis la couche UI ou features
  {
    files: ["db/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components", "@/components/**"],
              message: "db/ ne doit pas importer depuis components/",
            },
            {
              group: ["@/features", "@/features/**"],
              message: "db/ ne doit pas importer depuis features/",
            },
          ],
        },
      ],
    },
  },

  // ─── Architecture : features/**/components/ ──────────────────────────────
  // Les composants feature n'accèdent pas directement à la couche db/
  {
    files: ["features/**/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/db", "@/db/**"],
              message:
                "Les composants feature ne doivent pas importer directement depuis db/ — passer par les actions ou les types publics du repository",
            },
          ],
        },
      ],
    },
  },

  // ─── Architecture : components/admin/ ───────────────────────────────────
  // Les composants admin partagés n'accèdent pas directement à la couche db/
  // — passer par les hubs de types features/admin/**/types/
  {
    files: ["components/admin/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/db", "@/db/**"],
              message:
                "components/admin/ ne doit pas importer directement depuis db/ — passer par les hubs de types features/admin/**/types/",
            },
          ],
        },
      ],
    },
  },

  // ─── Architecture : features/**/mappers/ ─────────────────────────────────
  // Les mappers feature n'accèdent pas directement à la couche db/
  // — passer par les hubs de types features/**/types/
  {
    files: ["features/**/mappers/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/db", "@/db/**"],
              message:
                "Les mappers feature ne doivent pas importer directement depuis db/ — passer par les hubs de types features/**/types/",
            },
          ],
        },
      ],
    },
  },

  // ─── Architecture : features/**/schemas/ ─────────────────────────────────
  // Les schémas Zod restent purs — pas de dépendance UI
  {
    files: ["features/**/schemas/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/components", "@/components/**"],
              message: "Les schemas ne doivent pas importer depuis components/",
            },
          ],
        },
      ],
    },
  },

  // ─── Ignores ─────────────────────────────────────────────────────────────
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
