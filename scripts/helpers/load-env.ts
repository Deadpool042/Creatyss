import nextEnv from "@next/env";

const { loadEnvConfig } = nextEnv;

/**
 * Charge les variables d'environnement (.env*) avant que des modules
 * dépendant de `serverEnv` / `db` ne soient évalués. À importer en premier
 * (effet de bord) dans tout script qui réutilise des services applicatifs.
 */
loadEnvConfig(process.cwd());
