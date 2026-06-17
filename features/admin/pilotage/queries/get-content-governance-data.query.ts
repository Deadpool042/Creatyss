import "server-only";

import { db } from "@/core/db";

export type BlogGovernanceData = Readonly<{
  total: number;
  active: number;
  draft: number;
}>;

export type HomepageGovernanceData = Readonly<{
  totalSections: number;
  totalBlocks: number;
}>;

export type ContentSeoGovernanceData = Readonly<{
  totalMeta: number;
  activeMeta: number;
}>;

export async function getBlogGovernanceData(): Promise<BlogGovernanceData | null> {
  try {
    const [total, active, draft] = await Promise.all([
      db.blogPost.count(),
      db.blogPost.count({ where: { status: "ACTIVE" } }),
      db.blogPost.count({ where: { status: "DRAFT" } }),
    ]);

    return { total, active, draft };
  } catch {
    return null;
  }
}

export async function getHomepageGovernanceData(): Promise<HomepageGovernanceData | null> {
  try {
    const [totalSections, totalBlocks] = await Promise.all([
      db.pageSection.count(),
      db.pageBlock.count(),
    ]);

    return { totalSections, totalBlocks };
  } catch {
    return null;
  }
}

export async function getContentSeoGovernanceData(): Promise<ContentSeoGovernanceData | null> {
  try {
    const [totalMeta, activeMeta] = await Promise.all([
      db.seoMetadata.count(),
      db.seoMetadata.count({ where: { status: "ACTIVE" } }),
    ]);

    return { totalMeta, activeMeta };
  } catch {
    return null;
  }
}
