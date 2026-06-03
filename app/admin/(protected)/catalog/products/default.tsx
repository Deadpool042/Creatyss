import { ProductsListPanel } from "./products-list-panel";
import { getDefaultProductsListParams } from "./products-list-params";

// Slot fallback pour les sous-routes du slot children quand une URL /products/[slug]/* est chargée.
export const dynamic = "force-dynamic";

export default async function AdminProductsDefaultSlot() {
  const params = getDefaultProductsListParams();

  return (
    <ProductsListPanel
      view={params.view}
      search={params.search}
      status={params.status}
      sort={params.sort}
      page={params.page}
      perPage={params.perPage}
      featured={params.featured}
      categorySlugs={params.categorySlugs}
      image={params.image}
      stock={params.stock}
      variant={params.variant}
    />
  );
}
