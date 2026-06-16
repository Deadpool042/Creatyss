"use server";

import { requireAuthenticatedAdmin } from "@/core/auth/admin/guard";
import { meetsFeatureLevel } from "@/features/feature-flags/queries/get-feature-level-state.query";
import { requestBlogPostSeoSuggestion } from "@/features/ai-assistance/services/request-blog-post-seo-suggestion.service";

export type BlogPostSeoSuggestionActionState = {
  status: "idle" | "success" | "error";
  message: string | null;
  suggestionTitle: string;
  suggestionDescription: string;
  taskId: string | null;
  strategy: string | null;
};

function buildInitialState(): BlogPostSeoSuggestionActionState {
  return {
    status: "idle",
    message: null,
    suggestionTitle: "",
    suggestionDescription: "",
    taskId: null,
    strategy: null,
  };
}

export async function requestBlogPostSeoSuggestionAction(
  _prevState: BlogPostSeoSuggestionActionState,
  formData: FormData
): Promise<BlogPostSeoSuggestionActionState> {
  const featureEnabled = await meetsFeatureLevel("ai.core", "assistant");

  if (!featureEnabled) {
    return {
      ...buildInitialState(),
      status: "error",
      message: "La suggestion SEO IA blog n'est pas active pour cette boutique.",
    };
  }

  const postId = formData.get("postId");

  if (typeof postId !== "string" || postId.trim().length === 0) {
    return {
      ...buildInitialState(),
      status: "error",
      message: "Article introuvable.",
    };
  }

  const admin = await requireAuthenticatedAdmin();

  try {
    const suggestion = await requestBlogPostSeoSuggestion({
      postId: postId.trim(),
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
