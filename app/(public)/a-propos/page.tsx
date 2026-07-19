import type { Metadata } from "next";
import Link from "next/link";

import { clientEnv } from "@/core/config/env";
import { getLocalizedAProposCopy } from "@/features/storefront/content/queries/get-localized-a-propos-copy.query";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getLocalizedAProposCopy();
  const canonical = `${clientEnv.appUrl}/a-propos`;

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: copy.metadata.title,
      description: copy.metadata.description,
      url: canonical,
      type: "website",
    },
  };
}

export default async function AProposPage() {
  const copy = await getLocalizedAProposCopy();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-20 xl:px-0">
      {/* Header éditorial */}
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {copy.eyebrow}
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          {copy.title}
        </h1>
      </header>

      {/* Corps éditorial */}
      <div className="space-y-10 text-base leading-relaxed text-foreground">
        {copy.sections.map((section, index) => (
          <div key={section.title} className="space-y-10">
            {index > 0 ? <div className="h-px bg-surface-border/60" /> : null}
            <section>
              <h2 className="mb-4 font-serif text-2xl font-light tracking-tight">
                {section.title}
              </h2>
              <p className="text-muted-foreground">{section.body}</p>
            </section>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="mt-16 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <Link
          href={copy.ctaPrimary.href}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
        >
          {copy.ctaPrimary.label}
        </Link>
        <Link
          href={copy.ctaSecondary.href}
          className="inline-flex items-center justify-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          {copy.ctaSecondary.label}
        </Link>
      </div>
    </div>
  );
}
