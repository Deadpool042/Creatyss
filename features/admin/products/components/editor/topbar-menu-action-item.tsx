import type { JSX, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

type TopbarMenuActionItemProps = {
  icon: LucideIcon;
  children: ReactNode;
  destructive?: boolean;
};

export function TopbarMenuActionItem({
  icon: Icon,
  children,
  destructive = false,
}: TopbarMenuActionItemProps): JSX.Element {
  return (
    <span
      className={[
        "flex w-full items-center gap-2 text-sm",
        destructive ? "text-destructive" : "text-foreground",
      ].join(" ")}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </span>
  );
}
