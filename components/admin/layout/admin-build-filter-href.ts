/**
 * Builds a filter URL for an admin split-view panel list.
 *
 * - Preserves `search` across filter changes.
 * - Sets or removes `status` and `sort` without mutating the source params.
 * - Strips `page` on any filter change (not relevant for panel lists, but kept consistent).
 * - Returns a clean URL without trailing `?` when no params remain.
 */
export function buildAdminFilterHref(
  listPath: string,
  params: { search?: string; status?: string; sort?: string }
): string {
  const url = new URLSearchParams();
  if (params.search) url.set("search", params.search);
  if (params.status) url.set("status", params.status);
  if (params.sort) url.set("sort", params.sort);
  const query = url.toString();
  return query ? `${listPath}?${query}` : listPath;
}
