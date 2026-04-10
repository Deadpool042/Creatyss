type PagesPageHeaderProps = {
  title: string;
  description?: string;
};

export function PagesPageHeader({
  title,
  description,
}: PagesPageHeaderProps) {
  return (
    <header className="space-y-1">
      <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
      {description ? (
        <p className="text-sm text-muted-foreground">{description}</p>
      ) : null}
    </header>
  );
}
