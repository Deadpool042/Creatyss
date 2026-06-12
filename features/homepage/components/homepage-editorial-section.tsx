import { SurfaceSection } from "@/components/shared";

import { homepageCopyConfig } from "../config/homepage-copy.config";

type HomepageEditorialSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
};

export function HomepageEditorialSection({
  editorialText,
  editorialTitle,
}: HomepageEditorialSectionProps) {
  return (
    <SurfaceSection
      eyebrow="Éditorial"
      title={editorialTitle ?? homepageCopyConfig.editorial.fallbackTitle}
    >
      <p className="max-w-3xl leading-relaxed text-muted-foreground">
        {editorialText ?? homepageCopyConfig.editorial.fallbackText}
      </p>
    </SurfaceSection>
  );
}
