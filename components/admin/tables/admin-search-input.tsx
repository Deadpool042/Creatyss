import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

type AdminSearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export function AdminSearchInput({
  value,
  onChange,
  placeholder = "Rechercher…",
  className,
}: AdminSearchInputProps) {
  return (
    <div className={className ?? "relative w-full md:max-w-sm"}>
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="pl-8 text-sm"
      />
    </div>
  );
}
