import { CategoryStatus } from "@/prisma-generated/client";

import type { CategoryLifecycleStatus } from "./category-status";

export function mapCategoryLifecycleStatusToPrismaStatus(
  status: CategoryLifecycleStatus
): CategoryStatus {
  switch (status) {
    case "draft":
      return CategoryStatus.DRAFT;
    case "active":
      return CategoryStatus.ACTIVE;
    case "inactive":
      return CategoryStatus.INACTIVE;
    case "archived":
      return CategoryStatus.ARCHIVED;
  }
}

export function mapPrismaCategoryStatusToLifecycleStatus(
  status: CategoryStatus
): CategoryLifecycleStatus {
  switch (status) {
    case CategoryStatus.DRAFT:
      return "draft";
    case CategoryStatus.ACTIVE:
      return "active";
    case CategoryStatus.INACTIVE:
      return "inactive";
    case CategoryStatus.ARCHIVED:
      return "archived";
  }
}
