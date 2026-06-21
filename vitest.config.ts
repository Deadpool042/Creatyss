import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

const rootDirectory = fileURLToPath(new URL("./", import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "@": rootDirectory,
      // "server-only" est un package Next.js qui protège les imports côté serveur.
      // En environnement Vitest (Node pur), on le stubbed avec un module vide.
      "server-only": `${rootDirectory}tests/unit/__stubs__/server-only.ts`,
    },
  },
  test: {
    environment: "node",
    include: ["tests/unit/**/*.test.ts"],
    passWithNoTests: true,
  },
});
