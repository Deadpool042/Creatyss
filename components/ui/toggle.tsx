"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Toggle as TogglePrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-lg border border-control-border bg-control-surface text-sm font-medium whitespace-nowrap text-text-muted-strong shadow-control transition-all outline-none hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-[3px] focus-visible:ring-focus-ring/50 disabled:pointer-events-none disabled:border-control-border disabled:bg-interactive-disabled disabled:text-interactive-disabled-foreground disabled:opacity-100 aria-invalid:border-feedback-error-border aria-invalid:ring-feedback-error-surface aria-pressed:bg-control-surface-active aria-pressed:shadow-control-pressed data-[state=on]:border-control-border-strong data-[state=on]:bg-control-surface-selected data-[state=on]:text-foreground data-[state=on]:shadow-control-pressed [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "border-control-border bg-control-surface",
      },
      size: {
        default: "h-8 min-w-8 px-2",
        sm: "h-7 min-w-7 rounded-[min(var(--radius-md),12px)] px-1.5 text-[0.8rem]",
        lg: "h-9 min-w-9 px-2.5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };
