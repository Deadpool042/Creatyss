import Link from "next/link";

import type { ProductListItemDTO } from "@features/products";
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
import { cn } from "@core/shared/utils";

type ProductListProps = {
  products: ProductListItemDTO[];
  selectedId?: string;
};

export function ProductList({ products, selectedId }: ProductListProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle>Products</CardTitle>
          <CardDescription>Manage your product catalog.</CardDescription>
        </div>

        <Button asChild>
          <Link href="/products?editor=create">New product</Link>
        </Button>
      </CardHeader>

      <CardContent>
        {products.length === 0 ? (
          <div className="rounded-lg border border-dashed p-6 text-sm text-muted-foreground">
            No products yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => {
                const isSelected = product.id === selectedId;

                return (
                  <TableRow key={product.id} className={cn(isSelected && "bg-muted/50")}>
                    <TableCell className="font-medium">
                      <Link className="block" href={`/products?productId=${product.id}`}>
                        {product.name}
                      </Link>
                    </TableCell>

                    <TableCell>
                      <Link
                        className="block text-muted-foreground"
                        href={`/products?productId=${product.id}`}
                      >
                        {product.slug}
                      </Link>
                    </TableCell>

                    <TableCell className="text-muted-foreground">
                      <Link className="block" href={`/products?productId=${product.id}`}>
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
