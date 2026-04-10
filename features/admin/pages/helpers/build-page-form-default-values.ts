import type { AdminPageDetail, AdminPageFormValues } from "../types";

export function buildPageFormDefaultValues(
  page?: AdminPageDetail | null,
): AdminPageFormValues {
  return {
    title: page?.title ?? "",
    slug: page?.slug ?? "",
    excerpt: page?.excerpt ?? "",
    body: page?.body ?? "",
    status: page?.status ?? "DRAFT",
  };
}
