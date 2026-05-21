import Link from "next/link";
import type { ComponentType, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type EmptyStateProps = {
  title: string;
  description: string;
  icon?: ComponentType<{ className?: string }>;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  footer?: ReactNode;
};

export function EmptyState({ title, description, icon: Icon, action, footer }: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {Icon ? (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-muted">
              <Icon className="h-5 w-5 text-foreground" />
            </div>
          ) : null}

          <div className="space-y-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription className="max-w-2xl text-sm leading-6">{description}</CardDescription>
          </div>
        </div>

        {action ? (
          action.href ? (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button type="button" onClick={action.onClick}>
              {action.label}
            </Button>
          )
        ) : null}
      </CardHeader>

      {footer ? <CardContent>{footer}</CardContent> : null}
    </Card>
  );
}
