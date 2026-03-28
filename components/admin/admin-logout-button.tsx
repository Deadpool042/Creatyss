import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <SidebarMenuButton
        type="submit"
        tooltip="Se déconnecter"
        className="h-9 rounded-lg text-sidebar-foreground/60 transition-colors hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
      >
        <LogOut className="size-4" />
        <span className="group-data-[collapsible=icon]:hidden">Se déconnecter</span>
      </SidebarMenuButton>
    </form>
  );
}
