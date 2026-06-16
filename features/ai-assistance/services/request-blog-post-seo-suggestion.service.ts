import "server-only";

import { db } from "@/core/db";
import { buildSeoDescription, toSeoPlainText } from "@/entities/product/seo-text";
import {
  SEO_META_DESCRIPTION_SOFT_LIMIT,
  SEO_META_TITLE_SOFT_LIMIT,
  normalizeSeoText,
} from "@/entities/seo";

const SITE_NAME = "Creatyss";
const BLOG_POST_SUBJECT_TYPE = "BLOG_POST";
const LOCAL_SEO_SUGGESTION_STRATEGY = "local-seo-suggestion-v1";

export class BlogPostSeoSuggestionServiceError extends Error {
  readonly code:
    | "blog_post_not_found"
    | "blog_post_archived"
    | "task_create_failed"
    | "task_update_failed";

  constructor(
    code:
      | "blog_post_not_found"
      | "blog_post_archived"
      | "task_create_failed"
      | "task_update_failed",
    message: string
  ) {
    super(message);
    this.name = "BlogPostSeoSuggestionServiceError";
    this.code = code;
  }
}

type RequestBlogPostSeoSuggestionInput = {
  postId: string;
  requestedByUserId: string;
};

export type BlogPostSeoSuggestionResult = {
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
  title: string;
  excerpt: string | null;
}): string {
  const excerpt = toSeoPlainText(input.excerpt);

  const candidateTitles = [
    excerpt.length > 0 ? `${input.title} - ${excerpt} | ${SITE_NAME}` : "",
    `${input.title} | ${SITE_NAME}`,
  ].filter((value) => value.trim().length > 0);

  const fittingCandidate =
    candidateTitles.find((candidate) => normalizeSeoText(candidate).length <= SEO_META_TITLE_SOFT_LIMIT) ??
    candidateTitles[candidateTitles.length - 1] ??
    `${input.title} | ${SITE_NAME}`;

  return truncateText(fittingCandidate, SEO_META_TITLE_SOFT_LIMIT);
}

function buildSuggestionInputText(input: {
  title: string;
  excerpt: string | null;
  content: string | null;
}): string {
  return [
    `Article: ${input.title}`,
    input.excerpt ? `Extrait: ${toSeoPlainText(input.excerpt)}` : null,
    input.content ? `Contenu: ${toSeoPlainText(input.content)}` : null,
  ]
    .filter((value): value is string => value !== null && value.trim().length > 0)
    .join("\n");
}

export async function requestBlogPostSeoSuggestion(
  input: RequestBlogPostSeoSuggestionInput
): Promise<BlogPostSeoSuggestionResult> {
  const post = await db.blogPost.findUnique({
    where: { id: input.postId },
    select: {
      id: true,
      storeId: true,
      archivedAt: true,
      title: true,
      excerpt: true,
      body: true,
    },
  });

  if (post === null) {
    throw new BlogPostSeoSuggestionServiceError("blog_post_not_found", "Blog post not found.");
  }

  if (post.archivedAt !== null) {
    throw new BlogPostSeoSuggestionServiceError("blog_post_archived", "Blog post is archived.");
  }

  const inputText = buildSuggestionInputText({
    title: post.title,
    excerpt: post.excerpt,
    content: post.body,
  });

  let taskId: string;

  try {
    const task = await db.aiTask.create({
      data: {
        storeId: post.storeId,
        type: "SEO_SUGGESTION",
        status: "RUNNING",
        subjectType: BLOG_POST_SUBJECT_TYPE,
        subjectId: post.id,
        inputText,
        inputJson: JSON.stringify({
          strategy: LOCAL_SEO_SUGGESTION_STRATEGY,
          postId: post.id,
          title: post.title,
          excerpt: post.excerpt,
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
    throw new BlogPostSeoSuggestionServiceError(
      "task_create_failed",
      "Unable to create AI task."
    );
  }

  try {
    const seoTitle = buildSeoTitle({
      title: post.title,
      excerpt: post.excerpt,
    });
    const seoDescription = buildSeoDescription({
      candidates: [post.excerpt, post.body],
      defaultValue: `${post.title} sur ${SITE_NAME}.`,
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
          errorMessage: "Local blog SEO suggestion failed.",
          finishedAt: new Date(),
        },
      })
      .catch(() => {
        throw new BlogPostSeoSuggestionServiceError(
          "task_update_failed",
          "Unable to update AI task."
        );
      });

    throw new BlogPostSeoSuggestionServiceError(
      "task_update_failed",
      "Unable to generate SEO suggestion."
    );
  }
}
