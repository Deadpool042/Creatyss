import type { ReactNode } from "react";

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
        <p className="mb-3 text-xs font-semibold uppercase tracking-widest leading-snug text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <TitleTag>
        {title}
      </TitleTag>
      {description ? (
        <p className="leading-relaxed text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
