import type { InputHTMLAttributes, JSX } from "react";

import { cn } from "@/lib/utils";

type AdminCheckboxFieldProps = Readonly<{
  label: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, "type">;
  className?: string;
}>;

export function AdminCheckboxField({
  label,
  inputProps,
  className,
}: AdminCheckboxFieldProps): JSX.Element {
  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-2xl border border-surface-border bg-surface-panel-soft px-4 py-3 text-sm text-foreground",
        className
      )}
    >
      <input className="size-4" type="checkbox" {...inputProps} />
      <span>{label}</span>
    </label>
  );
}
