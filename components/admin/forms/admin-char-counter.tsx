type AdminCharCounterProps = {
  value?: string;
  length?: number;
  min: number;
  max: number;
};

export function AdminCharCounter({ value, length, min, max }: AdminCharCounterProps) {
  const len = length ?? value?.length ?? 0;
  const over = len > max;
  const short = len < min;

  const label = over ? "Trop long" : short ? "À compléter" : "Bonne longueur";
  const color = over
    ? "text-destructive"
    : short
      ? "text-amber-500 dark:text-amber-400"
      : "text-emerald-600 dark:text-emerald-500";

  return (
    <span className="flex items-center gap-1.5">
      <span className={["text-[10px]", color].join(" ")}>{label}</span>
      <span className="text-[10px] text-muted-foreground/50">·</span>
      <span
        className={[
          "text-[10px] tabular-nums",
          over ? "text-destructive" : "text-muted-foreground",
        ].join(" ")}
      >
        {len}/{max}
      </span>
    </span>
  );
}
