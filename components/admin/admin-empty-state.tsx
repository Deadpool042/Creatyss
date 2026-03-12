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
    <div className="empty-state">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p className="card-copy">{description}</p>
    </div>
  );
}
