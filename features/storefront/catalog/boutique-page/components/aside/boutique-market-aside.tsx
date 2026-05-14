import Link from "next/link";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type BoutiqueMarketAsideProps = {
  href: string;
};

export function BoutiqueMarketAside({ href: _href }: BoutiqueMarketAsideProps) {
  return (
    <aside
      aria-label="Informations atelier Creatyss"
      data-testid="boutique-market-aside"
      className="hidden tablet:block tablet:self-stretch"
    >
      <div className="grid gap-3 desktop:sticky desktop:top-[9rem] desktop:z-20 desktop:content-start">
        <div
          data-motion-surface="market-aside"
          className="grid gap-3.5 rounded-xl bg-background-secondary p-3.5"
        >
          <div className="grid gap-1">
            <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-widest text-text-muted-strong">
              L&apos;atelier Creatyss
            </p>
            <p className="m-0 text-base font-semibold leading-snug text-foreground">
              Prochains marchés
            </p>
          </div>

          <ul className="m-0 grid list-none gap-3.5 border-y border-surface-border-subtle py-3.5 pl-0">
            <li className="flex items-start gap-2.5">
              <CalendarIcon
                className="mt-0.5 size-3.5 shrink-0 text-brand/80"
                aria-hidden="true"
              />
              <div className="grid gap-0.5">
                <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand">
                  Date à confirmer
                </p>
                <p className="m-0 text-sm font-semibold text-foreground">Marché de créateurs</p>
                <p className="m-0 text-xs leading-relaxed text-text-muted-strong">Saint-Étienne</p>
              </div>
            </li>

            <li className="flex items-start gap-2.5">
              <CalendarIcon
                className="mt-0.5 size-3.5 shrink-0 text-brand/80"
                aria-hidden="true"
              />
              <div className="grid gap-0.5">
                <p className="m-0 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brand">
                  Calendrier à venir
                </p>
                <p className="m-0 text-sm font-semibold text-foreground">Marché artisanal</p>
                <p className="m-0 text-xs leading-relaxed text-text-muted-strong">Loire</p>
              </div>
            </li>
          </ul>

          <Button
            asChild
            size="sm"
            variant="ghost"
            className="w-fit justify-start px-0 text-brand hover:bg-transparent hover:text-brand/75"
          >
            <Link href="/les-marches">Voir les marchés</Link>
          </Button>

          <div className="grid gap-1.5 rounded-xl border border-surface-border-subtle/70 bg-background/70 p-3">
            <p className="m-0 text-sm font-semibold leading-snug text-foreground">
              Créations faites main en pièce unique
            </p>
            <p className="m-0 text-xs leading-relaxed text-text-muted-strong">
              Chaque sac est imaginé et cousu à la main dans l&apos;atelier stéphanois, en pièce
              unique et sans cuir.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
