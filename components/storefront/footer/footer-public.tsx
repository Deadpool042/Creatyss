import Link from "next/link";

const BOUTIQUE_LINKS = [
  { href: "/boutique", label: "Toute la boutique" },
  { href: "/boutique?sort=newest", label: "Nouveautés" },
  { href: "/boutique?category=sacs", label: "Sacs" },
  { href: "/boutique?category=accessoires", label: "Accessoires" },
] as const;

const INFO_LINKS = [
  { href: "/blog", label: "Blog" },
  { href: "/favoris", label: "Favoris" },
  { href: "/panier", label: "Panier" },
] as const;

const ATELIER_ITEMS = ["Saint-Étienne", "Fait main", "Sans cuir", "Pièces uniques"] as const;

const FOOTER_LINK_CLASS =
  "rounded text-[0.82rem] text-text-muted-strong transition-colors hover:text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring/70";

function FooterColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-foreground">
      {children}
    </p>
  );
}

export function FooterPublic() {
  return (
    <footer
      aria-label="Pied de page"
      className="border-t border-shell-border bg-background/50 px-4 py-10 pb-28 text-sm min-[560px]:max-[1199px]:landscape:pb-20 min-[1200px]:pb-10"
    >
      <div className="mx-auto grid max-w-430 gap-10 sm:grid-cols-2 lg:grid-cols-4">
        {/* Colonne marque */}
        <div className="flex flex-col gap-3">
          <span className="text-[0.88rem] font-semibold uppercase tracking-[0.2em] text-foreground">
            Creatyss
          </span>
          <p className="text-[0.82rem] leading-relaxed text-text-muted-strong">
            Sacs et accessoires artisanaux conçus et cousus à la main à Saint‑Étienne, sans cuir.
          </p>
        </div>

        {/* Colonne boutique */}
        <div className="flex flex-col gap-3">
          <FooterColumnTitle>Boutique</FooterColumnTitle>
          <ul className="flex flex-col gap-2">
            {BOUTIQUE_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={FOOTER_LINK_CLASS}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne informations */}
        <div className="flex flex-col gap-3">
          <FooterColumnTitle>Informations</FooterColumnTitle>
          <ul className="flex flex-col gap-2">
            {INFO_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={FOOTER_LINK_CLASS}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Colonne atelier — mentions éditoriales non cliquables */}
        <div className="flex flex-col gap-3">
          <FooterColumnTitle>L&apos;atelier</FooterColumnTitle>
          <ul className="flex flex-col gap-2">
            {ATELIER_ITEMS.map((item) => (
              <li key={item} className="text-[0.82rem] text-text-muted-strong">
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-10 flex max-w-430 flex-col items-center gap-1 border-t border-shell-border pt-6 text-center min-[560px]:flex-row min-[560px]:justify-between">
        <span className="text-[0.78rem] text-text-muted-strong">
          © {new Date().getFullYear()} Creatyss. Tous droits réservés.
        </span>
        <span className="text-[0.78rem] text-text-muted-strong">
          Créations artisanales en pièces uniques
        </span>
      </div>
    </footer>
  );
}
