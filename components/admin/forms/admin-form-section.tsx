import type { ReactNode } from "react";
import { SectionIntro } from "@/components/shared/section-intro";
import { cn } from "@/lib/utils";

type AdminFormSectionProps = Readonly<{
  children: ReactNode;
  title?: ReactNode;
  eyebrow?: ReactNode;
  description?: ReactNode;
  className?: string;
  contentClassName?: string;
}>;

export function AdminFormSection({
  children,
  title,
  eyebrow,
  description,
  className,
  contentClassName,
}: AdminFormSectionProps) {
  const hasIntro = title !== undefined || eyebrow !== undefined || description !== undefined;

  return (
    <section className={cn("space-y-4", className)}>
      {hasIntro ? (
        <SectionIntro
          className="grid gap-1"
          description={description}
          eyebrow={eyebrow}
          title={title ?? ""}
          titleAs="h3"
        />
      ) : null}

      <div className={cn("space-y-4", contentClassName)}>{children}</div>
    </section>
  );
}
