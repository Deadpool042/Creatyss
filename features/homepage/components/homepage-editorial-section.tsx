import { SurfaceSection } from "@/components/layout/surfaceSection";

type HomepageEditorialSectionProps = {
  editorialTitle: string | null;
  editorialText: string | null;
};

export function HomepageEditorialSection({
  editorialText,
  editorialTitle
}: HomepageEditorialSectionProps) {
  return (
    <SurfaceSection
      eyebrow="Éditorial"
      title={editorialTitle ?? "L'atelier Creatyss"}>
      <p className="max-w-3xl leading-relaxed text-muted-foreground">
        {editorialText ??
          "Creatyss imagine et réalise des sacs faits main dans une démarche artisanale, attentive aux matières, aux détails et au temps nécessaire pour bien faire. Chaque création est pensée pour durer, avec une attention particulière portée à l'élégance, à l'usage et à la singularité de chaque pièce."}
      </p>
    </SurfaceSection>
  );
}
