import Link from "next/link";

export function HomepageAboutSection() {
  return (
    <section
      aria-labelledby="homepage-about-title"
      className="grid overflow-hidden rounded-xl min-[860px]:grid-cols-[1fr_1fr]"
    >
      {/* Panneau éditorial — bg-hero-bg comme savoir-faire */}
      <div className="flex flex-col justify-center bg-hero-bg px-8 py-14 min-[860px]:px-18 min-[860px]:py-24">
        <p className="mb-4 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-brand">
          La créatrice
        </p>

        {/* H2 avec <em> italic comme index.html, max-w 20ch */}
        <h2
          className="mb-6 max-w-[20ch] font-serif text-3xl font-normal leading-[1.2] tracking-tight text-hero-ink min-[860px]:text-[2.75rem]"
          id="homepage-about-title"
        >
          Derrière chaque sac, <em>une main.</em>
        </h2>

        {/* Blockquote — font-serif font-light leading-[1.6] border-l brand pl-6 */}
        <blockquote className="mb-7 max-w-[40ch] border-l-2 border-brand pl-6 font-serif text-[1.1rem] font-light italic leading-[1.6] text-hero-ink-soft min-[860px]:text-[1.2rem]">
          « Je couds par passion, mais aussi par conviction — que les objets qu'on porte méritent
          d'être pensés, faits avec soin, et destinés à durer. »
        </blockquote>

        {/* Signature — font-serif tracking-.12em comme index.html */}
        <p className="mb-11 font-serif text-[0.75rem] tracking-[0.12em] text-hero-ink-muted">
          — Creatyss, fabrication française
        </p>

        {/* btn-ghost — border-b seul comme index.html */}
        <Link
          className="inline-flex items-center gap-2.5 self-start border-b border-hero-border pb-0.5 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-hero-ink transition-colors hover:border-hero-ink"
          href="/blog?category=atelier"
        >
          Notre histoire
          <span aria-hidden="true" className="font-serif text-sm">
            →
          </span>
        </Link>
      </div>

      {/* Panneau visuel — toujours sombre, pas de radius interne */}
      <div className="relative min-h-128 overflow-hidden bg-[linear-gradient(160deg,#3a2e24_0%,#26201a_50%,#1c1610_100%)] min-[860px]:min-h-0">
        <div className="absolute inset-0 grid place-items-center p-8 text-center text-[0.62rem] uppercase tracking-[0.24em] text-white/30">
          Portrait de la créatrice · en atelier · lumière naturelle
        </div>

        {/* Encart stat — carré, bg-background, top-10 left-10 comme index.html */}
        <div
          aria-label="Depuis 2018"
          className="absolute left-10 top-10 bg-background px-6 py-5 text-center"
        >
          <div className="font-serif text-[2.25rem] font-light leading-none text-foreground">
            2018
          </div>
          <div className="mt-1 text-[0.56rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Depuis
          </div>
        </div>
      </div>
    </section>
  );
}
