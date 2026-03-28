import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProductEmptyState() {
  return (
    <div className="flex h-full items-center justify-center p-8">
      <div className="max-w-xs space-y-4 text-center">
        <div className="flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-muted">
            <Package className="h-6 w-6 text-muted-foreground" />
          </div>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Sélectionnez un produit</p>
          <p className="text-xs text-muted-foreground">
            Choisissez un produit dans la liste ou créez-en un nouveau.
          </p>
        </div>
        <Button size="sm" asChild>
          <Link href="/admin/products/new">
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Nouveau produit
          </Link>
        </Button>
      </div>
    </div>
  );
}
