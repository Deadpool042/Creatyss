import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma-client";
import { mapPageDetail, mapPageSummary, mapPageStatusToPrisma } from "@db-pages/helpers/mappers";
import {
  normalizePageSlug,
  parseCreateAdminPageInput,
  parseUpdateAdminPageInput,
  toPrismaPageSectionCreateManyInput,
} from "@db-pages/helpers/validation";
import {
  findPageSummaryRowById,
  listPageSummaryRowsByStoreId,
} from "@db-pages/queries/admin-page.queries";
import { findPageDetailRowById } from "@db-pages/queries/public-page.queries";
import {
  AdminPageRepositoryError,
  type AdminPageDetail,
  type AdminPageSummary,
  type CreateAdminPageInput,
  type UpdateAdminPageInput,
} from "@db-pages/admin";

function mapPageWriteError(error: unknown): never {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    throw new AdminPageRepositoryError(
      "page_slug_conflict",
      "Une page avec ce slug existe déjà pour cette boutique."
    );
  }

  throw error;
}

async function clearHomepageInStore(
  tx: Prisma.TransactionClient,
  storeId: string,
  excludePageId?: string
): Promise<void> {
  await tx.page.updateMany({
    where: {
      storeId,
      isHomepage: true,
      ...(excludePageId ? { id: { not: excludePageId } } : {}),
    },
    data: {
      isHomepage: false,
    },
  });
}

export async function listAdminPagesByStoreId(storeId: string): Promise<AdminPageSummary[]> {
  const rows = await listPageSummaryRowsByStoreId(storeId);
  return rows.map(mapPageSummary);
}

export async function findAdminPageById(id: string): Promise<AdminPageDetail | null> {
  const row = await findPageDetailRowById(id);
  return row ? mapPageDetail(row) : null;
}

export async function createAdminPage(input: CreateAdminPageInput): Promise<AdminPageDetail> {
  const parsedInput = parseCreateAdminPageInput(input);

  try {
    const created = await prisma.$transaction(async (tx) => {
      if (parsedInput.isHomepage) {
        await clearHomepageInStore(tx, parsedInput.storeId);
      }

      const data: Prisma.PageUncheckedCreateInput = {
        storeId: parsedInput.storeId,
        slug: normalizePageSlug(parsedInput.slug),
        title: parsedInput.title,
        description: parsedInput.description ?? null,
        status: mapPageStatusToPrisma(parsedInput.status),
        isHomepage: parsedInput.isHomepage,
      };

      if (parsedInput.sections.length > 0) {
        data.sections = {
          create: parsedInput.sections.map((section) => ({
            kind: section.kind,
            title: section.title,
            subtitle: section.subtitle,
            content: section.content,
            imageAssetId: section.imageAssetId,
            sortOrder: section.sortOrder,
            isEnabled: section.isEnabled,
          })),
        };
      }

      return tx.page.create({
        data,
        select: {
          id: true,
        },
      });
    });

    const row = await findPageDetailRowById(created.id);

    if (!row) {
      throw new AdminPageRepositoryError("page_not_found", "Page introuvable.");
    }

    return mapPageDetail(row);
  } catch (error) {
    mapPageWriteError(error);
  }
}

export async function updateAdminPage(
  input: UpdateAdminPageInput
): Promise<AdminPageDetail | null> {
  const parsedInput = parseUpdateAdminPageInput(input);
  const currentPage = await findPageSummaryRowById(parsedInput.id);

  if (!currentPage) {
    return null;
  }

  try {
    await prisma.$transaction(async (tx) => {
      if (parsedInput.isHomepage === true) {
        await clearHomepageInStore(tx, currentPage.storeId, currentPage.id);
      }

      const data: Prisma.PageUncheckedUpdateInput = {};

      if (parsedInput.slug !== undefined) {
        data.slug = normalizePageSlug(parsedInput.slug);
      }

      if (parsedInput.title !== undefined) {
        data.title = parsedInput.title;
      }

      if (parsedInput.description !== undefined) {
        data.description = parsedInput.description;
      }

      if (parsedInput.status !== undefined) {
        data.status = mapPageStatusToPrisma(parsedInput.status);
      }

      if (parsedInput.isHomepage !== undefined) {
        data.isHomepage = parsedInput.isHomepage;
      }

      if (Object.keys(data).length > 0) {
        await tx.page.update({
          where: {
            id: parsedInput.id,
          },
          data,
          select: {
            id: true,
          },
        });
      }

      if (parsedInput.sections !== undefined) {
        await tx.pageSection.deleteMany({
          where: {
            pageId: parsedInput.id,
          },
        });

        if (parsedInput.sections.length > 0) {
          await tx.pageSection.createMany({
            data: toPrismaPageSectionCreateManyInput(parsedInput.id, parsedInput.sections),
          });
        }
      }
    });

    const row = await findPageDetailRowById(parsedInput.id);
    return row ? mapPageDetail(row) : null;
  } catch (error) {
    mapPageWriteError(error);
  }
}

export async function setAdminPageStatus(
  id: string,
  status: "draft" | "active" | "archived"
): Promise<AdminPageDetail | null> {
  return updateAdminPage({ id, status });
}
