import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminFilterFieldProps = {
  label: string;
  children: ReactNode;
  className?: string;
  labelClassName?: string;
};

export function AdminFilterField({
  label,
  children,
  className,
  labelClassName,
}: AdminFilterFieldProps) {
  return (
    <div className={cn("grid gap-1.5", className)}>
      <p
        className={cn(
          "text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground/60",
          labelClassName
        )}
      >
        {label}
      </p>
      {children}
    </div>
  );
}
