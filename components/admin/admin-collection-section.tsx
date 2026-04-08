import type { ReactNode } from "react";

import { SectionIntro } from "@/components/shared/section-intro";
import { cn } from "@/lib/utils";

type AdminCollectionSectionProps = Readonly<{
  eyebrow?: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  summary?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
  className?: string;
  panelClassName?: string;
  contentClassName?: string;
  variant?: "card" | "plain";
}>;

export function AdminCollectionSection({
  eyebrow,
  title,
  description,
  meta,
  summary,
  toolbar,
  children,
  className,
  panelClassName,
  contentClassName,
  variant = "card",
}: AdminCollectionSectionProps) {
  const isPlain = variant === "plain";
  const resolvedSummary =
    summary ??
    (eyebrow || title || description || meta ? (
      <div
        className={cn(
          "flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between",
          isPlain ? "gap-3" : "gap-4"
        )}
      >
        {title || description || eyebrow ? (
          <SectionIntro
            className={cn("grid", isPlain ? "gap-1.5" : "gap-1.5 sm:gap-2")}
            description={description}
            eyebrow={eyebrow}
            title={title}
            titleAs={isPlain ? "h3" : "h2"}
          />
        ) : null}

        {meta ? <div className="self-start lg:self-auto">{meta}</div> : null}
      </div>
    ) : null);
  const hasSummary =
    resolvedSummary !== undefined && resolvedSummary !== null && resolvedSummary !== false;
  const hasToolbar = toolbar !== undefined && toolbar !== null && toolbar !== false;
  const summaryPanelClassName =
    !isPlain && hasSummary && !hasToolbar
      ? "rounded-xl border border-surface-border bg-surface-panel-soft p-4 sm:p-5 lg:bg-card lg:shadow-card"
      : null;
  const toolbarPanelClassName = isPlain
    ? "px-0"
    : hasSummary
      ? "site-header-blur relative z-10 overflow-hidden rounded-xl border border-shell-border px-4 py-3 lg:shadow-card "
      : "relative z-10 overflow-hidden px-0 lg:rounded-xl lg:border lg:border-shell-border lg:p-3 lg:shadow-card lg:site-header-blur";

  return (
    <section className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {hasSummary ? (
        <div className={cn("min-w-0", summaryPanelClassName)}>{resolvedSummary}</div>
      ) : null}

      {hasToolbar ? (
        <div className={cn("min-w-0 ", toolbarPanelClassName, panelClassName)}>
          <div className={cn("grid", isPlain ? "gap-2" : "gap-3 px-0.5")}>{toolbar}</div>
        </div>
      ) : null}

      <div className={cn("min-w-0", contentClassName)}>{children}</div>
    </section>
  );
}
