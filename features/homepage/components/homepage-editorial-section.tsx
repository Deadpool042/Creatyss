import { SurfaceSection } from "@/components/shared";

import { homepageCopyConfig, type HomepageCopy } from "../config/homepage-copy.config";

type HomepageEditorialSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
  copy?: HomepageCopy;
};

export function HomepageEditorialSection({
  editorialText,
  editorialTitle,
  copy = homepageCopyConfig,
}: HomepageEditorialSectionProps) {
  return (
    <SurfaceSection
      eyebrow="Éditorial"
      title={editorialTitle ?? copy.editorial.fallbackTitle}
    >
      <p className="max-w-3xl leading-relaxed text-muted-foreground">
        {editorialText ?? copy.editorial.fallbackText}
      </p>
    </SurfaceSection>
  );
}
