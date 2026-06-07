import type { ComponentType, ReactNode } from "react";

import { cn } from "@/lib/utils";

type AdminOverviewMetric = Readonly<{
  label: string;
  value: number | string;
  hint: ReactNode;
  toneClassName?: string;
}>;

type AdminOverviewHeroProps = Readonly<{
  eyebrow: ReactNode;
  title: ReactNode;
  description: ReactNode;
  icon: ComponentType<{ className?: string }>;
  action?: ReactNode;
  metrics: ReadonlyArray<AdminOverviewMetric>;
  mobileHidden?: boolean;
  align?: "centered" | "leading";
  className?: string;
}>;

export function AdminOverviewHero({
  eyebrow,
  title,
  description,
  icon: Icon,
  action,
  metrics,
  mobileHidden = false,
  align = "centered",
  className,
}: AdminOverviewHeroProps) {
  const rootClassName = mobileHidden
    ? cn(
        "hidden px-4 pt-1 md:px-5 lg:flex lg:flex-col lg:gap-4 lg:px-6 lg:pb-1",
        align === "leading" ? "lg:items-start lg:justify-start" : "lg:items-center lg:justify-center"
      )
    : "safe-px-layout px-4 pt-4 md:px-5 md:pt-5 lg:px-6";

  return (
    <div className={cn(rootClassName, className)}>
      <section className="w-full rounded-3xl border border-surface-border bg-[linear-gradient(145deg,color-mix(in_srgb,var(--surface-panel)_96%,white)_0%,color-mix(in_srgb,var(--surface-panel)_84%,var(--shell-surface))_100%)] shadow-card backdrop-blur-xl">
        <div className="flex flex-col gap-5 p-5 md:p-6 lg:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between md:gap-6">
            <div className="max-w-3xl">
              <div className="inline-flex items-center rounded-full border border-surface-border-subtle bg-surface-panel-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {eyebrow}
              </div>

              <div className="mt-4 flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-surface-border bg-surface-panel shadow-sm">
                  <Icon className="size-6 text-muted-foreground" />
                </div>

                <div className="min-w-0">
                  <h1 className="text-[1.45rem] font-semibold tracking-tight text-foreground md:text-[1.7rem] lg:text-[2rem]">
                    {title}
                  </h1>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground md:text-base md:leading-7">
                    {description}
                  </p>
                </div>
              </div>
            </div>

            {action ? <div className="shrink-0 md:pt-1">{action}</div> : null}
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {metrics.map((metric) => (
              <div
                key={metric.label}
                className={cn(
                  "rounded-2xl border border-surface-border-subtle px-4 py-4 shadow-sm backdrop-blur-xl",
                  metric.toneClassName ?? "bg-surface-panel/80"
                )}
              >
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {metric.label}
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight text-foreground">
                  {metric.value}
                </p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{metric.hint}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
