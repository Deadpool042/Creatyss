import { type LucideIcon, Gem, HandHeart, Leaf, Ruler } from "lucide-react";

import { brandConfig } from "@/core/config/brand";

export type ReassuranceItem = {
  readonly title: string;
  readonly description: string;
  readonly Icon: LucideIcon;
};

export const BOUTIQUE_REASSURANCE_ITEMS: readonly ReassuranceItem[] = [
  {
    title: brandConfig.drawerNote.title,
    description: brandConfig.reassuranceHandmadeDescription,
    Icon: HandHeart,
  },
  {
    title: "Matières responsables et sans cuir",
    description: "Textiles naturels et éthiques, sélectionnés avec soin.",
    Icon: Leaf,
  },
  {
    title: "Pièces uniques en petites séries",
    description: "Jamais produit en masse. Chaque création est un original.",
    Icon: Gem,
  },
  {
    title: "Sur-mesure sur demande",
    description: "Adaptations et personnalisations selon vos souhaits.",
    Icon: Ruler,
  },
];
