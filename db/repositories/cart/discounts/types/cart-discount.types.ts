export type CartDiscountScope = "cart" | "line";

export type CartDiscountTarget =
  | "all_customers"
  | "individual_customers"
  | "professional_customers"
  | "specific_customer";

export type CartDiscountKind = "percentage" | "fixed_amount";

export type CartDiscountTrigger =
  | "customer_type"
  | "specific_customer"
  | "line_quantity"
  | "cart_quantity"
  | "distinct_products_count"
  | "subtotal_threshold";

export type CartDiscountRule = {
  id: string;
  code: string;
  label: string;
  scope: CartDiscountScope;
  target: CartDiscountTarget;
  kind: CartDiscountKind;
  trigger: CartDiscountTrigger;
  percentageOff: number | null;
  fixedAmountCents: number | null;
  minimumLineQuantity: number | null;
  minimumCartQuantity: number | null;
  minimumDistinctProducts: number | null;
  minimumSubtotalCents: number | null;
  customerId: string | null;
  startsAt: Date | null;
  endsAt: Date | null;
  priority: number;
  isCombinable: boolean;
  isActive: boolean;
};

export type AppliedCartDiscount = {
  ruleId: string;
  code: string;
  label: string;
  amountCents: number;
  scope: CartDiscountScope;
  lineId: string | null;
};
