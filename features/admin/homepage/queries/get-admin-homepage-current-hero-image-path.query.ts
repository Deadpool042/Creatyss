import { HomepageSectionType } from "@/prisma-generated/client";
import { db } from "@/core/db";

const HERO_SECTION_CODE = "hero";

export async function getAdminHomepageCurrentHeroImagePath(id: string): Promise<string | null> {
  const heroSection = await db.homepageSection.findFirst({
    where: {
      homepageId: id,
      archivedAt: null,
      OR: [
        { code: HERO_SECTION_CODE },
        { type: HomepageSectionType.HERO },
      ],
    },
    select: {
      primaryImage: {
        select: {
          storageKey: true,
        },
      },
    },
  });

  return heroSection?.primaryImage?.storageKey ?? null;
}
