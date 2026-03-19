import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminPageShellProps = {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function AdminPageShell({
  eyebrow,
  title,
  description,
  actions,
  children,
  className,
}: AdminPageShellProps) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="flex items-end justify-between gap-4 border-b border-border/60 pb-6">
        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-brand">{eyebrow}</p>
          <h1 className="m-0">{title}</h1>
          {description ? (
            <p className="mt-4 leading-relaxed text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ?? null}
      </div>
      {children}
    </div>
  );
}
