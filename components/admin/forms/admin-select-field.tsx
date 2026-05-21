import type { JSX, ReactNode, SelectHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type AdminSelectFieldProps = Readonly<{
  children: ReactNode;
  className?: string;
}> &
  SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelectField({
  children,
  className,
  ...props
}: AdminSelectFieldProps): JSX.Element {
  return (
    <select
      className={cn(
        "flex h-9 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
