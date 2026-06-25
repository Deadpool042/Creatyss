import type { Metadata } from "next";
import Link from "next/link";
import { MapPinIcon } from "lucide-react";

import { getLocalizedLesMarchesCopy } from "@/features/storefront/content/queries/get-localized-les-marches-copy.query";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const copy = await getLocalizedLesMarchesCopy();

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
  };
}

export default async function LesMarchesPage() {
  const copy = await getLocalizedLesMarchesCopy();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-12 md:px-6 md:py-20 xl:px-0">
      {/* Header */}
      <header className="mb-16 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {copy.eyebrow}
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          {copy.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {copy.intro}
        </p>
      </header>

      {/* Placeholder calendrier */}
      <div className="rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-8 text-center">
        <MapPinIcon className="mx-auto mb-4 size-8 text-muted-foreground/30" />
        <p className="font-serif text-xl font-light text-foreground">{copy.placeholder.title}</p>
        <p className="mt-2 text-sm text-muted-foreground">{copy.placeholder.body}</p>
        <p className="mt-4 text-xs text-muted-foreground/60">{copy.placeholder.note}</p>
      </div>

      {/* Infos atelier */}
      <div className="mt-12 space-y-4 text-sm text-muted-foreground">
        <div className="flex items-start gap-3">
          <MapPinIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
          <div>
            <p className="font-medium text-foreground">{copy.atelier.title}</p>
            <p>{copy.atelier.subtitle}</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-col gap-4 sm:flex-row">
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
