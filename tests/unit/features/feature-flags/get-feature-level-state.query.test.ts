import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/core/db", () => ({
  db: {
    featureFlag: {
      findMany: vi.fn(),
    },
  },
}));

vi.mock("@/features/admin/store/queries/get-current-store-id.query", () => ({
  getCurrentStoreId: vi.fn(),
}));

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";
import {
  getFeatureLevelState,
  meetsFeatureLevel,
} from "@/features/feature-flags/queries/get-feature-level-state.query";

const mockDb = db as unknown as {
  featureFlag: {
    findMany: ReturnType<typeof vi.fn>;
  };
};

const mockGetCurrentStoreId = getCurrentStoreId as ReturnType<typeof vi.fn>;

const LEVELS = ["basic", "assistant", "advanced", "automation"] as const;

type MockOverride = {
  scopeType: string;
  scopeId: string;
  isEnabled: boolean;
  level?: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  archivedAt: Date | null;
};

type MockFlag = {
  status: string;
  isEnabledByDefault: boolean;
  allowedLevels: readonly string[];
  defaultLevel: string | null;
  storeId: string | null;
  overrides: MockOverride[];
};

function makeFlag(overrides: Partial<MockFlag> = {}): MockFlag {
  return {
    status: "ACTIVE",
    isEnabledByDefault: true,
    allowedLevels: LEVELS,
    defaultLevel: "basic",
    storeId: null,
    overrides: [],
    ...overrides,
  };
}

function makeOverride(overrides: Partial<MockOverride> = {}): MockOverride {
  return {
    scopeType: "STORE",
    scopeId: "store_1",
    isEnabled: true,
    level: "advanced",
    startsAt: null,
    endsAt: null,
    archivedAt: null,
    ...overrides,
  };
}

describe("getFeatureLevelState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne l'état inactif si aucun FeatureFlag n'est trouvé pour le code", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([]);

    await expect(getFeatureLevelState("some.feature")).resolves.toEqual({
      isActive: false,
      allowedLevels: [],
      activeLevel: null,
    });
  });

  it("résout le niveau par défaut pour un flag global actif sans override", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([makeFlag({ storeId: null, overrides: [] })]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: true,
      allowedLevels: LEVELS,
      activeLevel: "basic",
    });
  });

  it("fait primer le niveau de l'override STORE actif sur le defaultLevel", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({
        storeId: null,
        overrides: [makeOverride({ isEnabled: true, level: "advanced" })],
      }),
    ]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: true,
      allowedLevels: LEVELS,
      activeLevel: "advanced",
    });
  });

  it("désactive la feature si l'override STORE actif a isEnabled: false, même si le flag global est ACTIVE", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({
        storeId: null,
        status: "ACTIVE",
        isEnabledByDefault: true,
        overrides: [makeOverride({ isEnabled: false })],
      }),
    ]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: false,
      allowedLevels: LEVELS,
      activeLevel: null,
    });
  });

  it("ignore un override archivé et retombe sur le flag", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({
        storeId: null,
        overrides: [
          makeOverride({ isEnabled: false, archivedAt: new Date("2026-01-01T00:00:00.000Z") }),
        ],
      }),
    ]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: true,
      allowedLevels: LEVELS,
      activeLevel: "basic",
    });
  });

  it("ignore un override dont la fenêtre temporelle n'a pas encore commencé", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    const future = new Date(Date.now() + 24 * 60 * 60 * 1000);
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({
        storeId: null,
        overrides: [makeOverride({ isEnabled: false, startsAt: future })],
      }),
    ]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: true,
      allowedLevels: LEVELS,
      activeLevel: "basic",
    });
  });

  it("ignore un override dont la fenêtre temporelle est expirée", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    const past = new Date(Date.now() - 24 * 60 * 60 * 1000);
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({
        storeId: null,
        overrides: [makeOverride({ isEnabled: false, endsAt: past })],
      }),
    ]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: true,
      allowedLevels: LEVELS,
      activeLevel: "basic",
    });
  });

  it("appelle getCurrentStoreId lorsque options.storeId n'est pas fourni", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([makeFlag({ storeId: null })]);

    await getFeatureLevelState("platform.localization");

    expect(mockGetCurrentStoreId).toHaveBeenCalledTimes(1);
  });

  it("contourne getCurrentStoreId lorsque options.storeId est fourni explicitement", async () => {
    mockDb.featureFlag.findMany.mockResolvedValue([makeFlag({ storeId: "store_explicit" })]);

    await getFeatureLevelState("platform.localization", { storeId: "store_explicit" });

    expect(mockGetCurrentStoreId).not.toHaveBeenCalled();
  });

  it("contourne getCurrentStoreId lorsque options.storeId est explicitement null", async () => {
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({ storeId: null, defaultLevel: "basic" }),
    ]);

    await expect(getFeatureLevelState("platform.localization", { storeId: null })).resolves.toEqual(
      {
        isActive: true,
        allowedLevels: LEVELS,
        activeLevel: "basic",
      }
    );
    expect(mockGetCurrentStoreId).not.toHaveBeenCalled();
  });

  it("sélectionne le flag storeId correspondant plutôt que le flag global lorsque les deux sont retournés", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({ storeId: null, defaultLevel: "basic" }),
      makeFlag({ storeId: "store_1", defaultLevel: "advanced" }),
    ]);

    await expect(getFeatureLevelState("platform.localization")).resolves.toEqual({
      isActive: true,
      allowedLevels: LEVELS,
      activeLevel: "advanced",
    });
  });
});

describe("meetsFeatureLevel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("retourne false si la feature est inactive, sans évaluer le niveau requis", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([]);

    await expect(meetsFeatureLevel("platform.localization", "basic")).resolves.toBe(false);
  });

  it("retourne true si la feature est active et que le niveau effectif satisfait le niveau requis", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({ storeId: null, defaultLevel: "advanced" }),
    ]);

    await expect(meetsFeatureLevel("platform.localization", "basic")).resolves.toBe(true);
  });

  it("retourne false si le niveau effectif est inférieur au niveau requis", async () => {
    mockGetCurrentStoreId.mockResolvedValue("store_1");
    mockDb.featureFlag.findMany.mockResolvedValue([
      makeFlag({ storeId: null, defaultLevel: "basic" }),
    ]);

    await expect(meetsFeatureLevel("platform.localization", "advanced")).resolves.toBe(false);
  });
});
