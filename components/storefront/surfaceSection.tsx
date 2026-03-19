import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type SurfaceSectionProps = Readonly<{
  as?: "section" | "article" | "div";
  eyebrow?: string;
  title?: string;
  titleAs?: "h2" | "h3";
  headerActions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}>;

export function SurfaceSection({
  as = "section",
  eyebrow,
  title,
  titleAs = "h2",
  headerActions,
  children,
  className,
  contentClassName,
}: SurfaceSectionProps) {
  const Tag = as as ElementType;
  const TitleTag = titleAs as ElementType;
  const hasHeader = eyebrow || title || headerActions;

  return (
    <Tag
      className={cn(
        "w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft min-[700px]:p-10",
        className
      )}
    >
      {hasHeader ? (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div className="grid gap-2">
            {eyebrow ? (
              <p className="text-sm font-bold uppercase tracking-widest text-brand">{eyebrow}</p>
            ) : null}

            {title ? <TitleTag>{title}</TitleTag> : null}
          </div>

          {headerActions ? <div className="shrink-0">{headerActions}</div> : null}
        </div>
      ) : null}

      <div className={cn(contentClassName)}>{children}</div>
    </Tag>
  );
}
