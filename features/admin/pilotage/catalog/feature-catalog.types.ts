export type FeatureFamily =
  | "core"
  | "cross_cutting"
  | "optional"
  | "satellite";

export type FeatureRuntimeState =
  | "active"
  | "inactive"
  | "archived"
  | "maintenance"
  | "experimental"
  | "deprecated";

export type FeatureMutability =
  | "readonly"
  | "toggleable"
  | "configurable"
  | "level_selectable";

export type FeatureScope =
  | "global"
  | "store"
  | "user";

export type FeatureLevelKey = string;

export type FeatureCatalogEntry = Readonly<{
  key: string;
  label: string;
  description: string;
  family: FeatureFamily;
  module: string;
  capability?: string;
  defaultState: FeatureRuntimeState;
  mutability: FeatureMutability;
  scopes: readonly FeatureScope[];
  levels?: readonly FeatureLevelKey[];
  dependencies?: readonly string[];
}>;
