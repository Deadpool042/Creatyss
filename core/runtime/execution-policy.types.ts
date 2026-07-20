//core/runtime/execution-policy.types.ts

/**
 * Environnement technique de déploiement. Immuable au runtime, lu depuis
 * APP_RUNTIME_ENV. Distinct de NODE_ENV : staging tourne en NODE_ENV=production
 * mais doit rester en environnement technique "staging".
 */
export type RuntimeEnvironment = "local" | "staging" | "production";

/**
 * Mode opérationnel de la boutique, dérivé de Store.isProduction.
 */
export type StoreOperationMode = "development" | "production";

/**
 * Mode d'exécution résolu pour un effet externe donné.
 * LIVE exige la conjonction stricte des deux verrous.
 */
export type ExecutionMode = "TEST" | "LIVE";

/**
 * Nature d'un effet externe gouverné par la politique d'exécution.
 * Extensible : ajouter une valeur ici n'impose aucune modification du
 * résolveur ni des types existants.
 */
export type ExternalEffectKind =
  | "email"
  | "webhook"
  | "payment"
  | "social"
  | "notification"
  | "external-api";

/**
 * Résultat de la résolution de politique d'exécution.
 */
export type ExecutionPolicy = {
  mode: ExecutionMode;
  environment: RuntimeEnvironment;
  storeMode: StoreOperationMode;
  reason: string;
};
