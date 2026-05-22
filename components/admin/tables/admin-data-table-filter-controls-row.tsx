import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminDataTableFilterControlsRowProps = {
  filters: ReactNode;
  trailing?: ReactNode;
  className?: string;
};

export function AdminDataTableFilterControlsRow({
  filters,
  trailing,
  className,
}: AdminDataTableFilterControlsRowProps) {
  return (
    <div className={cn("flex shrink-0 items-center gap-2", className)}>
      {filters}
      {trailing}
    </div>
  );
}
