import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

type AdminEmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminEmptyState({ eyebrow, title, description }: AdminEmptyStateProps) {
  return (
    <Empty className="empty-state flex! items-start! justify-start! gap-3! rounded-xl! border! border-solid! border-border-soft! bg-card! p-5! text-left! text-card-foreground! shadow-card">
      <EmptyHeader className="items-start gap-1 text-left">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
          {eyebrow}
        </p>
        <EmptyTitle
          aria-level={2}
          className="text-lg font-semibold tracking-tight text-foreground"
          role="heading"
        >
          {title}
        </EmptyTitle>
        <EmptyDescription className="max-w-prose text-left text-sm leading-6 text-muted-foreground">
          {description}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
