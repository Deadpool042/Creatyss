import type { ReactNode } from "react";

type AdminFilterSectionProps = {
  title: string;
  children: ReactNode;
};

export function AdminFilterSection({ title, children }: AdminFilterSectionProps) {
  return (
    <div>
      <p className="mb-2.5 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {title}
      </p>
      {children}
    </div>
  );
}
