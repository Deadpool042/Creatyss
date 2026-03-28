import { type ProductVariantStatus } from "../../../src/generated/prisma/client";
import type { WooImage } from "../schemas";

export type ImportedVariantOptionSelectionInput = {
  optionName: string;
  optionCode: string;
  valueName: string;
  valueCode: string;
};

export type ImportedVariantInput = {
  externalId: string;
  sku: string;
  slug: string | null;
  name: string | null;
  status: ProductVariantStatus;
  isDefault: boolean;
  sortOrder: number;
  amount: string | null;
  compareAtAmount: string | null;
  image: WooImage | null;
  externalReference: string | null;
  optionSelections: ImportedVariantOptionSelectionInput[];
};
