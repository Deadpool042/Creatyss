/**
 * Catalogue des champs traduisibles des emails transactionnels de commande
 * (Horizon 4 — lot multilingue généralisé, cf.
 * docs/roadmap/h4-plateforme-automatisation/lot-multilangue-generalise.md).
 *
 * Même convention que le dictionnaire homepage
 * (`entities/localization/homepage-copy-fields.ts`) : un sujet
 * `LocalizedValue` par type d'événement email (`subjectType` fixe,
 * `subjectId` = code d'événement), et un `fieldName` en chemin pointé par
 * chaîne littérale terminale extraite de `order-email-templates.ts`. Ne
 * couvre PAS la structure conditionnelle des templates (switch sur
 * `eventType`, `trackingReference`, `paymentMethod`) — seules les chaînes
 * terminales par branche sont traduisibles.
 *
 * Contrairement à la convention produit (un `subjectId` par instance DB),
 * ce catalogue reste fixe : les 3 événements existants
 * (`order_created`, `payment_succeeded`, `order_shipped`) sont les seuls
 * sujets couverts.
 */

export const ORDER_EMAIL_COPY_SUBJECT_TYPE = "order_email";

export type OrderEmailCopyEventType = "order_created" | "payment_succeeded" | "order_shipped";

export type OrderEmailCopyFieldDefinition = Readonly<{
  /** Chemin pointé utilisé comme `LocalizedValue.fieldName`. */
  fieldName: string;
  /** Libellé du champ pour une éventuelle admin de traduction future. */
  label: string;
  /** Champ texte long → rendu en zone de texte multi-lignes. */
  multiline?: boolean;
}>;

/**
 * Champs traduisibles communs aux 3 templates : titre de section (HTML),
 * libellé du CTA.
 */
const COMMON_FIELDS: readonly OrderEmailCopyFieldDefinition[] = [
  { fieldName: "title", label: "Titre" },
  { fieldName: "ctaLabel", label: "Libellé du bouton" },
];

export const ORDER_CREATED_EMAIL_COPY_FIELDS: readonly OrderEmailCopyFieldDefinition[] = [
  ...COMMON_FIELDS,
  { fieldName: "body.line1", label: "Ligne 1 du corps", multiline: true },
  { fieldName: "body.line2", label: "Ligne 2 du corps (montant)", multiline: true },
  { fieldName: "body.line4", label: "Ligne 4 du corps (invitation au suivi)", multiline: true },
  {
    fieldName: "paymentMethodLine.bankTransfer",
    label: "Ligne mode de paiement — virement bancaire",
    multiline: true,
  },
  {
    fieldName: "paymentMethodLine.cashOnDelivery",
    label: "Ligne mode de paiement — paiement à l'atelier",
    multiline: true,
  },
  { fieldName: "paymentMethodLine.card", label: "Ligne mode de paiement — carte bancaire" },
  {
    fieldName: "paymentMethodLine.other",
    label: "Ligne mode de paiement — à confirmer",
  },
] as const;

export const PAYMENT_SUCCEEDED_EMAIL_COPY_FIELDS: readonly OrderEmailCopyFieldDefinition[] = [
  ...COMMON_FIELDS,
  { fieldName: "body.line1", label: "Ligne 1 du corps", multiline: true },
  { fieldName: "body.line2", label: "Ligne 2 du corps (montant)", multiline: true },
  { fieldName: "body.line3", label: "Ligne 3 du corps (suivi)", multiline: true },
] as const;

export const ORDER_SHIPPED_EMAIL_COPY_FIELDS: readonly OrderEmailCopyFieldDefinition[] = [
  ...COMMON_FIELDS,
  { fieldName: "body.line1", label: "Ligne 1 du corps", multiline: true },
  {
    fieldName: "trackingLine.withReference",
    label: "Ligne de suivi — référence renseignée",
    multiline: true,
  },
  {
    fieldName: "trackingLine.withoutReference",
    label: "Ligne de suivi — référence absente",
    multiline: true,
  },
  { fieldName: "body.line3", label: "Ligne 3 du corps (récapitulatif)", multiline: true },
] as const;

/**
 * Retourne le catalogue de champs traduisibles pour un type d'événement.
 */
export function getOrderEmailCopyFields(
  eventType: OrderEmailCopyEventType
): readonly OrderEmailCopyFieldDefinition[] {
  switch (eventType) {
    case "payment_succeeded":
      return PAYMENT_SUCCEEDED_EMAIL_COPY_FIELDS;
    case "order_shipped":
      return ORDER_SHIPPED_EMAIL_COPY_FIELDS;
    case "order_created":
    default:
      return ORDER_CREATED_EMAIL_COPY_FIELDS;
  }
}
