import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BoutiqueMarketAsideProps = {
  href: string;
  className?: string;
};

export function BoutiqueMarketAside({ href, className }: BoutiqueMarketAsideProps) {
  return (
    <aside
      className={cn(
        "hidden laptop:block laptop:self-stretch laptop:border-l laptop:p-3 desktop:p-3.5 wide:p-4 ultrawide:p-5",
        className
      )}
    >
      <div className="laptop:sticky laptop:top-32 laptop:z-20 laptop:grid laptop:content-start laptop:gap-3 desktop:gap-3.5 wide:gap-4 ultrawide:gap-4.5">
        <div className="grid gap-1.5">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-widest text-text-muted-strong">
            Rencontrer l'atelier
          </p>
          <p className="m-0 text-sm leading-relaxed text-foreground">
            Chaque sac est imaginé et cousu en pièce unique près de Saint-Etienne. Retrouvez-moi sur
            les marchés pour échanger.
          </p>
        </div>

        <ul className="m-0 hidden list-disc gap-1.5 border-y border-shell-border/60 py-3 pl-4 text-xs text-text-muted-strong desktop:grid ultrawide:gap-2">
          <li>Pièces uniques</li>
          <li>Conseils en direct</li>
          <li>Créations locales</li>
        </ul>

        <Button asChild size="sm" className="h-9 text-xs">
          <Link href="/contact">Me contacter</Link>
        </Button>

        <Button
          asChild
          size="sm"
          variant="ghost"
          className="h-8 justify-start px-0 text-xs text-text-muted-strong"
        >
          <Link href={href}>Voir la boutique</Link>
        </Button>
      </div>
    </aside>
  );
}
