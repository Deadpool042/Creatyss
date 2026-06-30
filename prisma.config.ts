import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Priorité (jamais d'override) : env réel injecté (Docker/prod) > .env.local > .env.
// dotenv n'écrase pas une variable déjà définie : charger .env.local AVANT .env le
// fait gagner sur .env en local natif, tout en laissant l'env Docker/prod prioritaire.
dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

export default defineConfig({
  schema: "prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx ./prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
