import { Gem, MapPin, ShieldCheck } from "lucide-react";

export function ProductTrust() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 border-t border-shell-border px-6 py-5">
      <div className="flex flex-wrap items-center justify-center gap-2">
        <ShieldCheck className="size-6 shrink-0 text-foreground/50" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted ">Paiement sécurisé</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <MapPin className="size-6 shrink-0 text-foreground/50" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted">Fabrication locale</span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Gem className="size-6 shrink-0 text-foreground/50" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted">Fabrication artisanale</span>
      </div>
    </div>
  );
}
