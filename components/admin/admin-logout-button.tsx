import { SidebarMenuButton } from "@/components/ui/sidebar";
import { LogOut } from "lucide-react";

export function AdminLogoutButton() {
  return (
    <form action="/api/admin/logout" method="POST">
      <SidebarMenuButton
        type="submit"
        tooltip="Se déconnecter"
        className="h-9 rounded-xl"
      >
        <LogOut className="size-4" />
        <span className="group-data-[collapsible=icon]:hidden">Se déconnecter</span>
      </SidebarMenuButton>
    </form>
  );
}
