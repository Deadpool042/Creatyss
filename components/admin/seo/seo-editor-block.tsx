import type { JSX, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SeoEditorBlockProps = {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
};

export function SeoEditorBlock({
  title,
  description,
  children,
  className,
  contentClassName,
}: SeoEditorBlockProps): JSX.Element {
  return (
    <div
      className={cn(
        "rounded-2xl border border-surface-border bg-card p-4 shadow-card md:p-5",
        className
      )}
    >
      <div className="space-y-1">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description !== undefined && (
          <p className="text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>

      <div className={cn("mt-4", contentClassName)}>{children}</div>
    </div>
  );
}
