"use client";

import * as React from "react";
import { Switch as SwitchPrimitive } from "radix-ui";

import { cn } from "@/lib/utils";

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default";
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-control-border bg-control-surface shadow-control transition-all outline-none after:absolute after:-inset-x-3 after:-inset-y-2 hover:border-control-border-strong hover:bg-control-surface-hover hover:shadow-control-hover focus-visible:border-focus-ring focus-visible:ring-3 focus-visible:ring-focus-ring/50 aria-invalid:border-feedback-error-border aria-invalid:ring-3 aria-invalid:ring-feedback-error-surface data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] data-[state=checked]:border-control-border-strong data-[state=checked]:bg-control-surface-selected data-[state=checked]:shadow-control-hover data-[state=unchecked]:bg-control-surface data-[state=unchecked]:shadow-control data-[state=unchecked]:hover:bg-control-surface-hover active:bg-control-surface-active active:shadow-control-pressed data-disabled:cursor-not-allowed data-disabled:border-control-border data-disabled:bg-interactive-disabled data-disabled:opacity-100",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full bg-background ring-0 shadow-control transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-[state=checked]:translate-x-[calc(100%-2px)] group-data-[size=default]/switch:data-[state=unchecked]:translate-x-0 group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-0"
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
