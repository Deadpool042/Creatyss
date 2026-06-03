import { InboxIcon } from "lucide-react";

export default function OrderDetailDefault() {
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-surface-panel">
        <InboxIcon className="size-5 text-page-foreground/40" />
      </div>
      <div className="grid gap-1">
        <p className="text-sm font-medium text-page-foreground">Aucune commande sélectionnée</p>
        <p className="text-sm text-page-foreground/50">
          Sélectionnez une commande dans la liste pour en voir le détail.
        </p>
      </div>
    </div>
  );
}
