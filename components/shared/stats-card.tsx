import type { ComponentType } from "react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type StatsCardProps = {
  title: string;
  value: number | string;
  description?: string;
  icon?: ComponentType<{ className?: string }>;
};

export function StatsCard({ title, value, description, icon: Icon }: StatsCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>

          <div className="text-3xl font-semibold tracking-tight">{value}</div>
        </div>

        {Icon ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-5 w-5 text-foreground" />
          </div>
        ) : null}
      </CardHeader>

      {description ? (
        <CardContent>
          <CardDescription className="text-sm leading-6">{description}</CardDescription>
        </CardContent>
      ) : null}
    </Card>
  );
}
