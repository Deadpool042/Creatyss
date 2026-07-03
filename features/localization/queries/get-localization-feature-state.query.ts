/**
 * `platform.localization` est résolu par le guard générique `meetsFeatureLevel`
 * (cf. `features/feature-flags/queries/get-feature-level-state.query.ts`),
 * comme les autres features graduées. Ce fichier ne porte plus que le code
 * du flag, encore consommé directement par quelques appelants (override,
 * toggle admin) sans passer par le guard.
 */

export const LOCALIZATION_FEATURE_CODE = "platform.localization";
