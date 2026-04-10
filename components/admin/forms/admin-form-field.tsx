import { useId, type ReactNode } from "react";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { cn } from "@/lib/utils";

type AdminFormFieldProps = Readonly<{
  label: ReactNode;
  description?: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  className?: string;
  children: ReactNode | ((props: AdminFormFieldControlProps) => ReactNode);
}>;

type AdminFormFieldControlProps = Readonly<{
  "aria-describedby"?: string;
  "aria-errormessage"?: string;
  "aria-invalid"?: true;
  required?: true;
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
  const fieldId = useId();
  const hasError = error !== undefined && error !== null && error !== false;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = hasError ? `${fieldId}-error` : undefined;
  const describedBy = [descriptionId, hintId, errorId].filter(Boolean).join(" ") || undefined;
  const controlProps: AdminFormFieldControlProps = {
    ...(describedBy ? { "aria-describedby": describedBy } : {}),
    ...(errorId
      ? {
          "aria-errormessage": errorId,
          "aria-invalid": true as const,
        }
      : {}),
    ...(required ? { required: true as const } : {}),
  };
  const resolvedChildren = typeof children === "function" ? children(controlProps) : children;

  return (
    <Field className={cn("gap-2", className)} data-invalid={hasError ? "true" : undefined}>
      <FieldLabel htmlFor={htmlFor} className="w-full text-xs font-medium text-foreground">
        {label}
        {required ? <span className="text-feedback-error-foreground"> *</span> : null}
      </FieldLabel>

      {description ? (
        <FieldDescription id={descriptionId} className="text-xs leading-5">
          {description}
        </FieldDescription>
      ) : null}

      <FieldContent className="gap-2">{resolvedChildren}</FieldContent>

      {hint ? (
        <FieldDescription id={hintId} className="text-xs leading-5">
          {hint}
        </FieldDescription>
      ) : null}

      {hasError ? (
        <FieldError
          id={errorId}
          className="rounded-lg border border-feedback-error-border bg-feedback-error-surface px-3 py-2 text-xs leading-5 text-feedback-error-foreground"
        >
          {error}
        </FieldError>
      ) : null}
    </Field>
  );
}
