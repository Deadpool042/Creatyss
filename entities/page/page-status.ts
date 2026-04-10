export const pageStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export type PageStatus = (typeof pageStatuses)[number];

export function isPageStatus(value: string): value is PageStatus {
  return pageStatuses.includes(value as PageStatus);
}
