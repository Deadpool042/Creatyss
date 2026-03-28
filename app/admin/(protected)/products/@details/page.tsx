type ProductDetailsPageProps = {
  searchParams?: Promise<{
    productId?: string;
  }>;
};

export default async function ProductDetailsPage({ searchParams }: ProductDetailsPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const productId = params?.productId;

  if (!productId) {
    return null;
  }

  return <div>details actif</div>;
}
