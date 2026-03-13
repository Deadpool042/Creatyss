import type { ReactNode } from "react";

type PageHeaderProps = Readonly<{
  eyebrow: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
}>;

export function PageHeader({
  eyebrow,
  title,
  description,
  actions
}: PageHeaderProps) {
  return (
    <div className="page-header">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        {description ? <p className="lead">{description}</p> : null}
      </div>

      {actions ?? null}
    </div>
  );
}
