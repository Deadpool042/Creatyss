import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap outline-none select-none transition-all duration-200 ease-out focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 active:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-feedback-error-border aria-invalid:ring-3 aria-invalid:ring-feedback-error-surface [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "border-primary/70 bg-primary text-primary-foreground shadow-control hover:bg-primary/92 hover:shadow-control-hover active:bg-primary/88 active:shadow-control-pressed",
        outline:
          "border-control-border bg-control-surface text-foreground shadow-control hover:border-control-border-strong hover:bg-control-surface-hover hover:text-foreground hover:shadow-control-hover active:border-control-border-strong active:bg-control-surface-active active:shadow-control-pressed aria-expanded:border-control-border-strong aria-expanded:bg-control-surface-selected aria-expanded:text-foreground",
        secondary:
          "border-control-border bg-secondary text-secondary-foreground shadow-control hover:border-control-border-strong hover:bg-secondary/92 hover:shadow-control-hover active:border-control-border-strong active:bg-interactive-pressed active:shadow-control-pressed aria-expanded:border-control-border-strong aria-expanded:bg-control-surface-selected aria-expanded:text-secondary-foreground",
        ghost:
          "hover:bg-interactive-hover hover:text-foreground aria-expanded:bg-interactive-selected aria-expanded:text-foreground",
        destructive:
          "bg-feedback-error-surface text-destructive hover:bg-feedback-error-surface-strong focus-visible:border-feedback-error-border focus-visible:ring-feedback-error-surface",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default:
          "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs":
          "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
