import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";

// @typescript-eslint/eslint-plugin est une peer dep de eslint-config-next.
// On l'extrait depuis la config déjà chargée pour éviter un import direct
// qui échouerait selon la résolution pnpm.
const tsPlugin = nextVitals.find((c) => c.plugins?.["@typescript-eslint"])?.plugins[
  "@typescript-eslint"
];

const appPatterns = ["@/app", "@/app/**"];
const componentsPatterns = ["@/components", "@/components/**"];
const dbPatterns = ["@/db", "@/db/**", "@/core/db"];
const productsUiPatterns = ["@/features/admin/products/components/**"];
const productsServerPatterns = ["@/features/admin/products/server"];
const productsEditorActionPatterns = ["@/features/admin/products/editor/actions/**"];
const productsEditorQueryPatterns = ["@/features/admin/products/editor/queries/**"];
const productsEditorMapperPatterns = ["@/features/admin/products/editor/mappers/**"];
const productsListQueryPatterns = ["@/features/admin/products/list/queries/**"];
const productsListServerMapperPatterns = ["@/features/admin/products/list/mappers/server/**"];

export default defineConfig([
  ...nextVitals,

  {
    settings: {
      react: { version: "19" },
    },
    linterOptions: {
      reportUnusedDisableDirectives: "error",
    },
  },

  {
    files: ["**/*.{ts,tsx,js,mjs}"],
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-duplicate-imports": "error",
      "object-shorthand": "error",
      "prefer-const": "error",
      "react/no-unescaped-entities": "off",
      eqeqeq: ["error", "always", { null: "ignore" }],
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message:
            "Utiliser des exports nommés explicites au lieu de `export *` pour garder des façades stables et lisibles.",
        },
      ],
    },
  },

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

  {
    files: ["entities/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: appPatterns,
              message: "entities/ ne doit pas importer depuis app/",
            },
            {
              group: componentsPatterns,
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

  {
    files: ["db/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: componentsPatterns,
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

  {
    files: ["features/**/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: dbPatterns,
              message:
                "Les composants feature ne doivent pas importer directement depuis db/ — passer par les actions, props ou types publics.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["components/admin/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: dbPatterns,
              message:
                "components/admin/ ne doit pas importer directement depuis db/ — passer par les hubs de types features/admin/**/types/",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/**/mappers/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: dbPatterns,
              message:
                "Les mappers feature ne doivent pas importer directement depuis db/ — passer par les hubs de types features/**/types/ ou le client généré si nécessaire.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/**/schemas/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: componentsPatterns,
              message: "Les schemas ne doivent pas importer depuis components/",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: appPatterns,
              message:
                "features/admin/products ne doit pas importer depuis app/ — passer par les props, actions ou façades publiques.",
            },
            {
              group: [
                "@/features/admin/orders",
                "@/features/admin/orders/**",
                "@/features/admin/customers",
                "@/features/admin/customers/**",
                "@/features/admin/blog",
                "@/features/admin/blog/**",
              ],
              message:
                "features/admin/products ne doit pas dépendre directement d’un autre sous-module admin. Passer par une façade publique dédiée si nécessaire.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/components/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: dbPatterns,
              message: "Les composants products ne doivent pas accéder directement à la base.",
            },
            {
              group: [
                ...productsServerPatterns,
                "@/features/admin/products/create/actions/**",
                "@/features/admin/products/details/mappers/**",
                "@/features/admin/products/details/queries/**",
                ...productsEditorActionPatterns,
                ...productsEditorMapperPatterns,
                ...productsEditorQueryPatterns,
                ...productsListQueryPatterns,
                ...productsListServerMapperPatterns,
              ],
              message:
                "Les composants products doivent importer via les façades publiques, les props, ou les mappers shared explicitement client-safe.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/editor/actions/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: componentsPatterns,
              message: "Les actions products ne doivent pas importer de composants UI.",
            },
            {
              group: [
                "@/features/admin/products/components/**",
                "@/features/admin/products/create/**",
                "@/features/admin/products/details/**",
                "@/features/admin/products/list/**",
              ],
              message:
                "Les actions editor/products ne doivent pas dépendre des couches UI ou lecture hors périmètre.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/editor/queries/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: componentsPatterns,
              message: "Les queries products ne doivent pas importer de composants.",
            },
            {
              group: ["@/features/admin/products/components/**", ...productsEditorActionPatterns],
              message:
                "Les queries products ne doivent pas dépendre des composants ni des actions.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/editor/mappers/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                ...componentsPatterns,
                ...productsUiPatterns,
                ...productsEditorActionPatterns,
                ...productsEditorQueryPatterns,
              ],
              message:
                "Les mappers products doivent rester purs et indépendants de l’UI, des actions et des queries.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/list/mappers/shared/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                ...dbPatterns,
                ...productsServerPatterns,
                ...productsListQueryPatterns,
                ...productsListServerMapperPatterns,
                ...productsEditorActionPatterns,
                ...productsEditorQueryPatterns,
              ],
              message:
                "Les mappers shared de products doivent rester client-safe et ne pas dépendre des couches serveur.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/list/mappers/server/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [...componentsPatterns, ...productsUiPatterns],
              message: "Les mappers server de products ne doivent pas dépendre de l’UI.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/**/types/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                ...componentsPatterns,
                ...dbPatterns,
                ...productsUiPatterns,
                "@/features/admin/products/**/actions/**",
                "@/features/admin/products/**/queries/**",
                "@/features/admin/products/**/mappers/**",
              ],
              message:
                "Les fichiers de types products doivent rester déclaratifs et sans dépendance runtime métier/UI.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/**/schemas/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                ...componentsPatterns,
                ...dbPatterns,
                ...productsUiPatterns,
                "@/features/admin/products/**/actions/**",
                "@/features/admin/products/**/queries/**",
                "@/features/admin/products/**/mappers/**",
              ],
              message: "Les schémas products doivent rester purs : validation seulement.",
            },
          ],
        },
      ],
    },
  },

  {
    files: [
      "features/admin/products/index.ts",
      "features/admin/products/list/index.ts",
      "features/admin/products/details/index.ts",
      "features/admin/products/editor/public/index.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: [
                "@/features/admin/products/server",
                "./server",
                "./list/queries",
                "./list/queries/**",
                "./list/actions",
                "./list/actions/**",
                "./list/mappers/server",
                "./list/mappers/server/**",
                "./details/queries",
                "./details/queries/**",
                "./editor/actions",
                "./editor/actions/**",
                "./editor/queries",
                "./editor/queries/**",
                "./editor/mappers",
                "./editor/mappers/**",
              ],
              message:
                "Les façades publiques doivent rester public-safe. Déplacer les exports serveur dans server.ts.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/server.ts"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["./components", "./components/**", ...componentsPatterns],
              message: "features/admin/products/server.ts ne doit pas dépendre des composants UI.",
            },
          ],
        },
      ],
    },
  },

  {
    files: ["features/admin/products/**/index.ts"],
    rules: {
      "no-restricted-syntax": [
        "error",
        {
          selector: "ExportAllDeclaration",
          message:
            "Les index.ts de products doivent utiliser des exports explicites, jamais `export *`.",
        },
      ],
    },
  },

  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "coverage/**",
    "dist/**",
    "node_modules/**",
    "public/**",
    ".trash/**",
    "src/generated/**",
    "prisma-generated/**",
  ]),
]);
