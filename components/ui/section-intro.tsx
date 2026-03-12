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
  className
}: SectionIntroProps) {
  const TitleTag = titleAs;

  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <TitleTag>{title}</TitleTag>
      {description ? <p className="card-copy">{description}</p> : null}
    </div>
  );
}
