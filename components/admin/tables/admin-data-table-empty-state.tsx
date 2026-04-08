type AdminDataTableEmptyStateProps = {
  message: string;
  mobile?: boolean;
};

export function AdminDataTableEmptyState({
  message,
  mobile = false,
}: AdminDataTableEmptyStateProps) {
  if (mobile) {
    return (
      <div className="rounded-xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
        {message}
      </div>
    );
  }

  return (
    <div className="flex h-24 items-center justify-center text-sm text-muted-foreground">
      {message}
    </div>
  );
}
