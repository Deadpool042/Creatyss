import type { ElementType, ReactNode } from "react";
import { cn } from "@/lib/utils";

type HeroLayout = "split" | "centered" | "stacked";

type HeroProps = Readonly<{
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  actions?: ReactNode;
  media?: ReactNode;
  mediaFallback?: ReactNode;
  layout?: HeroLayout;
  titleAs?: "h1" | "h2";
  className?: string;
  contentClassName?: string;
  mediaClassName?: string;
}>;

function getContainerClassName(layout: HeroLayout): string {
  switch (layout) {
    case "centered":
      return "grid gap-8 justify-items-center text-center";
    case "stacked":
      return "grid gap-8";
    case "split":
    default:
      return "grid gap-8 min-[900px]:grid-cols-[minmax(0,0.95fr)_minmax(26rem,1.05fr)] min-[900px]:items-center";
  }
}

function getContentClassName(layout: HeroLayout): string {
  switch (layout) {
    case "centered":
      return "grid max-w-3xl gap-5 justify-items-center";
    case "stacked":
    case "split":
    default:
      return "grid max-w-xl gap-5";
  }
}

export function Hero({
  eyebrow,
  title,
  description,
  actions,
  media,
  mediaFallback,
  layout = "split",
  titleAs = "h1",
  className,
  contentClassName,
  mediaClassName
}: HeroProps) {
  const TitleTag = titleAs as ElementType;
  const shouldRenderMedia = layout !== "centered" && (media || mediaFallback);

  return (
    <section
      className={cn(
        "w-full rounded-xl border border-shell-border bg-shell-surface p-8 shadow-soft md:p-10",
        getContainerClassName(layout),
        className
      )}>
      <div className={cn(getContentClassName(layout), contentClassName)}>
        {eyebrow ? (
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            {eyebrow}
          </p>
        ) : null}

        <TitleTag>{title}</TitleTag>

        {description ? (
          <div className="max-w-2xl leading-relaxed text-muted-foreground">
            {description}
          </div>
        ) : null}

        {actions ? (
          <div
            className={cn(
              "flex flex-wrap gap-3",
              layout === "centered" && "justify-center"
            )}>
            {actions}
          </div>
        ) : null}
      </div>

      {shouldRenderMedia ? (
        <div className={cn("min-w-0 min-[700px]:self-stretch", mediaClassName)}>
          {media ?? mediaFallback}
        </div>
      ) : null}
    </section>
  );
}
