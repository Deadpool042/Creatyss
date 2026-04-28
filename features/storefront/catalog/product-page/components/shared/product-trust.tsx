import { Gem, MapPin, ShieldCheck } from "lucide-react";

export function ProductTrust() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 border-t border-shell-border px-5 py-4 min-[700px]:gap-2 min-[700px]:px-6 min-[700px]:py-5">
      <div className="group flex flex-wrap items-center justify-center gap-1.5 transition-colors duration-200 min-[700px]:gap-2">
        <ShieldCheck className="size-5 shrink-0 text-brand/70 transition-colors duration-200 group-hover:text-brand min-[700px]:size-6" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted transition-colors duration-200 group-hover:text-foreground">Paiement sécurisé</span>
      </div>
      <div className="group flex flex-wrap items-center justify-center gap-1.5 transition-colors duration-200 min-[700px]:gap-2">
        <MapPin className="size-5 shrink-0 text-brand/70 transition-colors duration-200 group-hover:text-brand min-[700px]:size-6" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted transition-colors duration-200 group-hover:text-foreground">Atelier local</span>
      </div>
      <div className="group flex flex-wrap items-center justify-center gap-1.5 transition-colors duration-200 min-[700px]:gap-2">
        <Gem className="size-5 shrink-0 text-brand/70 transition-colors duration-200 group-hover:text-brand min-[700px]:size-6" aria-hidden="true" />
        <span className="text-micro-copy text-foreground-muted transition-colors duration-200 group-hover:text-foreground">Pièces artisanales</span>
      </div>
    </div>
  );
}
