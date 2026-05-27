import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
    <div className={cn("relative w-full", className)}>
      <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-9 pl-8"
      />
    </div>
  );
}
