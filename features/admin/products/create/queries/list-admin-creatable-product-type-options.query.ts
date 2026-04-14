import { ensureAdminCreatableProductTypes } from "../services/ensure-admin-creatable-product-types.service";

export async function listAdminCreatableProductTypeOptions() {
  const { productTypes } = await ensureAdminCreatableProductTypes();

  return productTypes.map((item) => ({
    id: item.id,
    code: item.code,
    name: item.name,
    slug: item.slug,
    isActive: item.isActive,
  }));
}
