import { brandConfig } from "@/core/config/brand";

export function OrientationGuard() {
  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-0 z-9999 hidden place-items-center bg-background px-6 text-center text-foreground [@media(orientation:landscape)_and_(max-height:500px)]:grid"
    >
      <div className="mx-auto max-w-sm space-y-3 rounded-2xl border border-shell-border bg-shell-surface p-6 shadow-overlay">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-brand">
          Mode portrait recommandé
        </p>
        <p className="text-lg font-semibold text-foreground">Tournez votre téléphone</p>
        <p className="text-sm leading-relaxed text-text-muted-strong">
          {brandConfig.orientationNotice}
        </p>
      </div>
    </div>
  );
}
