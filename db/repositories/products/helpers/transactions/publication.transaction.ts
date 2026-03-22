import type { ProductTxClient } from "@db-products/types/tx";
import { hasPatternDetailInTx, hasPrimaryActiveDeliverableInTx } from "./shared.transaction";

export async function assertProductPublicationRulesInTx(
  tx: ProductTxClient,
  input: {
    productId: string;
    status?: "draft" | "published" | "archived";
    productKind: "physical" | "digital" | "hybrid";
  }
): Promise<void> {
  if (input.status !== "published") {
    return;
  }

  if (input.productKind === "digital") {
    const hasPrimaryDeliverable = await hasPrimaryActiveDeliverableInTx(tx, input.productId);

    if (!hasPrimaryDeliverable) {
      throw new Error("PRODUCT_DIGITAL_DELIVERABLE_REQUIRED");
    }

    const hasPattern = await hasPatternDetailInTx(tx, input.productId);

    if (!hasPattern) {
      throw new Error("PRODUCT_PATTERN_DETAIL_REQUIRED");
    }
  }
}
