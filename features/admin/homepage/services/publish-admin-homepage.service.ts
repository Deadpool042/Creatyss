import { HomepageStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { AdminHomepageServiceError } from "../types";

const CANONICAL_STORE_CODE = "creatyss";

type PublishAdminHomepageInput = {
  id: string;
};

export async function publishAdminHomepage(
  input: PublishAdminHomepageInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    const store = await tx.store.findUnique({
      where: {
        code: CANONICAL_STORE_CODE,
      },
      select: {
        id: true,
      },
    });

    if (store === null) {
      throw new Error(`canonical_store_missing:${CANONICAL_STORE_CODE}`);
    }

    const homepage = await tx.homepage.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
        archivedAt: null,
      },
      select: {
        id: true,
        publishedAt: true,
      },
    });

    if (homepage === null) {
      throw new AdminHomepageServiceError("homepage_missing");
    }

    return tx.homepage.update({
      where: {
        id: homepage.id,
      },
      data: {
        status: HomepageStatus.ACTIVE,
        publishedAt: homepage.publishedAt ?? new Date(),
      },
      select: {
        id: true,
      },
    });
  });
}
