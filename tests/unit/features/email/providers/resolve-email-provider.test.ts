import { describe, expect, it, vi } from "vitest";

vi.mock("@/core/config/env/server", () => ({
  serverEnv: {
    brevoApiKey: "test-key",
    brevoFromAddress: "no-reply@test.local",
    brevoFromName: "Test",
    emailFromAddress: "no-reply@test.local",
    emailFromName: "Test",
    mailpitSmtpHost: "localhost",
    mailpitSmtpPort: 1025,
  },
}));

import { BrevoEmailProvider } from "@/features/email/providers/brevo-email-provider";
import { MailpitEmailProvider } from "@/features/email/providers/mailpit-email-provider";
import { resolveEmailProvider } from "@/features/email/providers/resolve-email-provider";
import { SimulatedEmailProvider } from "@/features/email/providers/simulated-email-provider";
import type {
  ExecutionPolicy,
  RuntimeEnvironment,
  StoreOperationMode,
} from "@/core/runtime/execution-policy.types";

const ENVIRONMENTS: RuntimeEnvironment[] = ["local", "staging", "production"];
const STORE_MODES: StoreOperationMode[] = ["development", "production"];

function buildPolicy(
  environment: RuntimeEnvironment,
  storeMode: StoreOperationMode
): ExecutionPolicy {
  const mode = environment === "production" && storeMode === "production" ? "LIVE" : "TEST";
  return { mode, environment, storeMode, reason: "test" };
}

describe("resolveEmailProvider", () => {
  it("sélectionne Brevo uniquement en mode LIVE (environment=production, storeMode=production)", () => {
    const { kind, provider } = resolveEmailProvider(buildPolicy("production", "production"));

    expect(kind).toBe("brevo");
    expect(provider).toBeInstanceOf(BrevoEmailProvider);
  });

  it("sélectionne Mailpit en TEST local", () => {
    const { kind, provider } = resolveEmailProvider(buildPolicy("local", "development"));

    expect(kind).toBe("mailpit");
    expect(provider).toBeInstanceOf(MailpitEmailProvider);
  });

  it("sélectionne Mailpit en local même si storeMode=production (le double verrou reste requis pour LIVE)", () => {
    const { kind } = resolveEmailProvider(buildPolicy("local", "production"));

    expect(kind).toBe("mailpit");
  });

  it("sélectionne le provider simulé en TEST staging", () => {
    const { kind, provider } = resolveEmailProvider(buildPolicy("staging", "development"));

    expect(kind).toBe("simulated");
    expect(provider).toBeInstanceOf(SimulatedEmailProvider);
  });

  it("sélectionne le provider simulé en staging même si storeMode=production", () => {
    const { kind } = resolveEmailProvider(buildPolicy("staging", "production"));

    expect(kind).toBe("simulated");
  });

  it("sélectionne le provider simulé en environment=production hors LIVE (storeMode=development)", () => {
    const { kind } = resolveEmailProvider(buildPolicy("production", "development"));

    expect(kind).toBe("simulated");
  });

  it("n'utilise jamais Brevo hors LIVE, sur les six combinaisons environnement × mode boutique", () => {
    for (const environment of ENVIRONMENTS) {
      for (const storeMode of STORE_MODES) {
        const policy = buildPolicy(environment, storeMode);
        const { kind } = resolveEmailProvider(policy);

        if (policy.mode !== "LIVE") {
          expect(kind).not.toBe("brevo");
        } else {
          expect(kind).toBe("brevo");
        }
      }
    }
  });
});
