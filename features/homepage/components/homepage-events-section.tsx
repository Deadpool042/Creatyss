import { SurfaceSection } from "@/components/shared";

import { homepageCopyConfig } from "../config/homepage-copy.config";

export function HomepageEventsSection() {
  return (
    <SurfaceSection
      eyebrow="Événements"
      title={homepageCopyConfig.events.title}
    >
      <div className="grid gap-5">
        <p className="leading-relaxed text-muted-foreground">
          {homepageCopyConfig.events.intro}
        </p>

        <div className="rounded-lg border border-surface-border bg-surface-panel-soft p-6 shadow-card">
          <p className="text-sm font-semibold text-brand">Prochain rendez-vous</p>
          <h3 className="mt-2">Marché artisanal de printemps</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Samedi 12 avril 2026 · Place du centre-ville · 10h à 18h
          </p>
          <p className="mt-3 leading-relaxed">{homepageCopyConfig.events.visitText}</p>
        </div>
      </div>
    </SurfaceSection>
  );
}
