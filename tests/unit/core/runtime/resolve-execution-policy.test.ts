import { describe, expect, it } from "vitest";

import { resolveExecutionPolicy } from "@/core/runtime/resolve-execution-policy";
import type { RuntimeEnvironment, StoreOperationMode } from "@/core/runtime/execution-policy.types";

const ENVIRONMENTS: RuntimeEnvironment[] = ["local", "staging", "production"];
const STORE_MODES: StoreOperationMode[] = ["development", "production"];

describe("resolveExecutionPolicy", () => {
  it("résout LIVE uniquement quand environment=production et storeMode=production", () => {
    const policy = resolveExecutionPolicy({
      environment: "production",
      storeMode: "production",
    });

    expect(policy).toEqual({
      mode: "LIVE",
      environment: "production",
      storeMode: "production",
      reason: "environment=production, storeMode=production",
    });
  });

  it.each(
    ENVIRONMENTS.flatMap((environment) =>
      STORE_MODES.map((storeMode) => ({ environment, storeMode }))
    ).filter(
      ({ environment, storeMode }) => !(environment === "production" && storeMode === "production")
    )
  )(
    "résout TEST pour environment=$environment, storeMode=$storeMode",
    ({ environment, storeMode }) => {
      const policy = resolveExecutionPolicy({ environment, storeMode });

      expect(policy.mode).toBe("TEST");
      expect(policy.environment).toBe(environment);
      expect(policy.storeMode).toBe(storeMode);
      expect(policy.reason).toBe(`environment=${environment}, storeMode=${storeMode}`);
    }
  );

  it("est une fonction pure : mêmes entrées, même sortie", () => {
    const input = { environment: "staging", storeMode: "development" } as const;

    expect(resolveExecutionPolicy(input)).toEqual(resolveExecutionPolicy(input));
  });
});
