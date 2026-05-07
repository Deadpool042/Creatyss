import { access, readFile, readdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { createScriptPrismaClient } from "./helpers/prisma-client";

type CliOptions = {
  apply: boolean;
  slug: string | null;
};

type LegacyAsset = {
  id: string;
  storeId: string | null;
  storageKey: string;
  publicUrl: string | null;
  references: Array<{
    subjectType: "PRODUCT" | "PRODUCT_VARIANT";
    subjectId: string;
    role: "PRIMARY" | "GALLERY" | "OTHER";
    sortOrder: number;
  }>;
};

type ProductSummary = {
  id: string;
  slug: string;
};

type VariantSummary = {
  id: string;
  sortOrder: number;
  externalReference: string | null;
  product: ProductSummary;
};

type PlannedUpdate = {
  id: string;
  storeId: string | null;
  from: string;
  to: string;
  strategy: "reference" | "slug-fallback";
  duplicateId: string | null;
};

function parseCliOptions(argv: readonly string[]): CliOptions {
  let apply = false;
  let slug: string | null = null;

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--apply") {
      apply = true;
      continue;
    }

    if (token === "--slug") {
      const next = argv[index + 1];

      if (!next || next.startsWith("--")) {
        throw new Error("Missing value for --slug");
      }

      slug = next.trim();
      index += 1;
      continue;
    }
  }

  return { apply, slug };
}

function normalizeLegacyStorageKey(storageKey: string): string {
  return storageKey.replace(/^\/+/, "").replace(/^uploads\//, "");
}

function isLegacyProductStorageKey(storageKey: string): boolean {
  const normalized = normalizeLegacyStorageKey(storageKey);
  return normalized.startsWith("products/");
}

function extractLegacyProductSlug(storageKey: string): string | null {
  const normalized = normalizeLegacyStorageKey(storageKey);
  const match = normalized.match(/^products\/([^/]+)\//);
  return match?.[1] ?? null;
}

function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

function toErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

async function fileExists(absolutePath: string): Promise<boolean> {
  try {
    await access(absolutePath);
    return true;
  } catch {
    return false;
  }
}

function parseVariantNumericId(value: string | null): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!/^\d+$/.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function buildCatalogIndexFromReference(reference: LegacyAsset["references"][number]): number {
  if (reference.role === "PRIMARY") {
    return 0;
  }

  if (reference.sortOrder < 0) {
    return 0;
  }

  return reference.sortOrder;
}

async function listWebpFilesRecursive(absoluteDirectory: string): Promise<string[]> {
  const entries = await readdir(absoluteDirectory, { withFileTypes: true });
  const files: string[] = [];

  for (const entry of entries) {
    const absolutePath = path.join(absoluteDirectory, entry.name);

    if (entry.isDirectory()) {
      const nestedFiles = await listWebpFilesRecursive(absolutePath);
      files.push(...nestedFiles);
      continue;
    }

    if (entry.isFile() && entry.name.toLowerCase().endsWith(".webp")) {
      files.push(absolutePath);
    }
  }

  return files;
}

async function computeFileSha256(absolutePath: string): Promise<string> {
  const content = await readFile(absolutePath);
  return createHash("sha256").update(content).digest("hex");
}

async function buildSlugFallbackIndex(
  uploadsRoot: string,
  slug: string
): Promise<{ byHash: Map<string, string[]>; orderedProductTargets: string[] }> {
  const slugRoot = path.join(uploadsRoot, "imports/woocommerce/products", slug);
  const exists = await fileExists(slugRoot);

  if (!exists) {
    return { byHash: new Map(), orderedProductTargets: [] };
  }

  const files = await listWebpFilesRecursive(slugRoot);
  const byHash = new Map<string, string[]>();
  const orderedProductTargets: string[] = [];

  for (const absolutePath of files) {
    const hash = await computeFileSha256(absolutePath);
    const relativeStorageKey = toPosixPath(path.relative(uploadsRoot, absolutePath));
    const current = byHash.get(hash) ?? [];
    current.push(relativeStorageKey);
    byHash.set(hash, current);

    const productRootPattern = new RegExp(`^imports/woocommerce/products/${slug}/\\d{2}\\.webp$`);

    if (productRootPattern.test(relativeStorageKey)) {
      orderedProductTargets.push(relativeStorageKey);
    }
  }

  orderedProductTargets.sort((left, right) => left.localeCompare(right));

  return { byHash, orderedProductTargets };
}

async function resolveCandidateBySlugFallback(input: {
  asset: LegacyAsset;
  slug: string;
  uploadsRoot: string;
  indexByHash: Map<string, string[]>;
  orderedProductTargets: string[];
  usedTargets: Set<string>;
}): Promise<{ candidateStorageKey: string | null; reason: string | null }> {
  const pickNextAvailableTarget = (): string | null => {
    const next = input.orderedProductTargets.find((candidate) => !input.usedTargets.has(candidate));
    if (!next) {
      return null;
    }

    input.usedTargets.add(next);
    return next;
  };

  const storageSlug = extractLegacyProductSlug(input.asset.storageKey);

  if (storageSlug !== input.slug) {
    return { candidateStorageKey: null, reason: "legacy storageKey slug mismatch" };
  }

  const normalizedLegacyStorageKey = normalizeLegacyStorageKey(input.asset.storageKey);
  const legacyAbsolutePath = path.join(input.uploadsRoot, normalizedLegacyStorageKey);
  const sourceExists = await fileExists(legacyAbsolutePath);

  if (!sourceExists) {
    const candidateStorageKey = pickNextAvailableTarget();

    if (!candidateStorageKey) {
      return {
        candidateStorageKey: null,
        reason: "legacy file not found on disk and no fallback slot",
      };
    }

    return {
      candidateStorageKey,
      reason: "legacy file not found on disk; assigned by slug fallback slot",
    };
  }

  const sourceHash = await computeFileSha256(legacyAbsolutePath);
  const hashMatches = input.indexByHash.get(sourceHash) ?? [];

  if (hashMatches.length === 0) {
    const candidateStorageKey = pickNextAvailableTarget();

    if (!candidateStorageKey) {
      return {
        candidateStorageKey: null,
        reason: "no hash match in slug canonical files and no fallback slot",
      };
    }

    return {
      candidateStorageKey,
      reason: "no hash match in slug canonical files; assigned by slug fallback slot",
    };
  }

  const availableMatches = hashMatches.filter((candidate) => !input.usedTargets.has(candidate));

  if (availableMatches.length !== 1) {
    const reason =
      availableMatches.length === 0
        ? "hash match already consumed by another fallback candidate"
        : "ambiguous hash match in slug canonical files";

    return { candidateStorageKey: null, reason };
  }

  const candidateStorageKey = availableMatches[0];

  if (!candidateStorageKey) {
    return { candidateStorageKey: null, reason: "missing hash match candidate" };
  }

  input.usedTargets.add(candidateStorageKey);

  return { candidateStorageKey, reason: null };
}

async function main(): Promise<void> {
  const options = parseCliOptions(process.argv.slice(2));
  const prisma = createScriptPrismaClient();
  const uploadsRoot = path.resolve(process.cwd(), "public/uploads");

  try {
    const candidates = await prisma.mediaAsset.findMany({
      where: {
        archivedAt: null,
        status: { not: "ARCHIVED" },
        OR: [
          { storageKey: { startsWith: "products/" } },
          { storageKey: { startsWith: "uploads/products/" } },
        ],
      },
      select: {
        id: true,
        storeId: true,
        storageKey: true,
        publicUrl: true,
        references: {
          where: {
            isActive: true,
            subjectType: { in: ["PRODUCT", "PRODUCT_VARIANT"] },
          },
          select: {
            subjectType: true,
            subjectId: true,
            role: true,
            sortOrder: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    const legacyAssets: LegacyAsset[] = candidates
      .filter((asset) => isLegacyProductStorageKey(asset.storageKey))
      .map((asset) => ({
        id: asset.id,
        storeId: asset.storeId,
        storageKey: asset.storageKey,
        publicUrl: asset.publicUrl,
        references: asset.references.map((reference) => ({
          subjectType: reference.subjectType as "PRODUCT" | "PRODUCT_VARIANT",
          subjectId: reference.subjectId,
          role: reference.role as "PRIMARY" | "GALLERY" | "OTHER",
          sortOrder: reference.sortOrder,
        })),
      }));

    const productIds = new Set<string>();
    const variantIds = new Set<string>();

    for (const asset of legacyAssets) {
      for (const reference of asset.references) {
        if (reference.subjectType === "PRODUCT") {
          productIds.add(reference.subjectId);
        }

        if (reference.subjectType === "PRODUCT_VARIANT") {
          variantIds.add(reference.subjectId);
        }
      }
    }

    const [products, variants] = await Promise.all([
      prisma.product.findMany({
        where: { id: { in: [...productIds] } },
        select: { id: true, slug: true },
      }),
      prisma.productVariant.findMany({
        where: { id: { in: [...variantIds] } },
        select: {
          id: true,
          sortOrder: true,
          externalReference: true,
          product: { select: { id: true, slug: true } },
        },
      }),
    ]);

    const productById = new Map<string, ProductSummary>(
      products.map((product) => [product.id, product])
    );
    const variantById = new Map<string, VariantSummary>(
      variants.map((variant) => [variant.id, variant])
    );

    const updates: Array<{
      id: string;
      storeId: string | null;
      from: string;
      to: string;
      strategy: "reference" | "slug-fallback";
    }> = [];
    const unresolved: Array<{ id: string; storageKey: string; reason: string }> = [];
    const slugFallbackContext =
      options.slug === null
        ? { byHash: new Map<string, string[]>(), orderedProductTargets: [] }
        : await buildSlugFallbackIndex(uploadsRoot, options.slug);
    const usedSlugFallbackTargets = new Set<string>();
    let resolvedByReference = 0;
    let resolvedBySlugFallback = 0;

    for (const asset of legacyAssets) {
      const variantReference = asset.references.find(
        (reference) => reference.subjectType === "PRODUCT_VARIANT"
      );

      let candidateStorageKey: string | null = null;
      let relatedSlug: string | null = null;

      let resolutionStrategy: "reference" | "slug-fallback" | null = null;

      if (variantReference) {
        const variant = variantById.get(variantReference.subjectId);

        if (!variant) {
          unresolved.push({
            id: asset.id,
            storageKey: asset.storageKey,
            reason: "variant not found",
          });
          continue;
        }

        relatedSlug = variant.product.slug;

        const variantIdFromRef = parseVariantNumericId(variant.externalReference);
        const fallbackVariantKey = String(variant.sortOrder + 1).padStart(2, "0");
        const variantSuffix = variantIdFromRef ?? fallbackVariantKey;

        candidateStorageKey = `imports/woocommerce/products/${variant.product.slug}/variants/${variantSuffix}.webp`;
        resolutionStrategy = "reference";
      } else {
        const productReference = asset.references.find(
          (reference) => reference.subjectType === "PRODUCT"
        );

        if (!productReference) {
          if (options.slug) {
            const fallback = await resolveCandidateBySlugFallback({
              asset,
              slug: options.slug,
              uploadsRoot,
              indexByHash: slugFallbackContext.byHash,
              orderedProductTargets: slugFallbackContext.orderedProductTargets,
              usedTargets: usedSlugFallbackTargets,
            });

            if (fallback.candidateStorageKey) {
              relatedSlug = options.slug;
              candidateStorageKey = fallback.candidateStorageKey;
              resolutionStrategy = "slug-fallback";
            } else {
              unresolved.push({
                id: asset.id,
                storageKey: asset.storageKey,
                reason: `no product/variant reference; fallback failed: ${fallback.reason}`,
              });
              continue;
            }
          } else {
            unresolved.push({
              id: asset.id,
              storageKey: asset.storageKey,
              reason: "no product/variant reference",
            });
            continue;
          }
        }

        if (productReference) {
          const product = productById.get(productReference.subjectId);

          if (!product) {
            unresolved.push({
              id: asset.id,
              storageKey: asset.storageKey,
              reason: "product not found",
            });
            continue;
          }

          relatedSlug = product.slug;

          const bestRef = [...asset.references]
            .filter((reference) => reference.subjectType === "PRODUCT")
            .sort((left, right) => {
              const leftWeight = left.role === "PRIMARY" ? -1 : 0;
              const rightWeight = right.role === "PRIMARY" ? -1 : 0;

              if (leftWeight !== rightWeight) {
                return leftWeight - rightWeight;
              }

              return left.sortOrder - right.sortOrder;
            })[0];

          if (!bestRef) {
            unresolved.push({
              id: asset.id,
              storageKey: asset.storageKey,
              reason: "no product reference for ranking",
            });
            continue;
          }

          const index = buildCatalogIndexFromReference(bestRef);
          const filename = `${String(index + 1).padStart(2, "0")}.webp`;
          candidateStorageKey = `imports/woocommerce/products/${product.slug}/${filename}`;
          resolutionStrategy = "reference";
        }
      }

      if (options.slug && relatedSlug !== options.slug) {
        continue;
      }

      if (!candidateStorageKey) {
        unresolved.push({
          id: asset.id,
          storageKey: asset.storageKey,
          reason: "candidate storage key could not be computed",
        });
        continue;
      }

      const candidateAbsolutePath = path.join(uploadsRoot, candidateStorageKey);
      const exists = await fileExists(candidateAbsolutePath);

      if (!exists) {
        unresolved.push({
          id: asset.id,
          storageKey: asset.storageKey,
          reason: `missing file for candidate ${candidateStorageKey}`,
        });
        continue;
      }

      if (normalizeLegacyStorageKey(asset.storageKey) === candidateStorageKey) {
        continue;
      }

      updates.push({
        id: asset.id,
        storeId: asset.storeId,
        from: asset.storageKey,
        to: candidateStorageKey,
        strategy: resolutionStrategy ?? "reference",
      });

      if (resolutionStrategy === "reference") {
        resolvedByReference += 1;
      }

      if (resolutionStrategy === "slug-fallback") {
        resolvedBySlugFallback += 1;
      }
    }

    process.stdout.write(
      `[repair-legacy-media] scanned=${legacyAssets.length} candidates=${updates.length} resolvedByReference=${resolvedByReference} resolvedBySlugFallback=${resolvedBySlugFallback} unresolved=${unresolved.length} mode=${options.apply ? "apply" : "dry-run"}\n`
    );

    if (options.slug) {
      process.stdout.write(`[repair-legacy-media] slug-filter=${options.slug}\n`);
      process.stdout.write(
        `[repair-legacy-media] slug-fallback-canonical-hashes=${slugFallbackContext.byHash.size}\n`
      );
      process.stdout.write(
        `[repair-legacy-media] slug-fallback-canonical-targets=${slugFallbackContext.orderedProductTargets.length}\n`
      );
    }

    for (const update of updates.slice(0, 20)) {
      process.stdout.write(
        `[candidate:${update.strategy}] ${update.id} ${update.from} -> ${update.to}\n`
      );
    }

    if (unresolved.length > 0) {
      for (const entry of unresolved.slice(0, 20)) {
        process.stdout.write(`[unresolved] ${entry.id} ${entry.storageKey} (${entry.reason})\n`);
      }
    }

    const plannedUpdates: PlannedUpdate[] = [];

    for (const update of updates) {
      const duplicate = await prisma.mediaAsset.findFirst({
        where: {
          id: { not: update.id },
          storeId: update.storeId,
          storageKey: update.to,
        },
        select: { id: true, storageKey: true },
      });

      if (duplicate) {
        process.stdout.write(
          `[duplicate-target] ${update.id} ${update.from} -> ${update.to} target=${duplicate.id}\n`
        );
      }

      plannedUpdates.push({
        id: update.id,
        storeId: update.storeId,
        from: update.from,
        to: update.to,
        strategy: update.strategy,
        duplicateId: duplicate?.id ?? null,
      });
    }

    const plannedUpdated = plannedUpdates.filter((entry) => entry.duplicateId === null).length;
    const plannedDuplicateResolved = plannedUpdates.length - plannedUpdated;

    if (!options.apply || plannedUpdates.length === 0) {
      process.stdout.write(
        `[repair-legacy-media] updated=0 duplicateResolved=0 skippedDuplicate=0 unresolved=${unresolved.length} plannedUpdated=${plannedUpdated} plannedDuplicateResolved=${plannedDuplicateResolved}\n`
      );
      return;
    }

    let updated = 0;
    let duplicateResolved = 0;
    let skippedDuplicate = 0;

    for (const update of plannedUpdates) {
      const duplicateId = update.duplicateId;

      if (duplicateId) {
        try {
          const now = new Date();

          const migratedRefs = await prisma.$transaction(async (tx) => {
            const legacyReferences = await tx.mediaReference.findMany({
              where: {
                assetId: update.id,
                subjectType: { in: ["PRODUCT", "PRODUCT_VARIANT"] },
                isActive: true,
                archivedAt: null,
              },
              select: {
                subjectType: true,
                subjectId: true,
                role: true,
                sortOrder: true,
                isPrimary: true,
              },
            });

            for (const legacyReference of legacyReferences) {
              const existingReference = await tx.mediaReference.findFirst({
                where: {
                  assetId: duplicateId,
                  subjectType: legacyReference.subjectType,
                  subjectId: legacyReference.subjectId,
                  role: legacyReference.role,
                },
                select: { id: true },
              });

              if (existingReference) {
                await tx.mediaReference.update({
                  where: { id: existingReference.id },
                  data: {
                    sortOrder: legacyReference.sortOrder,
                    isPrimary: legacyReference.isPrimary,
                    isActive: true,
                    archivedAt: null,
                  },
                });
                continue;
              }

              await tx.mediaReference.create({
                data: {
                  assetId: duplicateId,
                  subjectType: legacyReference.subjectType,
                  subjectId: legacyReference.subjectId,
                  role: legacyReference.role,
                  sortOrder: legacyReference.sortOrder,
                  isPrimary: legacyReference.isPrimary,
                  isActive: true,
                },
              });
            }

            await tx.mediaReference.updateMany({
              where: {
                assetId: update.id,
                subjectType: { in: ["PRODUCT", "PRODUCT_VARIANT"] },
              },
              data: {
                isActive: false,
                archivedAt: now,
              },
            });

            await tx.mediaAsset.update({
              where: { id: update.id },
              data: {
                status: "ARCHIVED",
                isPublic: false,
                archivedAt: now,
              },
            });

            return legacyReferences.length;
          });

          duplicateResolved += 1;
          process.stdout.write(
            `[duplicate-resolved] ${update.id} target=${duplicateId} refsMigrated=${migratedRefs}\n`
          );
        } catch (error: unknown) {
          skippedDuplicate += 1;
          process.stdout.write(
            `[skipped-duplicate] ${update.id} target=${update.to} existing=${duplicateId} reason=${toErrorMessage(error)}\n`
          );
        }

        continue;
      }

      await prisma.mediaAsset.update({
        where: { id: update.id },
        data: {
          storageKey: update.to,
          publicUrl: `/uploads/${update.to}`,
        },
      });

      updated += 1;
    }

    process.stdout.write(
      `[repair-legacy-media] updated=${updated} duplicateResolved=${duplicateResolved} skippedDuplicate=${skippedDuplicate} unresolved=${unresolved.length} plannedUpdated=${plannedUpdated} plannedDuplicateResolved=${plannedDuplicateResolved}\n`
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
