import * as React from "react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

type CustomButtonProps = React.ComponentProps<typeof Button> & {
  loading?: boolean;
  loadingText?: React.ReactNode;
  spinnerPosition?: "start" | "end";
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
};

export function CustomButton({
  loading = false,
  loadingText,
  spinnerPosition = "start",
  leadingIcon,
  trailingIcon,
  fullWidth = false,
  variant = "default",
  size = "default",
  className,
  disabled,
  children,
  asChild,
  ...props
}: CustomButtonProps) {
  const isDisabled = Boolean(disabled || loading);
  const resolvedContent = loading && loadingText !== undefined ? loadingText : children;
  const spinnerSizeClassName = size === "xs" || size === "icon-xs" ? "size-3" : "size-4";
  const spinnerAdornment = (
    <span
      data-icon={spinnerPosition === "end" ? "inline-end" : "inline-start"}
      className="inline-flex items-center justify-center"
    >
      <Spinner aria-hidden="true" className={spinnerSizeClassName} />
    </span>
  );

  if (asChild) {
    return (
      <Button
        {...props}
        asChild
        variant={variant}
        size={size}
        data-loading={loading ? "true" : undefined}
        aria-busy={loading ? "true" : undefined}
        aria-disabled={isDisabled ? "true" : undefined}
        className={cn(
          fullWidth && "w-full",
          isDisabled && "pointer-events-none opacity-50",
          className
        )}
      >
        {children}
      </Button>
    );
  }

  return (
    <Button
      {...props}
      variant={variant}
      size={size}
      disabled={isDisabled}
      data-loading={loading ? "true" : undefined}
      aria-busy={loading ? "true" : undefined}
      className={cn(
        fullWidth && "w-full",
        loading && "cursor-progress",
        className
      )}
    >
      {loading && spinnerPosition === "start"
        ? spinnerAdornment
        : !loading && leadingIcon ? (
        <span data-icon="inline-start" className="inline-flex items-center justify-center">
          {leadingIcon}
        </span>
        ) : null}

      {resolvedContent}

      {loading && spinnerPosition === "end"
        ? spinnerAdornment
        : !loading && trailingIcon ? (
        <span data-icon="inline-end" className="inline-flex items-center justify-center">
          {trailingIcon}
        </span>
        ) : null}
    </Button>
  );
}
