import { PackageIcon } from "lucide-react";

export default function ProductDetailDefault() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-panel">
        <PackageIcon className="size-5 text-page-foreground/40" />
      </div>
      <div className="grid gap-1">
        <p className="text-sm font-medium text-page-foreground">Aucun produit sélectionné</p>
        <p className="text-sm text-page-foreground/50">
          Sélectionnez un produit dans la liste pour en voir le détail.
        </p>
      </div>
    </div>
  );
}
