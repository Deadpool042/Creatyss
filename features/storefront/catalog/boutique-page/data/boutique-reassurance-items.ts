import { type LucideIcon, Gem, HandHeart, Leaf, Ruler } from "lucide-react";

export type ReassuranceItem = {
  readonly title: string;
  readonly description: string;
  readonly Icon: LucideIcon;
};

export const BOUTIQUE_REASSURANCE_ITEMS: readonly ReassuranceItem[] = [
  {
    title: "Fait main à Saint-Étienne",
    description: "Chaque pièce est cousue à la main dans notre atelier stéphanois.",
    Icon: HandHeart,
  },
  {
    title: "Matières responsables et sans cuir",
    description: "Textiles naturels et éthiques, sélectionnés avec soin.",
    Icon: Leaf,
  },
  {
    title: "Pièces uniques",
    description: "Jamais produit en masse. Chaque création est un original.",
    Icon: Gem,
  },
  {
    title: "Sur-mesure sur demande",
    description: "Adaptations et personnalisations selon vos souhaits.",
    Icon: Ruler,
  },
];
