import { type CategoryStatus } from "../../../src/generated/prisma/client";
import type { WooImage } from "../schemas";

export type ImportedCategoryInput = {
  externalId: string;
  parentExternalId: string | null;
  code: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string | null;
  status: CategoryStatus;
  sortOrder: number;
  isFeatured: boolean;
  publishedAt: Date | null;
  image: WooImage | null;
};
