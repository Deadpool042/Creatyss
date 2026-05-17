import Image from "next/image";
import Link from "next/link";

const BOUTIQUE_LINKS = [
  { href: "/boutique", label: "Toute la boutique" },
  { href: "/boutique?sort=newest", label: "Nouveautés" },
  { href: "/boutique?category=sacs", label: "Sacs" },
  { href: "/boutique?category=accessoires", label: "Accessoires" },
] as const;

type FooterInfoLink = { href: string; label: string; status?: "active" | "comingSoon" };

const INFO_LINKS: readonly FooterInfoLink[] = [
  { href: "/blog", label: "Blog" },
  { href: "/favoris", label: "Favoris" },
  { href: "/panier", label: "Panier" },
  { href: "/a-propos", label: "À propos", status: "comingSoon" },
  { href: "/contact", label: "Contact", status: "comingSoon" },
  { href: "/faq", label: "FAQ", status: "comingSoon" },
];

const ATELIER_ITEMS = [
  "Saint-Étienne",
  "Fait main",
  "Sans cuir",
  "Pièces uniques",
  "Les marchés",
  "Sur-mesure",
] as const;

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
      className="border-t border-surface-border-subtle bg-background-secondary pt-8 pb-[calc(3.5rem+env(safe-area-inset-bottom,0px)+1.5rem)] text-sm md:pt-10 md:pb-10 min-[560px]:max-[1199px]:landscape:pb-20"
    >
      <div className="mx-auto grid max-w-430 gap-8 px-4 sm:grid-cols-2 sm:px-6 desktop:grid-cols-5 xl:px-12 md:gap-10">
        {/* Colonne marque */}
        <div className="flex flex-col gap-3">
          <Link href="/" className="inline-flex items-center gap-2 text-foreground">
            <Image
              src="/uploads/logo.svg"
              alt=""
              aria-hidden="true"
              width={24}
              height={24}
              className="h-6 w-auto shrink-0 opacity-85"
            />
            <span className="text-[0.88rem] font-semibold uppercase tracking-[0.2em]">
              Creatyss
            </span>
          </Link>
          <p className="text-[0.82rem] leading-relaxed text-text-muted-strong">
            Sacs et accessoires artisanaux conçus et cousus à la main à Saint‑Étienne, sans cuir.
          </p>
        </div>

        {/* Colonne boutique */}
        <nav aria-label="Navigation boutique" className="flex flex-col gap-3">
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
        </nav>

        {/* Colonne informations */}
        <nav aria-label="Navigation informations" className="flex flex-col gap-3">
          <FooterColumnTitle>Informations</FooterColumnTitle>
          <ul className="flex flex-col gap-2">
            {INFO_LINKS.map(({ href, label, status }) => (
              <li key={href}>
                {status === "comingSoon" ? (
                  <span
                    aria-disabled="true"
                    className="cursor-default text-[0.82rem] text-text-muted-strong/40"
                  >
                    {label}
                    <span className="ml-1.5 text-[0.6rem] font-medium uppercase tracking-[0.06em]">
                      Bientôt
                    </span>
                  </span>
                ) : (
                  <Link href={href} className={FOOTER_LINK_CLASS}>
                    {label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

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

        {/* Colonne newsletter — éditoriale, inscription bientôt disponible */}
        <div className="flex flex-col gap-3 sm:col-span-2 desktop:col-span-1">
          <FooterColumnTitle>Newsletter</FooterColumnTitle>
          <p className="text-[0.82rem] leading-relaxed text-text-muted-strong">
            Recevez nos nouveautés et pièces disponibles en avant-première.
          </p>
          <p className="text-[0.75rem] italic text-text-muted-strong/70">
            Inscription bientôt disponible.
          </p>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-430 flex-col items-center gap-1 border-t border-surface-border-subtle px-4 pt-5 text-center sm:px-6 min-[560px]:flex-row min-[560px]:justify-between xl:px-12">
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
