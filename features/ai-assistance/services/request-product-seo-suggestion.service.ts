import "server-only";

import { db } from "@/core/db";
import { buildSeoDescription, toSeoPlainText } from "@/entities/product/seo-text";
import {
  SEO_META_DESCRIPTION_SOFT_LIMIT,
  SEO_META_TITLE_SOFT_LIMIT,
  normalizeSeoText,
} from "@/entities/seo";

const SITE_NAME = "Creatyss";
const PRODUCT_SUBJECT_TYPE = "PRODUCT";
const LOCAL_SEO_SUGGESTION_STRATEGY = "local-seo-suggestion-v1";

export class ProductSeoSuggestionServiceError extends Error {
  readonly code:
    | "product_not_found"
    | "product_archived"
    | "task_create_failed"
    | "task_update_failed";

  constructor(
    code:
      | "product_not_found"
      | "product_archived"
      | "task_create_failed"
      | "task_update_failed",
    message: string
  ) {
    super(message);
    this.name = "ProductSeoSuggestionServiceError";
    this.code = code;
  }
}

type RequestProductSeoSuggestionInput = {
  productId: string;
  requestedByUserId: string;
};

export type ProductSeoSuggestionResult = {
  taskId: string;
  seoTitle: string;
  seoDescription: string;
  strategy: typeof LOCAL_SEO_SUGGESTION_STRATEGY;
};

function truncateText(input: string, maxLength: number): string {
  const normalized = normalizeSeoText(input);

  if (normalized.length <= maxLength) {
    return normalized;
  }

  const slice = normalized.slice(0, maxLength);
  const lastSpace = slice.lastIndexOf(" ");

  if (lastSpace > 24) {
    return slice.slice(0, lastSpace).trim();
  }

  return slice.trim();
}

function buildSeoTitle(input: {
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
}): string {
  const hook = toSeoPlainText(input.marketingHook);
  const shortDescription = toSeoPlainText(input.shortDescription);

  const candidateTitles = [
    hook.length > 0 ? `${input.name} - ${hook} | ${SITE_NAME}` : "",
    shortDescription.length > 0 ? `${input.name} - ${shortDescription} | ${SITE_NAME}` : "",
    `${input.name} | ${SITE_NAME}`,
  ].filter((value) => value.trim().length > 0);

  const fittingCandidate =
    candidateTitles.find((candidate) => normalizeSeoText(candidate).length <= SEO_META_TITLE_SOFT_LIMIT) ??
    candidateTitles[candidateTitles.length - 1] ??
    `${input.name} | ${SITE_NAME}`;

  return truncateText(fittingCandidate, SEO_META_TITLE_SOFT_LIMIT);
}

function buildSuggestionInputText(input: {
  name: string;
  marketingHook: string | null;
  shortDescription: string | null;
  description: string | null;
}): string {
  return [
    `Produit: ${input.name}`,
    input.marketingHook ? `Accroche: ${toSeoPlainText(input.marketingHook)}` : null,
    input.shortDescription ? `Description courte: ${toSeoPlainText(input.shortDescription)}` : null,
    input.description ? `Description: ${toSeoPlainText(input.description)}` : null,
  ]
    .filter((value): value is string => value !== null && value.trim().length > 0)
    .join("\n");
}

export async function requestProductSeoSuggestion(
  input: RequestProductSeoSuggestionInput
): Promise<ProductSeoSuggestionResult> {
  const product = await db.product.findUnique({
    where: { id: input.productId },
    select: {
      id: true,
      storeId: true,
      archivedAt: true,
      name: true,
      marketingHook: true,
      shortDescription: true,
      description: true,
    },
  });

  if (product === null) {
    throw new ProductSeoSuggestionServiceError("product_not_found", "Product not found.");
  }

  if (product.archivedAt !== null) {
    throw new ProductSeoSuggestionServiceError("product_archived", "Product is archived.");
  }

  const inputText = buildSuggestionInputText({
    name: product.name,
    marketingHook: product.marketingHook,
    shortDescription: product.shortDescription,
    description: product.description,
  });

  let taskId: string;

  try {
    const task = await db.aiTask.create({
      data: {
        storeId: product.storeId,
        type: "SEO_SUGGESTION",
        status: "RUNNING",
        subjectType: PRODUCT_SUBJECT_TYPE,
        subjectId: product.id,
        inputText,
        inputJson: JSON.stringify({
          strategy: LOCAL_SEO_SUGGESTION_STRATEGY,
          productId: product.id,
          name: product.name,
          marketingHook: product.marketingHook,
          shortDescription: product.shortDescription,
        }),
        requestedByUserId: input.requestedByUserId,
        startedAt: new Date(),
      },
      select: {
        id: true,
      },
    });

    taskId = task.id;
  } catch {
    throw new ProductSeoSuggestionServiceError(
      "task_create_failed",
      "Unable to create AI task."
    );
  }

  try {
    const seoTitle = buildSeoTitle({
      name: product.name,
      marketingHook: product.marketingHook,
      shortDescription: product.shortDescription,
    });
    const seoDescription = buildSeoDescription({
      candidates: [
        product.marketingHook
          ? `${toSeoPlainText(product.marketingHook)}. ${toSeoPlainText(product.shortDescription)}`
          : null,
        product.shortDescription,
        product.description,
      ],
      defaultValue: `${product.name} disponible chez ${SITE_NAME}.`,
      maxLength: SEO_META_DESCRIPTION_SOFT_LIMIT,
    });

    await db.aiTask.update({
      where: { id: taskId },
      data: {
        status: "SUCCEEDED",
        outputText: `Titre SEO: ${seoTitle}\nDescription SEO: ${seoDescription}`,
        outputJson: JSON.stringify({
          strategy: LOCAL_SEO_SUGGESTION_STRATEGY,
          seoTitle,
          seoDescription,
          reviewRequired: true,
        }),
        finishedAt: new Date(),
      },
    });

    return {
      taskId,
      seoTitle,
      seoDescription,
      strategy: LOCAL_SEO_SUGGESTION_STRATEGY,
    };
  } catch {
    await db.aiTask
      .update({
        where: { id: taskId },
        data: {
          status: "FAILED",
          errorCode: "local_generation_failed",
          errorMessage: "Local SEO suggestion failed.",
          finishedAt: new Date(),
        },
      })
      .catch(() => {
        throw new ProductSeoSuggestionServiceError(
          "task_update_failed",
          "Unable to update AI task."
        );
      });

    throw new ProductSeoSuggestionServiceError(
      "task_update_failed",
      "Unable to generate SEO suggestion."
    );
  }
}
