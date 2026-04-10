import type {
  AdminNavigationContext,
  AdminNavigationGroup,
  AdminNavigationGroupDefinition,
  AdminNavigationItem,
} from "../types";

type BuildAdminNavigationParams = {
  groupDefinitions: ReadonlyArray<AdminNavigationGroupDefinition>;
  items: ReadonlyArray<AdminNavigationItem>;
  context: AdminNavigationContext;
};

function sortNavigationItems(left: AdminNavigationItem, right: AdminNavigationItem): number {
  return left.order - right.order;
}

function includesAll(source: ReadonlySet<string>, values: readonly string[]): boolean {
  for (const value of values) {
    if (!source.has(value)) {
      return false;
    }
  }

  return true;
}

function includesAny(source: ReadonlySet<string>, values: readonly string[]): boolean {
  for (const value of values) {
    if (source.has(value)) {
      return true;
    }
  }

  return false;
}

export function hasAdminNavigationAccess(
  item: AdminNavigationItem,
  context: AdminNavigationContext
): boolean {
  const access = item.access;

  if (!access) {
    return true;
  }

  if (access.internalOnly && !context.isInternalUser) {
    return false;
  }

  if (access.capabilitiesAll && !includesAll(context.capabilities, access.capabilitiesAll)) {
    return false;
  }

  if (access.capabilitiesAny && !includesAny(context.capabilities, access.capabilitiesAny)) {
    return false;
  }

  if (access.featureFlagsAll && !includesAll(context.featureFlags, access.featureFlagsAll)) {
    return false;
  }

  if (access.featureFlagsAny && !includesAny(context.featureFlags, access.featureFlagsAny)) {
    return false;
  }

  return true;
}

export function buildAdminNavigation({
  groupDefinitions,
  items,
  context,
}: BuildAdminNavigationParams): ReadonlyArray<AdminNavigationGroup> {
  return groupDefinitions
    .map((groupDefinition) => {
      const groupItems = items
        .filter((item) => item.group === groupDefinition.key)
        .filter((item) => hasAdminNavigationAccess(item, context))
        .sort(sortNavigationItems);

      return {
        key: groupDefinition.key,
        label: groupDefinition.label,
        ...(groupDefinition.defaultOpen !== undefined
          ? { defaultOpen: groupDefinition.defaultOpen }
          : {}),
        items: groupItems,
      };
    })
    .filter((group) => group.items.length > 0);
}

export function buildAdminMobilePrimaryNavigationItems(
  items: ReadonlyArray<AdminNavigationItem>,
  context: AdminNavigationContext
): ReadonlyArray<AdminNavigationItem> {
  return items
    .filter((item) => item.visibility.mobilePrimary)
    .filter((item) => hasAdminNavigationAccess(item, context))
    .sort(sortNavigationItems);
}

export function buildAdminMobileMoreNavigationItems(
  items: ReadonlyArray<AdminNavigationItem>,
  context: AdminNavigationContext
): ReadonlyArray<AdminNavigationItem> {
  return items
    .filter((item) => item.visibility.mobileMore)
    .filter((item) => hasAdminNavigationAccess(item, context))
    .sort(sortNavigationItems);
}
