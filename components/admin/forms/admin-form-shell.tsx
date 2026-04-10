//components/admin/forms/admin-form-shell.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import { ChevronLeftSquareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

type AdminFormShellProps = {
  backHref: string;
  backLabel: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer: ReactNode;
  contentClassName?: string;
};

export function AdminFormShell({
  backHref,
  backLabel,
  title,
  description,
  children,
  footer,
  contentClassName,
}: AdminFormShellProps) {
  return (
    <div className="flex h-full flex-col bg-page-background text-page-foreground">
      <div className="shrink-0 border-b border-surface-border bg-card px-6 py-5 shadow-card">
        <Button variant="outline" type="button" size="sm" asChild>
          <Link href={backHref} className="inline-flex items-center gap-2">
            <ChevronLeftSquareIcon className="h-4 w-4" />
            {backLabel}
          </Link>
        </Button>

        <h2 className="mt-4 text-sm font-semibold">{title}</h2>

        {description ? <p className="mt-0.5 text-xs text-muted-foreground">{description}</p> : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className={contentClassName ?? "mx-auto max-w-xl space-y-5 px-6 py-6"}>{children}</div>
      </div>

      <div className="site-header-blur flex shrink-0 items-center justify-end gap-3 border-t border-shell-border px-6 py-4 shadow-card">
        {footer}
      </div>
    </div>
  );
}
