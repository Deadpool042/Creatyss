//components/admin/forms/admin-form-actions.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type AdminFormActionsProps = Readonly<{
  children: ReactNode;
  className?: string;
}>;

export function AdminFormActions({ children, className }: AdminFormActionsProps) {
  return <div className={cn("flex flex-wrap items-center gap-3", className)}>{children}</div>;
}
