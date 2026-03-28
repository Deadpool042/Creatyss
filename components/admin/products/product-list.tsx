import Link from "next/link";
import { Package } from "lucide-react";

import type { ProductListItemDTO } from "@features/products";
import { EmptyState } from "@components/shared/empty-state";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import { cn } from "@/lib/utils";

type ProductListProps = {
  products: ProductListItemDTO[];
  selectedId?: string | undefined;
};

export function ProductList({ products, selectedId }: ProductListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Produits</CardTitle>
          <CardDescription>Gérez le catalogue produits de la boutique.</CardDescription>
        </div>

        <Button asChild>
          <Link href="/admin/products?editor=create">Nouveau produit</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <EmptyState
            title="Aucun produit"
            description="Commencez par créer votre premier produit pour alimenter le catalogue."
            icon={Package}
            action={{
              label: "Créer un produit",
              href: "/admin/products?editor=create",
            }}
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Créé le</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => {
                const isSelected = product.id === selectedId;

                return (
                  <TableRow key={product.id} className={cn(isSelected && "bg-muted/50")}>
                    <TableCell className="font-medium">
                      <Link className="block" href={`/admin/products?productId=${product.id}`}>
                        {product.name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        className="block text-muted-foreground"
                        href={`/admin/products?productId=${product.id}`}
                      >
                        {product.slug}
                      </Link>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <Link className="block" href={`/admin/products?productId=${product.id}`}>
                        {new Date(product.createdAt).toLocaleDateString()}
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
