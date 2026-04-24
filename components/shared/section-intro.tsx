import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionIntroProps = Readonly<{
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  titleAs?: "h2" | "h3";
  className?: string;
}>;

export function SectionIntro({
  eyebrow,
  title,
  description,
  titleAs = "h2",
  className,
}: SectionIntroProps) {
  const TitleTag = titleAs;

  return (
    <div className={className}>
      {eyebrow ? (
        <p className="mb-3 text-meta-label text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <TitleTag className={cn(titleAs === "h2" ? "text-title-section" : "text-title-compact")}>
        {title}
      </TitleTag>
      {description ? (
        <p className="text-secondary-copy reading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
