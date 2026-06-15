export const ADMIN_TAXATION_PATH = "/admin/commerce/taxation";

/** Territoires sélectionnables à la création d'une règle (countryCode FR). */
export const TAXATION_TERRITORY_OPTIONS: ReadonlyArray<{
  value: string;
  label: string;
  regionCode: string | null;
}> = [
  { value: "METRO", label: "Métropole", regionCode: null },
  { value: "971", label: "Guadeloupe", regionCode: "971" },
  { value: "972", label: "Martinique", regionCode: "972" },
  { value: "973", label: "Guyane", regionCode: "973" },
  { value: "974", label: "Réunion", regionCode: "974" },
  { value: "976", label: "Mayotte", regionCode: "976" },
];
