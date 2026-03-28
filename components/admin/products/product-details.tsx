import Link from "next/link";
import { Package } from "lucide-react";

import type { ProductDetailsDTO } from "@features/products";
import { EmptyState } from "@components/shared/empty-state";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";

type ProductDetailsProps = {
  product: ProductDetailsDTO | null;
};

export function ProductDetails({ product }: ProductDetailsProps) {
  if (!product) {
    return (
      <EmptyState
        title="Aucun produit sélectionné"
        description="Sélectionnez un produit dans la liste pour voir son détail ou ouvrez l’éditeur pour en créer un nouveau."
        icon={Package}
        action={{
          label: "Créer un produit",
          href: "/admin/products?editor=create",
        }}
      />
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
          <Link href={`/admin/products?productId=${product.id}&editor=edit`}>Modifier</Link>
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        <section className="space-y-2">
          <h3 className="text-sm font-medium">Description</h3>
          <p className="text-sm text-muted-foreground">
            {product.description && product.description.trim().length > 0
              ? product.description
              : "Aucune description renseignée."}
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Créé le
            </p>
            <p className="text-sm">{new Date(product.createdAt).toLocaleString()}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Mis à jour le
            </p>
            <p className="text-sm">{new Date(product.updatedAt).toLocaleString()}</p>
          </div>
        </section>
      </CardContent>
    </Card>
  );
}
