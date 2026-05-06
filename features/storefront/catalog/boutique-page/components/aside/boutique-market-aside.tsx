import Link from "next/link";

import { Button } from "@/components/ui/button";

type BoutiqueMarketAsideProps = {
  href: string;
};

export function BoutiqueMarketAside({ href }: BoutiqueMarketAsideProps) {
  return (
    <aside className="boutique-market-shell">
      <div className="boutique-market-sticky">
        <div className="boutique-market-panel">
          <div className="grid gap-1.5">
            <p className="m-0 text-xs font-semibold uppercase tracking-widest text-text-muted-strong">
              L&apos;atelier Creatyss
            </p>
            <p className="m-0 text-base font-semibold leading-snug text-foreground">
              Créations faites main en pièce unique
            </p>
            <p className="m-0 text-sm leading-relaxed text-text-muted-strong">
              Chaque création est imaginée et cousue à la main. Retrouvez-moi en atelier ou sur les
              marchés pour échanger.
            </p>
          </div>

          <ul className="m-0 grid list-none gap-1.5 border-y border-surface-border-subtle py-3 pl-0 text-sm text-text-muted-strong">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
                ✦
              </span>
              Pièces uniques artisanales
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
                ✦
              </span>
              Matières soigneusement choisies
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
                ✦
              </span>
              Conseils personnalisés
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 shrink-0 text-brand" aria-hidden="true">
                ✦
              </span>
              Création sur-mesure possible
            </li>
          </ul>

          <div className="grid gap-2">
            <Button asChild size="sm">
              <Link href="/contact">Me contacter</Link>
            </Button>

            <Button
              asChild
              size="sm"
              variant="ghost"
              className="justify-start px-0 text-text-muted-strong"
            >
              <Link href={href}>Voir la boutique</Link>
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
