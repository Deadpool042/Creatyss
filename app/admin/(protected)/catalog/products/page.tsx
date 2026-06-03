import { ProductsListPanel } from "./products-list-panel";
import {
  parseProductsListSearchParams,
  type ProductsListSearchParams,
} from "./products-list-params";

export const dynamic = "force-dynamic";

type SearchParams = Promise<ProductsListSearchParams>;

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const params = parseProductsListSearchParams(await searchParams);

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
