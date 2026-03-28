import Link from "next/link";
import { Button } from "@/components/ui/button";
import { listAdminProducts } from "@/features/admin/products/list";
import { parseProductsPageParams } from "@/features/admin/products/navigation";
import { ProductTable } from "@/components/admin/products/product-table";
import type { ProductListItemData } from "@/components/admin/products/product-list-item";

export default async function AdminProductsPage() {
  const params = parseProductsPageParams(undefined);
  const raw = await listAdminProducts(params);

  const products: ProductListItemData[] = raw.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    status: p.status,
    ...(p.shortDescription ? { shortDescription: p.shortDescription } : {}),
    ...(p.primaryImageUrl ? { imageUrl: p.primaryImageUrl } : {}),
    ...(p.amount ? { price: `${parseFloat(p.amount).toFixed(2)} €` } : {}),
    ...(p.primaryCategory ? { category: p.primaryCategory.name } : {}),
  }));

  // h-[calc(100svh-5.5rem)] : 100svh − shell header (3.5rem) − padding top+bottom (2×1rem)
  // md:h-[calc(100svh-6.5rem)] : idem avec padding md (2×1.5rem)
  return (
    <div className="flex h-[calc(100svh-5.5rem)] flex-col gap-6 md:h-[calc(100svh-6.5rem)]">
      <div className="flex shrink-0 items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Produits</h1>
          <p className="text-sm text-muted-foreground">
            {products.length} produit{products.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">Nouveau produit</Link>
        </Button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col">
        <ProductTable products={products} />
      </div>
    </div>
  );
}
