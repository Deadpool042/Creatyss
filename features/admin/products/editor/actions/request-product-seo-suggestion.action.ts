"use server";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { requestProductSeoSuggestion } from "@/features/ai-assistance/services/request-product-seo-suggestion.service";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";

export type ProductSeoSuggestionActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  suggestionTitle: string;
  suggestionDescription: string;
  taskId: string | null;
  strategy: string | null;
};

function buildInitialState(): ProductSeoSuggestionActionState {
  return {
    status: "idle",
    message: null,
    suggestionTitle: "",
    suggestionDescription: "",
    taskId: null,
    strategy: null,
  };
}

export async function requestProductSeoSuggestionAction(
  _prevState: ProductSeoSuggestionActionState,
  formData: FormData
): Promise<ProductSeoSuggestionActionState> {
  const featureEnabled = await meetsFeatureLevel("ai.core", "basic");

  if (!featureEnabled) {
    return {
      ...buildInitialState(),
      status: "error",
      message: "La suggestion SEO IA n'est pas active pour cette boutique.",
    };
  }

  const productId = formData.get("productId");

  if (typeof productId !== "string" || productId.trim().length === 0) {
    return {
      ...buildInitialState(),
      status: "error",
      message: "Produit introuvable.",
    };
  }

  const admin = await requireAuthenticatedAdmin();

  try {
    const suggestion = await requestProductSeoSuggestion({
      productId: productId.trim(),
      requestedByUserId: admin.id,
    });

    return {
      status: "success",
      message: "Suggestion SEO prête. Relisez-la avant de l'appliquer.",
      suggestionTitle: suggestion.seoTitle,
      suggestionDescription: suggestion.seoDescription,
      taskId: suggestion.taskId,
      strategy: suggestion.strategy,
    };
  } catch {
    return {
      ...buildInitialState(),
      status: "error",
      message:
        "La suggestion SEO n'a pas pu être générée. L'édition manuelle reste disponible.",
    };
  }
}
