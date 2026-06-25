export const ADMIN_DISCOUNTS_PATH = "/admin/marketing/discounts";

export function getAdminDiscountDetailPath(discountId: string): string {
  return `/admin/marketing/discounts/${discountId}`;
}
