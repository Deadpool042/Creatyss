import type { ComponentProps, JSX } from "react";
import {
  Activity,
  BadgePercent,
  BarChart3,
  CreditCard,
  FileText,
  FolderTree,
  HeartPulse,
  House,
  ImageIcon,
  LayoutGrid,
  Mail,
  Megaphone,
  Package,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users,
  Wrench,
  Zap,
} from "lucide-react";

import type { AdminNavigationIconKey } from "@/features/admin/navigation";

type IconSvgProps = Omit<ComponentProps<"svg">, "children">;

export function renderAdminNavigationIcon(
  iconKey: AdminNavigationIconKey,
  props?: IconSvgProps
): JSX.Element {
  switch (iconKey) {
    case "activity":
      return <Activity {...props} />;
    case "badgePercent":
      return <BadgePercent {...props} />;
    case "barChart3":
      return <BarChart3 {...props} />;
    case "creditCard":
      return <CreditCard {...props} />;
    case "fileText":
      return <FileText {...props} />;
    case "folderTree":
      return <FolderTree {...props} />;
    case "heartPulse":
      return <HeartPulse {...props} />;
    case "house":
      return <House {...props} />;
    case "imageIcon":
      return <ImageIcon {...props} />;
    case "layoutGrid":
      return <LayoutGrid {...props} />;
    case "mail":
      return <Mail {...props} />;
    case "megaphone":
      return <Megaphone {...props} />;
    case "package":
      return <Package {...props} />;
    case "search":
      return <Search {...props} />;
    case "settings":
      return <Settings {...props} />;
    case "shoppingCart":
      return <ShoppingCart {...props} />;
    case "truck":
      return <Truck {...props} />;
    case "users":
      return <Users {...props} />;
    case "wrench":
      return <Wrench {...props} />;
    case "zap":
      return <Zap {...props} />;
  }
}
