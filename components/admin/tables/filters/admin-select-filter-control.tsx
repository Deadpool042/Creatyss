import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { AdminFilterField } from "./admin-filter-field";

type AdminSelectFilterControlOption<T extends string> = {
  value: T;
  label: string;
};

type AdminSelectFilterControlProps<T extends string> = {
  value: T;
  onValueChange: (value: T) => void;
  options: AdminSelectFilterControlOption<T>[];
  placeholder?: string;
  label?: string;
  triggerClassName?: string;
};

export function AdminSelectFilterControl<T extends string>({
  value,
  onValueChange,
  options,
  placeholder,
  label,
  triggerClassName,
}: AdminSelectFilterControlProps<T>) {
  const control = (
    <Select value={value} onValueChange={(next) => onValueChange(next as T)}>
      <SelectTrigger className={cn("w-full", triggerClassName)}>
        <SelectValue {...(placeholder ? { placeholder } : {})} />
      </SelectTrigger>
      <SelectContent>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!label) {
    return control;
  }

  return <AdminFilterField label={label}>{control}</AdminFilterField>;
}
