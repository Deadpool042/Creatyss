import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type AdminFormFieldProps = Readonly<{
  label: ReactNode;
  htmlFor?: string;
  description?: ReactNode;
  className?: string;
  children: ReactNode;
}>;

export function AdminFormField({
  label,
  htmlFor,
  description,
  className,
  children
}: AdminFormFieldProps) {
  return (
    <div className={cn("admin-field grid gap-2", className)}>
      <Label
        className="text-sm font-medium leading-5 text-foreground"
        htmlFor={htmlFor}>
        {label}
      </Label>

      {description ? (
        <p className="text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      ) : null}

      {children}
    </div>
  );
}
