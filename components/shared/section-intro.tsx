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
        <p className="mb-3 text-sm font-bold uppercase tracking-[0.08em] text-muted-foreground">
          {eyebrow}
        </p>
      ) : null}
      <TitleTag>{title}</TitleTag>
      {description ? <p className="leading-[1.65] text-muted-foreground">{description}</p> : null}
    </div>
  );
}
