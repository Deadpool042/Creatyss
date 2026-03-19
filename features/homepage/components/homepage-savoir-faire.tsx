import Image from "next/image";

type HomepageSavoirFaireSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
};

const savoirFaireImagePath = "/uploads/savoir-faire-placeholder.webp";

export function HomepageSavoirFaireSection({
  editorialText,
  editorialTitle,
}: HomepageSavoirFaireSectionProps) {
  return (
    <section className="grid overflow-hidden rounded-xl border border-hero-border/50 bg-hero-bg min-[860px]:grid-cols-[0.95fr_1.05fr] dark:border-hero-border">
      {/* Panneau visuel */}
      <div className="relative min-h-136 overflow-hidden bg-[linear-gradient(145deg,#c8b89e_0%,#a8906e_45%,#6e5840_100%)]">
        <Image
          alt="Détail du savoir-faire Creatyss dans l'atelier"
          src={savoirFaireImagePath}
          fill
          className="object-cover object-[58%_center] md:object-[62%_center]"
          quality={92}
          sizes="(max-width: 979px) 100vw, 48vw"
        />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(28,22,16,0.18)_0%,rgba(28,22,16,0.04)_36%,rgba(28,22,16,0)_62%)] dark:bg-[linear-gradient(to_top,rgba(0,0,0,0.34)_0%,rgba(0,0,0,0.12)_36%,rgba(0,0,0,0)_62%)]" />
        {!savoirFaireImagePath ? (
          <div className="absolute inset-0 grid place-items-center bg-black/5 p-8 text-center text-[0.62rem] uppercase tracking-[0.24em] text-white/35">
            Détail couture · mains au travail · lumière naturelle
          </div>
        ) : null}

        <div className="absolute inset-x-0 bottom-0 flex items-center gap-5 bg-[linear-gradient(90deg,rgba(74,54,36,0.96)_0%,rgba(53,38,26,0.94)_100%)] px-8 py-5 text-white backdrop-blur-sm dark:bg-[linear-gradient(90deg,rgba(18,14,10,0.98)_0%,rgba(12,9,7,0.96)_100%)]">
          <div className="font-serif text-[2.2rem] font-light leading-none text-white/42 dark:text-white/55">
            100%
          </div>
          <div className="flex-1">
            <p className="text-[0.82rem] font-medium text-white/96">Fait main en France</p>
            <p className="mt-0.5 text-[0.75rem] font-light leading-relaxed text-white/72 dark:text-white/78">
              Chaque geste, de la découpe à la finition, est réalisé dans l'atelier Creatyss.
            </p>
          </div>
        </div>
      </div>

      {/* Panneau éditorial — fond crème chaud */}
      <div className="bg-hero-bg px-8 py-10 min-[860px]:px-18 min-[860px]:py-20 dark:bg-background">
        <p className="mb-3.5 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-brand dark:text-brand">
          Atelier & savoir-faire
        </p>

        <h2 className="max-w-[18ch] font-serif text-3xl font-normal leading-[1.2] tracking-tight text-hero-ink min-[860px]:text-[2.6rem] dark:text-foreground">
          {editorialTitle ?? "Du dessin à la dernière piqûre"}
        </h2>

        {/* Rule terracotta */}
        <div className="mt-5 mb-6 h-px w-9 bg-brand dark:bg-brand" />

        <p className="max-w-[44ch] text-sm font-light leading-[1.85] text-hero-ink-soft dark:text-foreground/72">
          {editorialText ??
            "Chaque sac naît d'une intention, se dessine, se construit dans des matières choisies avec soin et prend forme dans un rythme volontairement artisanal. Ici, rien n'est précipité. Chaque création est pensée pour durer et porter une vraie présence."}
        </p>

        <ul className="mt-8 grid gap-0">
          <li className="grid grid-cols-[1.75rem_1fr] items-start gap-4.5 border-t border-hero-border/60 py-4 dark:border-hero-border">
            <span className="mt-0.5 font-serif text-xl font-normal leading-none text-brand dark:text-brand">
              01
            </span>
            <span className="text-[0.82rem] font-light leading-[1.6] text-hero-ink-soft dark:text-foreground/72">
              Matières choisies pour leur tenue, leur toucher et leur durabilité.
            </span>
          </li>
          <li className="grid grid-cols-[1.75rem_1fr] items-start gap-4.5 border-t border-hero-border/60 py-4 dark:border-hero-border">
            <span className="mt-0.5 font-serif text-xl font-normal leading-none text-brand dark:text-brand">
              02
            </span>
            <span className="text-[0.82rem] font-light leading-[1.6] text-hero-ink-soft dark:text-foreground/72">
              Fabrication artisanale, attentive aux finitions et au juste rythme.
            </span>
          </li>
          <li className="grid grid-cols-[1.75rem_1fr] items-start gap-4.5 border-t border-b border-hero-border/60 py-4 dark:border-hero-border">
            <span className="mt-0.5 font-serif text-xl font-normal leading-none text-brand dark:text-brand">
              03
            </span>
            <span className="text-[0.82rem] font-light leading-[1.6] text-hero-ink-soft dark:text-foreground/72">
              Des pièces singulières pensées pour accompagner le quotidien avec élégance.
            </span>
          </li>
        </ul>
      </div>
    </section>
  );
}
