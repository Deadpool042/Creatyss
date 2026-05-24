import { ProductStatus } from "@/prisma-generated/client";

export type ProductLifecycleStatus = "draft" | "active" | "inactive" | "archived";

export function mapProductStatusToPrismaStatus(status: ProductLifecycleStatus): ProductStatus {
  switch (status) {
    case "draft":
      return ProductStatus.DRAFT;
    case "active":
      return ProductStatus.ACTIVE;
    case "inactive":
      return ProductStatus.INACTIVE;
    case "archived":
      return ProductStatus.ARCHIVED;
  }
}
