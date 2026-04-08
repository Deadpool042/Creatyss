import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminFormFieldProps = Readonly<{
  label: ReactNode;
  description?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode;
}>;

export function AdminFormField({
  label,
  htmlFor,
  description,
  hint,
  error,
  required = false,
  className,
  children,
}: AdminFormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label htmlFor={htmlFor} className="text-xs font-medium">
        {label}
        {required ? <span className="text-destructive"> *</span> : null}
      </Label>
      {description ? <p className="text-xs text-muted-foreground">{description}</p> : null}

      {children}

      {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
