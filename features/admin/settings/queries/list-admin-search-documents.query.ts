import "server-only";

import { db } from "@/core/db";
import { getCurrentStoreId } from "@/features/admin/store/queries/get-current-store-id.query";

const SEARCH_DOCUMENTS_LIMIT = 24;

export type AdminSearchDocumentSummary = {
  id: string;
  subjectType: string;
  subjectId: string;
  localeCode: string | null;
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  indexedTextPreview: string;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

export type AdminSearchDocumentsSnapshot = {
  overview: {
    totalDocuments: number;
    activeDocuments: number;
    localizedDocuments: number;
    indexedSubjectTypes: number;
  };
  documents: AdminSearchDocumentSummary[];
};

function buildIndexedTextPreview(indexedText: string): string {
  const normalized = indexedText.replace(/\s+/g, " ").trim();
  return normalized.length > 180 ? `${normalized.slice(0, 177)}...` : normalized;
}

export async function listAdminSearchDocuments(): Promise<AdminSearchDocumentsSnapshot> {
  const storeId = await getCurrentStoreId();

  if (storeId === null) {
    return {
      overview: {
        totalDocuments: 0,
        activeDocuments: 0,
        localizedDocuments: 0,
        indexedSubjectTypes: 0,
      },
      documents: [],
    };
  }

  const where = {
    storeId,
    archivedAt: null,
  };

  const [totalDocuments, activeDocuments, localizedDocuments, subjectTypes, documents] = await Promise.all([
    db.searchDocument.count({ where }),
    db.searchDocument.count({
      where: {
        ...where,
        status: "ACTIVE",
      },
    }),
    db.searchDocument.count({
      where: {
        ...where,
        localeCode: {
          not: null,
        },
      },
    }),
    db.searchDocument.findMany({
      where,
      distinct: ["subjectType"],
      select: {
        subjectType: true,
      },
    }),
    db.searchDocument.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      take: SEARCH_DOCUMENTS_LIMIT,
      select: {
        id: true,
        subjectType: true,
        subjectId: true,
        localeCode: true,
        status: true,
        indexedText: true,
        publishedAt: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
  ]);

  return {
    overview: {
      totalDocuments,
      activeDocuments,
      localizedDocuments,
      indexedSubjectTypes: subjectTypes.length,
    },
    documents: documents.map((document) => ({
      id: document.id,
      subjectType: document.subjectType,
      subjectId: document.subjectId,
      localeCode: document.localeCode,
      status: document.status,
      indexedTextPreview: buildIndexedTextPreview(document.indexedText),
      publishedAt: document.publishedAt,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    })),
  };
}
