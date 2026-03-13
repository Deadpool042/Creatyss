type AdminEmptyStateProps = {
  eyebrow: string;
  title: string;
  description: string;
};

export function AdminEmptyState({
  eyebrow,
  title,
  description
}: AdminEmptyStateProps) {
  return (
    <div className="empty-state rounded-xl border border-border/70 bg-card text-card-foreground shadow-sm">
      <p className="eyebrow text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="card-copy max-w-prose text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}
