import type { AdminNavigationContext } from "@/features/admin/navigation";

import { adminProductModuleCapabilityRequirements } from "./product-module-policy";
import type { AdminProductModuleFeatureFlagsState } from "./read-admin-product-module-feature-flags";

export type AdminProductModuleCapabilities = {
  edit: boolean;
  preview: boolean;
  media: boolean;
  categories: boolean;
  seo: boolean;
  variants: boolean;
  pricing: boolean;
  availability: boolean;
  inventory: boolean;
  related: boolean;
};

type ResolveAdminProductModuleCapabilitiesInput = {
  isArchived: boolean;
  isStandalone: boolean;
  navigationContext?: Pick<AdminNavigationContext, "capabilities" | "isInternalUser">;
  moduleFeatureFlags?: AdminProductModuleFeatureFlagsState;
  moduleAccessOverrides?: Partial<AdminProductModuleCapabilities>;
};

const DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES = {
  edit: true,
  preview: true,
  media: true,
  categories: true,
  seo: true,
  variants: true,
  pricing: true,
  availability: true,
  inventory: true,
  related: true,
} satisfies AdminProductModuleCapabilities;

function hasAllCapabilities(
  source: ReadonlySet<string>,
  values: readonly string[],
): boolean {
  for (const value of values) {
    if (!source.has(value)) {
      return false;
    }
  }

  return true;
}

function resolveOptionalModuleAccess(input: {
  featureFlagState: boolean | undefined;
  fallback: boolean;
}): boolean {
  return input.featureFlagState ?? input.fallback;
}

export function resolveAdminProductModuleCapabilities(
  input: ResolveAdminProductModuleCapabilitiesInput
): AdminProductModuleCapabilities {
  void input.isArchived;
  void input.isStandalone;

  const canAccessSeo =
    input.navigationContext === undefined
      ? true
      : input.navigationContext.isInternalUser ||
        hasAllCapabilities(
          input.navigationContext.capabilities,
          adminProductModuleCapabilityRequirements.seo ?? [],
        );

  return {
    ...DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES,
    media: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.media,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.media,
    }),
    categories: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.categories,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.categories,
    }),
    seo: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.seo,
      fallback: canAccessSeo,
    }),
    variants: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.variants,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.variants,
    }),
    pricing: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.pricing,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.pricing,
    }),
    availability: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.availability,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.availability,
    }),
    inventory: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.inventory,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.inventory,
    }),
    related: resolveOptionalModuleAccess({
      featureFlagState: input.moduleFeatureFlags?.related,
      fallback: DEFAULT_ADMIN_PRODUCT_MODULE_CAPABILITIES.related,
    }),
    ...input.moduleAccessOverrides,
  };
}
