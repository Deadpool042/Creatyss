import type { Metadata } from "next";
import Link from "next/link";

import { brandConfig } from "@/core/config/brand";
import { listCatalogFilterCategories } from "@/features/storefront/catalog";

export const metadata: Metadata = {
  title: `Catégories — ${brandConfig.name}`,
  description: brandConfig.categoriesPageDescription,
};

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  let categories: Awaited<ReturnType<typeof listCatalogFilterCategories>> = [];

  try {
    categories = await listCatalogFilterCategories();
  } catch (error) {
    console.error("[public/categories] listCatalogFilterCategories failed", error);
  }

  const rootCategories = categories.filter((c) => !c.parentId);

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-12 md:px-6 md:py-16 xl:px-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Collections
        </p>
        <h1 className="font-serif text-4xl font-light tracking-tight text-foreground md:text-5xl">
          Toutes les catégories
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          {brandConfig.categoriesPageIntro}
        </p>
      </div>

      {rootCategories.length === 0 ? (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">Aucune catégorie disponible.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rootCategories.map((category) => (
            <Link
              key={category.id}
              href={`/boutique?category=${category.slug}`}
              className="group flex flex-col gap-3 rounded-2xl border border-surface-border/60 bg-surface-panel/40 p-6 transition-colors hover:bg-surface-panel hover:border-surface-border"
            >
              <div className="flex size-10 items-center justify-center rounded-xl bg-surface-subtle text-2xl font-serif font-light text-muted-foreground">
                {category.name.charAt(0)}
              </div>
              <div>
                <h2 className="font-serif text-xl font-medium tracking-tight text-foreground group-hover:text-brand transition-colors">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">Voir la collection →</p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA vers boutique */}
      <div className="mt-12 text-center">
        <Link
          href="/boutique"
          className="inline-flex items-center gap-2 rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-foreground/5"
        >
          Voir toute la boutique
        </Link>
      </div>
    </div>
  );
}
