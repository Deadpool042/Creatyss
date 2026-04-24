import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-control-border bg-control-surface px-2.5 py-1 text-base shadow-control transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-text-muted-soft hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:border-control-border disabled:bg-interactive-disabled disabled:text-interactive-disabled-foreground disabled:opacity-100 aria-invalid:border-feedback-error-border aria-invalid:ring-3 aria-invalid:ring-feedback-error-surface md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Input };
