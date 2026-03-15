import type { ReactNode } from "react";
import { SectionIntro } from "@/components/section-intro";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  contentClassName
}: AdminFormSectionProps) {
  const hasIntro =
    title !== undefined || eyebrow !== undefined || description !== undefined;

  return (
    <Card
      className={cn(
        "gap-0 rounded-xl border border-border/70 bg-card py-0 text-card-foreground shadow-sm",
        className
      )}>
      {hasIntro ? (
        <>
          <div className="grid gap-2 px-5 pt-5">
            <SectionIntro
              className="grid gap-2"
              description={description}
              eyebrow={eyebrow}
              title={title ?? ""}
              titleAs="h3"
            />
          </div>

          <Separator className="mx-5" />
        </>
      ) : null}

      <div
        className={cn(
          "grid gap-4 px-5 py-5",
          contentClassName
        )}>
        {children}
      </div>
    </Card>
  );
}
