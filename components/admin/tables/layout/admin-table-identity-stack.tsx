"use client";

import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminTableIdentityStackProps = Readonly<{
  eyebrow?: ReactNode;
  title: ReactNode;
  caption?: ReactNode;
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  captionClassName?: string;
}>;

export function AdminTableIdentityStack({
  eyebrow,
  title,
  caption,
  className,
  eyebrowClassName,
  titleClassName,
  captionClassName,
}: AdminTableIdentityStackProps) {
  return (
    <div className={cn("min-w-0", className)}>
      {eyebrow ? (
        <p className={cn("mb-0.5 truncate text-[0.65rem] font-medium text-brand/75", eyebrowClassName)}>
          {eyebrow}
        </p>
      ) : null}

      <span
        className={cn("block truncate text-[0.95rem] font-medium leading-snug text-foreground", titleClassName)}
      >
        {title}
      </span>

      {caption ? <div className={captionClassName}>{caption}</div> : null}
    </div>
  );
}
