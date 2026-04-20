import Image from "next/image";
import Link from "next/link";

import type { CatalogRelatedProductGroup } from "./index";

const MAX_ITEMS_PER_GROUP = 6;

type Props = {
  groups: CatalogRelatedProductGroup[];
  uploadsPublicPath: string;
};

export function ProductRelatedSection({ groups, uploadsPublicPath }: Props) {
  const visibleGroups = groups.filter((g) => g.products.length > 0);
  if (visibleGroups.length === 0) return null;

  return (
    <div className="space-y-10">
      {visibleGroups.map((group) => (
        <section key={group.type} aria-label={group.label}>
          <h2 className="text-xl font-semibold mb-4">{group.label}</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {group.products.slice(0, MAX_ITEMS_PER_GROUP).map((product) => {
              const imageUrl = product.imageFilePath
                ? `${uploadsPublicPath}/${product.imageFilePath.replace(/^\/+/, "")}`
                : null;

              return (
                <Link
                  key={product.id}
                  href={`/boutique/${product.slug}`}
                  className="group flex flex-col gap-2"
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-muted">
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={product.imageAltText ?? product.name}
                        width={240}
                        height={240}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                  <p className="text-sm font-medium leading-snug group-hover:underline">
                    {product.name}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
