import "server-only";

import { listAdminPriceLists } from "@/features/admin/catalog/queries/list-admin-price-lists.query";

export type PricingGovernanceData = Readonly<{
  totalLists: number;
  activeLists: number;
  totalEntries: number;
  defaultList: Readonly<{
    name: string;
    currencyCode: string;
  }> | null;
}>;

export async function getPricingGovernanceData(): Promise<PricingGovernanceData | null> {
  try {
    const priceLists = await listAdminPriceLists();

    const activeLists = priceLists.filter((priceList) => priceList.status === "ACTIVE").length;
    const defaultList = priceLists.find((priceList) => priceList.isDefault);
    const totalEntries = priceLists.reduce(
      (sum, priceList) =>
        sum + priceList.productPricesCount + priceList.variantPricesCount,
      0
    );

    return {
      totalLists: priceLists.length,
      activeLists,
      totalEntries,
      defaultList:
        defaultList === undefined
          ? null
          : {
              name: defaultList.name,
              currencyCode: defaultList.currencyCode,
            },
    };
  } catch {
    return null;
  }
}
