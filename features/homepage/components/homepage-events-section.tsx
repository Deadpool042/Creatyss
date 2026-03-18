import { SurfaceSection } from "@/components/storefront/surfaceSection";

export function HomepageEventsSection() {
  return (
    <SurfaceSection
      eyebrow="Événements"
      title="Retrouvez Creatyss lors de marchés et événements artisanaux">
      <div className="grid gap-5">
        <p className="leading-relaxed text-muted-foreground">
          Tout au long de l'année, Creatyss participe à des rendez-vous locaux
          pour présenter ses créations, rencontrer le public et partager
          l'univers de l'atelier. Une belle occasion de découvrir les pièces de
          près et d'échanger autour du fait main.
        </p>

        <div className="rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card">
          <p className="text-sm font-semibold text-brand">
            Prochain rendez-vous
          </p>
          <h3 className="mt-2">Marché artisanal de printemps</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Samedi 12 avril 2026 · Place du centre-ville · 10h à 18h
          </p>
          <p className="mt-3 leading-relaxed">
            Venez découvrir les créations Creatyss, échanger autour des pièces
            exposées et voir les détails de fabrication de plus près.
          </p>
        </div>
      </div>
    </SurfaceSection>
  );
}
