import type { AdminPriceListOption } from "@/features/admin/products/editor/types";

type PriceListOptionSource = {
  id: string;
  code: string;
  name: string;
  isDefault: boolean;
  currencyCode: string;
};

export function mapAdminPriceListOption(priceList: PriceListOptionSource): AdminPriceListOption {
  return {
    id: priceList.id,
    code: priceList.code,
    name: priceList.name,
    isDefault: priceList.isDefault,
    currencyCode: priceList.currencyCode,
  };
}
