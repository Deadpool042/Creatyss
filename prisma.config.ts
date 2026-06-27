import "dotenv/config";
import dotenv from "dotenv";
import { defineConfig, env } from "prisma/config";

// Ne pas utiliser override : l'env Docker/prod injecté doit rester prioritaire.
// .env.local est chargé seulement s'il existe (usage local uniquement).
dotenv.config({ path: ".env.local" });

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
