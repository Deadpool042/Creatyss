import Link from "next/link";

import { Button } from "@/components/ui/button";

type BoutiqueMarketAsideProps = {
  href: string;
};

export function BoutiqueMarketAside({ href }: BoutiqueMarketAsideProps) {
  return (
    <aside className="hidden laptop:block laptop:self-stretch laptop:border-l laptop:p-3 desktop:p-3.5 wide:p-4 ultrawide:p-5  ">
      <div className="laptop:sticky laptop:top-32 laptop:z-20 laptop:grid laptop:content-start laptop:gap-3 desktop:gap-3.5 wide:gap-4 ultrawide:gap-4.5">
        <div className="grid gap-1.5">
          <p className="m-0 text-[11px] font-semibold uppercase tracking-widest text-text-muted-strong">
            Les marchés
          </p>
          <p className="m-0 text-sm leading-relaxed text-foreground">
            Je vous attends sur les marchés.
          </p>
        </div>

        <div className="hidden gap-2 border-y border-shell-border/60 py-3 text-xs text-text-muted-strong desktop:grid ultrawide:gap-2.5">
          <p className="m-0">Pièces en petite série</p>
          <p className="m-0">Rencontres et conseils en direct</p>
        </div>

        <Button asChild size="sm" className="h-9 text-xs">
          <Link href={href}>Voir la boutique</Link>
        </Button>
      </div>
    </aside>
  );
}
