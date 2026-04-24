import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-lg border border-control-border bg-control-surface px-2.5 py-2 text-base shadow-control transition-all outline-none placeholder:text-text-muted-soft hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 disabled:cursor-not-allowed disabled:border-control-border disabled:bg-interactive-disabled disabled:text-interactive-disabled-foreground disabled:opacity-100 aria-invalid:border-feedback-error-border aria-invalid:ring-3 aria-invalid:ring-feedback-error-surface md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
