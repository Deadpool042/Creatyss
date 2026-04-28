import { Gem, MapPin, ShieldCheck } from "lucide-react";

export function ProductTrust() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-shell-border px-6 py-5">
      <div className="group flex flex-wrap items-center justify-center gap-2 transition-colors duration-200">
        <ShieldCheck className="size-6 shrink-0 text-brand/70 transition-colors duration-200 group-hover:text-brand" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted transition-colors duration-200 group-hover:text-foreground">Paiement sécurisé</span>
      </div>
      <div className="group flex flex-wrap items-center justify-center gap-2 transition-colors duration-200">
        <MapPin className="size-6 shrink-0 text-brand/70 transition-colors duration-200 group-hover:text-brand" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted transition-colors duration-200 group-hover:text-foreground">Atelier local</span>
      </div>
      <div className="group flex flex-wrap items-center justify-center gap-2 transition-colors duration-200">
        <Gem className="size-6 shrink-0 text-brand/70 transition-colors duration-200 group-hover:text-brand" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted transition-colors duration-200 group-hover:text-foreground">Pièces artisanales</span>
      </div>
    </div>
  );
}
