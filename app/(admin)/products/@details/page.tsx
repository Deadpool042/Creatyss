import { getProductDetails } from "@features/products";
import { ProductDetails } from "@components/admin/products/product-details";

type SearchParams = {
  productId?: string;
};

type ProductDetailsPageProps = {
  searchParams?: Promise<SearchParams> | SearchParams;
};

export default async function ProductDetailsPage({ searchParams }: ProductDetailsPageProps) {
  const params = searchParams ? await searchParams : {};
  const productId = params?.productId;

  const product = productId ? await getProductDetails(productId) : null;

  return <ProductDetails product={product} />;
}
