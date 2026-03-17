import Link from "next/link";

type TagStyle = "light" | "vert" | "terra";

type CollectionItem = {
  href: string;
  name: string;
  countLabel: string;
  tag?: string;
  tagStyle?: TagStyle;
  gradientClassName: string;
};

const TAG_STYLES: Record<TagStyle, string> = {
  light: "bg-white/88 text-hero-ink-soft backdrop-blur-sm",
  vert: "bg-[#6B7A5E] text-white backdrop-blur-sm",
  terra: "bg-brand text-white backdrop-blur-sm"
};

const COLLECTIONS: CollectionItem[] = [
  {
    href: "/boutique?category=sacs-a-main",
    name: "Sacs à main",
    countLabel: "Collection phare",
    tag: "Collection phare",
    tagStyle: "light",
    gradientClassName:
      "bg-[linear-gradient(160deg,#a84040_0%,#7a2828_45%,#4e1616_100%)]"
  },
  {
    href: "/boutique?category=cabas",
    name: "Cabas",
    countLabel: "Silhouettes du quotidien",
    tag: "Nouveauté",
    tagStyle: "vert",
    gradientClassName: "bg-[linear-gradient(145deg,#8e9e82_0%,#5e7050_100%)]"
  },
  {
    href: "/boutique?category=bandoulieres",
    name: "Bandoulières",
    countLabel: "Lignes souples et légères",
    gradientClassName: "bg-[linear-gradient(145deg,#d4905a_0%,#9e6030_100%)]"
  },
  {
    href: "/boutique?category=mini-sacs",
    name: "Mini sacs",
    countLabel: "Formats compacts",
    gradientClassName: "bg-[linear-gradient(145deg,#8eb0c4_0%,#5c8099_100%)]"
  },
  {
    href: "/boutique?category=pochettes",
    name: "Pochettes & Trousses",
    countLabel: "L'essentiel",
    tag: "−30 €",
    tagStyle: "terra",
    gradientClassName: "bg-[linear-gradient(145deg,#c4b49a_0%,#8a7060_100%)]"
  }
];

export function HomepageCollectionsSection() {
  return (
    <section className="grid gap-8">
      {/* Section header */}
      <div className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
        <div>
          <p className="mb-3.5 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            L'univers Creatyss
          </p>
          <h2 className="font-serif text-3xl font-normal tracking-tight text-foreground min-[900px]:text-5xl">
            Nos collections
          </h2>
        </div>

        <Link
          className="inline-flex items-center gap-2.5 border-b border-hero-border pb-0.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
          href="/boutique">
          Tout voir
          <span
            aria-hidden="true"
            className="text-sm">
            →
          </span>
        </Link>
      </div>

      {/* Collection grid — 5 cards, featured spans 2 rows */}
      <div className="grid gap-3.5 min-[900px]:grid-cols-[1.5fr_1fr_1fr]">
        {COLLECTIONS.map((collection, index) => {
          const isFeatured = index === 0;

          return (
            <Link
              aria-label={`Collection ${collection.name}`}
              className={`group relative overflow-hidden rounded-(--radius) ${
                isFeatured
                  ? "min-h-[32rem] min-[900px]:row-span-2 min-[900px]:min-h-0"
                  : "min-h-[14rem] min-[900px]:aspect-[3/2] min-[900px]:min-h-0"
              }`}
              href={collection.href}
              key={collection.name}>
              {/* Gradient / image fill */}
              <div
                className={`absolute inset-0 ${collection.gradientClassName} transition-transform duration-700 group-hover:scale-[1.04]`}
              />

              {/* Dark overlay vignette */}
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(20,12,6,0.62)_0%,transparent_52%)]" />

              {/* Tag */}
              {collection.tag && collection.tagStyle ? (
                <div
                  className={`absolute left-[18px] top-[18px] px-2.5 py-[5px] text-[0.56rem] font-medium uppercase tracking-[0.18em] ${TAG_STYLES[collection.tagStyle]}`}>
                  {collection.tag}
                </div>
              ) : null}

              {/* Swatches palette — featured card only */}
              {isFeatured ? (
                <div
                  aria-hidden="true"
                  className="absolute bottom-5 right-5 flex gap-[5px]">
                  <span className="block size-3 rounded-full border-[1.5px] border-white/70 bg-[#8B2E2E]" />
                  <span className="block size-3 rounded-full border-[1.5px] border-white/70 bg-[#C4764A]" />
                  <span className="block size-3 rounded-full border-[1.5px] border-white/70 bg-[#D4C9B2]" />
                </div>
              ) : null}

              {/* Card info */}
              <div className="absolute inset-x-0 bottom-0 px-6 py-6 min-[900px]:px-7">
                <p
                  className={`font-serif font-normal text-white leading-tight ${
                    isFeatured ? "text-2xl" : "text-lg"
                  }`}>
                  {collection.name}
                </p>
                <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-white/55">
                  {collection.countLabel}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
