import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const SEO_SUGGESTION_LIMIT = 6;

type SeoSuggestionSubjectType = "PRODUCT" | "BLOG_POST";

export type SeoSuggestionHistoryEntry = {
  id: string;
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED" | "CANCELLED" | "EXPIRED" | "ARCHIVED";
  createdAt: Date;
  updatedAt: Date;
  finishedAt: Date | null;
  requestedByEmail: string | null;
  strategy: string | null;
  seoTitle: string;
  seoDescription: string;
  reviewRequired: boolean;
};

function readSuggestionPayload(
  outputJson: string | null
): Pick<SeoSuggestionHistoryEntry, "strategy" | "seoTitle" | "seoDescription" | "reviewRequired"> | null {
  if (outputJson === null || outputJson.trim().length === 0) {
    return null;
  }

  try {
    const parsed = JSON.parse(outputJson) as Record<string, unknown>;
    const seoTitle = typeof parsed.seoTitle === "string" ? parsed.seoTitle.trim() : "";
    const seoDescription =
      typeof parsed.seoDescription === "string" ? parsed.seoDescription.trim() : "";

    if (seoTitle.length === 0 || seoDescription.length === 0) {
      return null;
    }

    return {
      strategy: typeof parsed.strategy === "string" ? parsed.strategy : null,
      seoTitle,
      seoDescription,
      reviewRequired: parsed.reviewRequired === true,
    };
  } catch {
    return null;
  }
}

export async function listSeoSuggestionHistory(input: {
  subjectType: SeoSuggestionSubjectType;
  subjectId: string;
}): Promise<SeoSuggestionHistoryEntry[]> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return [];
  }

  const tasks = await db.aiTask.findMany({
    where: {
      type: "SEO_SUGGESTION",
      subjectType: input.subjectType,
      subjectId: input.subjectId,
      archivedAt: null,
      OR: [{ storeId }, { storeId: null }],
    },
    orderBy: [{ createdAt: "desc" }],
    take: SEO_SUGGESTION_LIMIT,
    select: {
      id: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      finishedAt: true,
      outputJson: true,
      requestedBy: {
        select: {
          email: true,
        },
      },
    },
  });

  return tasks.flatMap((task) => {
    const payload = readSuggestionPayload(task.outputJson);

    if (payload === null) {
      return [];
    }

    return [
      {
        id: task.id,
        status: task.status,
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
        finishedAt: task.finishedAt,
        requestedByEmail: task.requestedBy?.email ?? null,
        strategy: payload.strategy,
        seoTitle: payload.seoTitle,
        seoDescription: payload.seoDescription,
        reviewRequired: payload.reviewRequired,
      },
    ];
  });
}
