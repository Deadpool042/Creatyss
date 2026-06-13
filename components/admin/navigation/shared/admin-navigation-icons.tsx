import type { ComponentProps, JSX } from "react";
import {
  Activity,
  BadgePercent,
  BarChart3,
  CreditCard,
  Euro,
  FileText,
  FolderTree,
  Globe,
  HeartPulse,
  House,
  ImageIcon,
  Key,
  LayoutGrid,
  Link,
  Mail,
  Megaphone,
  Package,
  Search,
  Settings,
  Shield,
  ShoppingCart,
  Sliders,
  Tag,
  Telescope,
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
    case "euro":
      return <Euro {...props} />;
    case "fileText":
      return <FileText {...props} />;
    case "folderTree":
      return <FolderTree {...props} />;
    case "globe":
      return <Globe {...props} />;
    case "heartPulse":
      return <HeartPulse {...props} />;
    case "house":
      return <House {...props} />;
    case "imageIcon":
      return <ImageIcon {...props} />;
    case "key":
      return <Key {...props} />;
    case "layoutGrid":
      return <LayoutGrid {...props} />;
    case "link":
      return <Link {...props} />;
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
    case "shield":
      return <Shield {...props} />;
    case "sliders":
      return <Sliders {...props} />;
    case "shoppingCart":
      return <ShoppingCart {...props} />;
    case "tag":
      return <Tag {...props} />;
    case "telescope":
      return <Telescope {...props} />;
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
