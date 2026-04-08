// components/shared/layout/full-width-page-frame.tsx
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FullWidthPageFrameProps = {
  children: ReactNode;
  className?: string;
};

export function FullWidthPageFrame({ children, className }: FullWidthPageFrameProps) {
  return (
    <div
      className={cn(
        [
          "flex min-h-full min-w-0 flex-col overflow-x-hidden",
          "px-4 pt-14 pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)]",
          "md:px-6 md:pt-14 md:pb-[calc(3.5rem+env(safe-area-inset-bottom)+1rem)]",
          "lg:px-6 lg:pt-0 lg:pb-0",
          "[@media(max-height:480px)]:px-3",
          "[@media(max-height:480px)]:pt-12",
          "[@media(max-height:480px)]:pb-[calc(2.75rem+env(safe-area-inset-bottom)+0.75rem)]",
        ].join(" "),
        className
      )}
    >
      {children}
    </div>
  );
}
