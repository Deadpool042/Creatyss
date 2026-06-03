import Link from "next/link";
import type { ComponentType } from "react";
import { ArrowRight, Construction } from "lucide-react";

import { cn } from "@/lib/utils";

type AdminComingSoonAction = {
  label: string;
  href: string;
};

type AdminComingSoonProps = {
  title: string;
  description: string;
  /** Référence doctrine ex: "docs/domains/optional/blog.md" */
  docRef?: string;
  /** Feature flags ou capabilities requises */
  requirements?: string[];
  /** Lien vers une autre section déjà disponible */
  fallbackAction?: AdminComingSoonAction;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
};

export function AdminComingSoon({
  title,
  description,
  docRef,
  requirements,
  fallbackAction,
  icon: Icon = Construction,
  className,
}: AdminComingSoonProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-xl flex-col items-center gap-5 px-4 py-16 text-center",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-surface-border/60 bg-surface-panel/70 shadow-sm backdrop-blur-sm">
        <Icon className="size-7 text-muted-foreground/50" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        <p className="text-sm leading-6 text-muted-foreground">{description}</p>
      </div>

      {requirements && requirements.length > 0 ? (
        <div className="rounded-xl border border-surface-border/40 bg-surface-panel/50 px-4 py-3 text-left">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70">
            Activation requise
          </p>
          <ul className="space-y-1">
            {requirements.map((req) => (
              <li key={req} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-1 shrink-0 rounded-full bg-muted-foreground/40" />
                {req}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {docRef ? (
        <p className="text-[11px] text-muted-foreground/50">
          Doctrine :{" "}
          <code className="rounded bg-surface-subtle px-1 py-0.5 font-mono">{docRef}</code>
        </p>
      ) : null}

      {fallbackAction ? (
        <Link
          href={fallbackAction.href}
          className="inline-flex items-center gap-1.5 rounded-full border border-surface-border/60 bg-surface-panel px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface-panel-soft"
        >
          {fallbackAction.label}
          <ArrowRight className="size-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
