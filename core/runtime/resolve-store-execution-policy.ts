//core/runtime/resolve-store-execution-policy.ts
import { serverEnv } from "@/core/config/env/server";

import { resolveExecutionPolicy } from "./resolve-execution-policy";
import type { ExecutionPolicy, StoreOperationMode } from "./execution-policy.types";

type ResolveStoreExecutionPolicyInput = {
  isProduction: boolean;
};

function toStoreOperationMode(isProduction: boolean): StoreOperationMode {
  return isProduction ? "production" : "development";
}

/**
 * Point de composition unique entre l'environnement technique
 * (APP_RUNTIME_ENV) et le mode opérationnel de la boutique
 * (Store.isProduction). Tout adaptateur d'effet externe doit passer par
 * cette fonction plutôt que de recalculer la policy lui-même — cf.
 * docs/domains/cross-cutting/execution-policy.md, "Impact de maintenance".
 *
 * N'accède pas à Prisma : reçoit isProduction déjà lu par l'appelant.
 */
export function resolveStoreExecutionPolicy(
  input: ResolveStoreExecutionPolicyInput
): ExecutionPolicy {
  return resolveExecutionPolicy({
    environment: serverEnv.appRuntimeEnv,
    storeMode: toStoreOperationMode(input.isProduction),
  });
}
