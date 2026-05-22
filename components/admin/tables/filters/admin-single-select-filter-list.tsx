import { cn } from "@/lib/utils";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type AdminSingleSelectFilterListProps<T extends string> = {
  options: FilterOption<T>[];
  selected: T;
  onChange: (next: T) => void;
};

export function AdminSingleSelectFilterList<T extends string>({
  options,
  selected,
  onChange,
}: AdminSingleSelectFilterListProps<T>) {
  return (
    <div className="flex flex-col gap-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-muted",
            selected === option.value ? "font-medium text-foreground" : "text-muted-foreground"
          )}
        >
          <span
            className={cn(
              "h-1.5 w-1.5 shrink-0 rounded-full",
              selected === option.value ? "bg-foreground" : "bg-transparent"
            )}
          />
          {option.label}
        </button>
      ))}
    </div>
  );
}
