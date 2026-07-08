import { HomepageStatus } from "@/prisma-generated/client";
import { withTransaction } from "@/core/db";
import { AdminHomepageServiceError } from "../types";
import { recordHomepagePublishedDomainEvent } from "./record-homepage-editorial-domain-events";

type PublishAdminHomepageInput = {
  id: string;
};

export async function publishAdminHomepage(
  input: PublishAdminHomepageInput
): Promise<{ id: string }> {
  return withTransaction(async (tx) => {
    // Convention socle : boutique unique, résolue comme premier store créé
    // (même convention que settings, panier et contact — cf. lot R5).
    const store = await tx.store.findFirst({
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
      },
    });

    if (store === null) {
      throw new Error("default_store_missing");
    }

    const homepage = await tx.homepage.findFirst({
      where: {
        id: input.id,
        storeId: store.id,
        archivedAt: null,
      },
      select: {
        id: true,
        storeId: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    if (homepage === null) {
      throw new AdminHomepageServiceError("homepage_missing");
    }

    const updatedHomepage = await tx.homepage.update({
      where: {
        id: homepage.id,
      },
      data: {
        status: HomepageStatus.ACTIVE,
        publishedAt: homepage.publishedAt ?? new Date(),
      },
      select: {
        id: true,
        title: true,
        status: true,
        publishedAt: true,
      },
    });

    await recordHomepagePublishedDomainEvent({
      executor: tx,
      storeId: homepage.storeId,
      previous: homepage,
      next: updatedHomepage,
    });

    return {
      id: updatedHomepage.id,
    };
  });
}
