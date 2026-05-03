import Link from "next/link";

import { Button } from "@/components/ui/button";

type BoutiqueMarketAsideProps = {
  href: string;
};

export function BoutiqueMarketAside({ href }: BoutiqueMarketAsideProps) {
  return (
    <aside className="hidden laptop:grid laptop:content-start laptop:gap-3 laptop:rounded-xl laptop:border laptop:border-surface-border-subtle/70 laptop:bg-surface-panel/22 laptop:p-3 laptop:sticky laptop:top-24 laptop:self-start desktop:gap-3.5 desktop:p-3.5 wide:gap-4 wide:p-4 ultrawide:gap-4.5 ultrawide:p-5">
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
    </aside>
  );
}
