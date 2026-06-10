import type { ComponentType } from "react";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { FolderXIcon } from "lucide-react";

type AdminEmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
  className?: string;
  actionNode?: React.ReactNode;
  icon?: ComponentType<{ className?: string }>;
};

export function AdminEmptyState({
  eyebrow,
  title,
  description,
  className,
  actionNode,
  icon,
}: AdminEmptyStateProps) {
  const ResolvedIcon = icon ?? FolderXIcon;

  return (
    <Empty className={`${className}`}>
      <EmptyHeader className="items-start gap-1 text-left">
        <EmptyMedia variant="icon">
          <ResolvedIcon className="h-6 w-6 text-muted-foreground " />
        </EmptyMedia>
        <p className="text-xs font-medium uppercase tracking-tight text-muted-foreground">
          {eyebrow}
        </p>
        <EmptyTitle
          aria-level={2}
          className="text-lg font-semibold tracking-tight text-foreground"
          role="heading"
        >
          {title}
        </EmptyTitle>
        <EmptyDescription className="max-w-prose text-left text-sm leading-6 text-muted-foreground">
          {description}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {actionNode}
      </EmptyContent>
    </Empty>
  );
}
