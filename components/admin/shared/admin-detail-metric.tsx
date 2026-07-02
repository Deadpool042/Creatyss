export function AdminDetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-surface-border-subtle px-5 py-4 last:border-b-0 md:border-b-0 md:border-r md:last:border-r-0">
      <span className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}
