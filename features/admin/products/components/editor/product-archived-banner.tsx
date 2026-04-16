import type { JSX } from "react";
import { ArchiveRestore } from "lucide-react";

export function ProductArchivedBanner(): JSX.Element {
  return (
    <div className="rounded-2xl border border-amber-300/60 bg-amber-50 px-4 py-4 text-amber-950 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="mt-0.5 rounded-full bg-amber-100 p-2">
          <ArchiveRestore className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold">Produit dans la corbeille</p>
          <p className="mt-1 text-sm text-amber-900/85">
            Ce produit est archivé. Vous pouvez le restaurer ou le supprimer définitivement.
          </p>
        </div>
      </div>
    </div>
  );
}
