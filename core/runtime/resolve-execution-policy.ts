//core/runtime/resolve-execution-policy.ts
import type {
  ExecutionPolicy,
  RuntimeEnvironment,
  StoreOperationMode,
} from "./execution-policy.types";

type ResolveExecutionPolicyInput = {
  environment: RuntimeEnvironment;
  storeMode: StoreOperationMode;
};

/**
 * Résolveur pur de la politique d'exécution des effets externes.
 *
 * LIVE est atteint uniquement quand l'environnement technique est
 * "production" ET que la boutique est en mode "production". Toute autre
 * combinaison résout en TEST — y compris toute valeur d'environnement
 * inattendue, par défaut fail-safe.
 *
 * Aucun accès réseau, base de données ou variable d'environnement ici :
 * les entrées sont fournies par l'appelant.
 */
export function resolveExecutionPolicy(input: ResolveExecutionPolicyInput): ExecutionPolicy {
  const { environment, storeMode } = input;

  if (environment === "production" && storeMode === "production") {
    return {
      mode: "LIVE",
      environment,
      storeMode,
      reason: "environment=production, storeMode=production",
    };
  }

  return {
    mode: "TEST",
    environment,
    storeMode,
    reason: `environment=${environment}, storeMode=${storeMode}`,
  };
}
