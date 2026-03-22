import type { Prisma } from "@prisma/client";

export const productPatternDetailSelect = {
  productId: true,
  difficultyLevel: true,
  estimatedTimeMinutes: true,
  finishedWidthCm: true,
  finishedHeightCm: true,
  finishedDepthCm: true,
  suppliesJson: true,
  toolsJson: true,
  instructionsSummary: true,
  licenseText: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ProductPatternDetailSelect;

export type ProductPatternDetailRow = Prisma.ProductPatternDetailGetPayload<{
  select: typeof productPatternDetailSelect;
}>;
