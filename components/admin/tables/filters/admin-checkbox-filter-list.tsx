import { Checkbox } from "@/components/ui/checkbox";

type FilterOption<T extends string> = {
  value: T;
  label: string;
};

type AdminCheckboxFilterListProps<T extends string> = {
  options: FilterOption<T>[];
  selected: T[];
  onChange: (next: T[]) => void;
};

export function AdminCheckboxFilterList<T extends string>({
  options,
  selected,
  onChange,
}: AdminCheckboxFilterListProps<T>) {
  function toggle(value: T) {
    onChange(selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value]);
  }

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => (
        <label key={opt.value} className="flex cursor-pointer items-center gap-2.5 text-sm">
          <Checkbox checked={selected.includes(opt.value)} onCheckedChange={() => toggle(opt.value)} />
          {opt.label}
        </label>
      ))}
    </div>
  );
}
