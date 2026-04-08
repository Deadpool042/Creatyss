// components/shared/layout/full-width-stack.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FullWidthStackProps = {
  children: ReactNode;
  className?: string;
};

export function FullWidthStack({ children, className }: FullWidthStackProps) {
  return <div className={cn("space-y-4 md:space-y-6", className)}>{children}</div>;
}
