import Link from "next/link";

import { Button } from "@/components/ui/button";

type BoutiqueMarketAsideProps = {
  href: string;
};

export function BoutiqueMarketAside({ href: _href }: BoutiqueMarketAsideProps) {
  return (
    <aside className="boutique-market-shell">
      <div className="boutique-market-sticky">
        <div className="boutique-market-panel">
          <div className="grid gap-1.5">
            <p className="m-0 text-xs font-semibold uppercase tracking-widest text-text-muted-strong">
              L&apos;atelier Creatyss
            </p>
            <p className="m-0 text-base font-semibold leading-snug text-foreground">
              Prochains marchés
            </p>
          </div>

          <ul className="m-0 grid list-none gap-3 border-y border-surface-border-subtle py-3 pl-0 text-sm text-text-muted-strong">
            <li className="grid gap-0.5">
              <p className="m-0 text-xs font-medium uppercase tracking-[0.14em] text-brand">
                Date à confirmer
              </p>
              <p className="m-0 font-semibold text-foreground">Marché de créateurs</p>
              <p className="m-0 text-xs leading-relaxed">Saint-Étienne</p>
            </li>

            <li className="grid gap-0.5">
              <p className="m-0 text-xs font-medium uppercase tracking-[0.14em] text-brand">
                Calendrier à venir
              </p>
              <p className="m-0 font-semibold text-foreground">Marché artisanal</p>
              <p className="m-0 text-xs leading-relaxed">Loire</p>
            </li>
          </ul>

          <Button asChild size="sm" variant="ghost" className="w-fit justify-start px-0 text-brand">
            <Link href="/les-marches">Voir les marchés</Link>
          </Button>

          <div className="grid gap-1.5 rounded-xl border border-surface-border-subtle bg-surface-panel/45 p-3">
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
