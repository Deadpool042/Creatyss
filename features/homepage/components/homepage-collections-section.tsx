import Image from "next/image";
import Link from "next/link";
import { PLACEHOLDER_FILENAME } from "@/components/shared/placeholderImage";
import { type FeaturedCategory } from "@/db/catalog";

type TagStyle = "light" | "vert" | "terra";

type CategoryVisualConfig = {
  gradientClassName: string;
  countLabel: string;
  tag?: string;
  tagStyle?: TagStyle;
};

const TAG_STYLES: Record<TagStyle, string> = {
  light: "bg-white/88 text-hero-ink-soft backdrop-blur-sm",
  vert: "bg-[#6B7A5E] text-white backdrop-blur-sm",
  terra: "bg-brand text-white backdrop-blur-sm",
};

const VISUAL_CONFIG: Record<string, CategoryVisualConfig> = {
  "sacs-a-main": {
    gradientClassName: "bg-[linear-gradient(160deg,#a84040_0%,#7a2828_45%,#4e1616_100%)]",
    countLabel: "Collection phare",
    tag: "Collection phare",
    tagStyle: "light",
  },
  "sacs-a-bandouliere": {
    gradientClassName: "bg-[linear-gradient(145deg,#d4905a_0%,#9e6030_100%)]",
    countLabel: "Lignes souples et légères",
  },
  "mini-sacs": {
    gradientClassName: "bg-[linear-gradient(145deg,#8eb0c4_0%,#5c8099_100%)]",
    countLabel: "Formats compacts",
  },
  "pochettes-trousses": {
    gradientClassName: "bg-[linear-gradient(145deg,#c4b49a_0%,#8a7060_100%)]",
    countLabel: "L'essentiel",
    tag: "−30 €",
    tagStyle: "terra",
  },
  "sacs-a-dos": {
    gradientClassName: "bg-[linear-gradient(145deg,#6b8c6e_0%,#3d5c40_100%)]",
    countLabel: "Liberté de mouvement",
  },
};

const DEFAULT_VISUAL: CategoryVisualConfig = {
  gradientClassName: "bg-[linear-gradient(145deg,#c4b49a_0%,#8a7060_100%)]",
  countLabel: "",
};

type HomepageCollectionsSectionProps = {
  categories: FeaturedCategory[];
  uploadsPublicPath: string;
};

export function HomepageCollectionsSection({
  categories,
  uploadsPublicPath,
}: HomepageCollectionsSectionProps) {
  return (
    <section className="grid gap-8">
      {/* Section header */}
      <div className="flex flex-col gap-4 min-[900px]:flex-row min-[900px]:items-end min-[900px]:justify-between">
        <div>
          <p className="mb-3.5 text-[0.62rem] font-medium uppercase tracking-[0.32em] text-muted-foreground">
            L&apos;univers Creatyss
          </p>
          <h2 className="font-serif text-3xl font-normal tracking-tight text-foreground min-[900px]:text-5xl">
            Nos collections
          </h2>
        </div>

        <Link
          className="inline-flex items-center gap-2.5 self-start border-b border-hero-border pb-0.5 text-[0.68rem] font-medium uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground min-[900px]:self-auto"
          href="/boutique"
        >
          Tout voir
          <span aria-hidden="true" className="text-sm">
            →
          </span>
        </Link>
      </div>

      {/* Collection grid — featured spans 2 rows */}
      <div className="grid gap-3.5 min-[900px]:grid-cols-[1.5fr_1fr_1fr]">
        {categories.map((category, index) => {
          const isFeatured = index === 0;
          const visual = VISUAL_CONFIG[category.slug] ?? DEFAULT_VISUAL;

          return (
            <Link
              aria-label={`Collection ${category.name}`}
              className={`group relative overflow-hidden rounded-lg ${
                isFeatured
                  ? "min-h-128 min-[900px]:row-span-2 min-[900px]:min-h-0"
                  : "min-h-56 min-[900px]:aspect-3/2 min-[900px]:min-h-0"
              }`}
              href={`/boutique?category=${category.slug}`}
              key={category.id}
            >
              {/* Gradient fill */}
              <div
                className={`absolute inset-0 ${visual.gradientClassName} transition-transform duration-700 group-hover:scale-[1.04]`}
              />

              {/* Representative product image — not shown for placeholder */}
              {category.representativeImage &&
                category.representativeImage.filePath !== PLACEHOLDER_FILENAME && (
                  <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.04]">
                    <Image
                      alt={category.representativeImage.altText ?? category.name}
                      className="object-cover"
                      fill
                      sizes="(min-width: 900px) 33vw, 100vw"
                      src={`${uploadsPublicPath}/${category.representativeImage.filePath}`}
                    />
                  </div>
                )}

              {/* Dark overlay vignette */}
              <div className="absolute inset-0 bg-[linear-gradient(to_top,var(--media-overlay)_0%,transparent_52%)]" />

              {/* Tag */}
              {visual.tag && visual.tagStyle ? (
                <div
                  className={
                    "absolute left-4.5 top-4.5 px-2.5 py-1.25 text-[0.56rem] font-medium uppercase tracking-[0.18em] rounded-lg " +
                    TAG_STYLES[visual.tagStyle]
                  }
                >
                  {visual.tag}
                </div>
              ) : null}

              {/* Swatches palette — featured card only */}
              {isFeatured ? (
                <div aria-hidden="true" className="absolute bottom-5 right-5 flex gap-1.25">
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
                  }`}
                >
                  {category.name}
                </p>
                {visual.countLabel ? (
                  <p className="mt-1 text-[0.6rem] uppercase tracking-[0.2em] text-band-foreground-muted">
                    {visual.countLabel}
                  </p>
                ) : null}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
