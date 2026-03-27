import Link from "next/link";

import type { ProductDetailsDTO } from "@features/products";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

type ProductDetailsProps = {
  product: ProductDetailsDTO | null;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  if (!product) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Product details</CardTitle>
          <CardDescription>Select a product to view its details.</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">No product selected.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>{product.name}</CardTitle>
          <CardDescription>{product.slug}</CardDescription>
        </div>

        <Button asChild variant="outline">
          <Link href={`/products?productId=${product.id}&editor=edit`}>Edit</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm text-muted-foreground">
            {product.description && product.description.trim().length > 0
              ? product.description
              : "No description provided."}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Created
            </p>
            <p className="text-sm">{new Date(product.createdAt).toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Updated
            </p>
            <p className="text-sm">{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
