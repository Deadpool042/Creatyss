// app/admin/(protected)/products/@list/page.tsx
import { ProductList } from "@components/admin/products/product-list";
import { getProductsList } from "@features/products";

type ProductsListPageProps = {
  searchParams?: Promise<{
    productId?: string;
  }>;
};

export default async function ProductsListPage({ searchParams }: ProductsListPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const products = await getProductsList();

  return <ProductList products={products} selectedId={params?.productId} />;
}
