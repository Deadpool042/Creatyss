type RawInputValue = FormDataEntryValue | string | null | undefined;

export type ValidatedGuestCheckoutInput = {
  customerEmail: string;
  customerFirstName: string;
  customerLastName: string;
  customerPhone: string | null;
  shippingAddressLine1: string;
  shippingAddressLine2: string | null;
  shippingPostalCode: string;
  shippingCity: string;
  shippingCountryCode: "FR";
  billingSameAsShipping: boolean;
  billingFirstName: string | null;
  billingLastName: string | null;
  billingPhone: string | null;
  billingAddressLine1: string | null;
  billingAddressLine2: string | null;
  billingPostalCode: string | null;
  billingCity: string | null;
  billingCountryCode: "FR" | null;
};

export type GuestCheckoutInputErrorCode =
  | "missing_customer_email"
  | "invalid_customer_email"
  | "missing_customer_first_name"
  | "missing_customer_last_name"
  | "missing_shipping_address_line_1"
  | "missing_shipping_postal_code"
  | "invalid_shipping_postal_code"
  | "missing_shipping_city"
  | "missing_billing_first_name"
  | "missing_billing_last_name"
  | "missing_billing_address_line_1"
  | "missing_billing_postal_code"
  | "invalid_billing_postal_code"
  | "missing_billing_city";

type GuestCheckoutInputSource = {
  customerEmail: RawInputValue;
  customerFirstName: RawInputValue;
  customerLastName: RawInputValue;
  customerPhone: RawInputValue;
  shippingAddressLine1: RawInputValue;
  shippingAddressLine2: RawInputValue;
  shippingPostalCode: RawInputValue;
  shippingCity: RawInputValue;
  billingSameAsShipping: RawInputValue;
  billingFirstName: RawInputValue;
  billingLastName: RawInputValue;
  billingPhone: RawInputValue;
  billingAddressLine1: RawInputValue;
  billingAddressLine2: RawInputValue;
  billingPostalCode: RawInputValue;
  billingCity: RawInputValue;
};

export type GuestCheckoutInputValidationResult =
  | {
      ok: true;
      data: ValidatedGuestCheckoutInput;
    }
  | {
      ok: false;
      code: GuestCheckoutInputErrorCode;
    };

function readTrimmedString(value: RawInputValue): string | null {
  if (typeof value !== "string") {
    return null;
  }

  return value.trim();
}

function normalizeRequiredText(value: RawInputValue): string | null {
  const normalizedValue = readTrimmedString(value);

  if (normalizedValue === null || normalizedValue.length === 0) {
    return null;
  }

  return normalizedValue;
}

function normalizeOptionalText(value: RawInputValue): string | null {
  return normalizeRequiredText(value);
}

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidFrenchPostalCode(value: string): boolean {
  return /^[0-9]{5}$/.test(value);
}

function normalizeBillingSameAsShipping(value: RawInputValue): boolean {
  if (typeof value !== "string") {
    return false;
  }

  const normalizedValue = value.trim().toLowerCase();

  return normalizedValue === "on" || normalizedValue === "true" || normalizedValue === "1";
}

export function validateGuestCheckoutInput(
  input: GuestCheckoutInputSource
): GuestCheckoutInputValidationResult {
  const customerEmail = normalizeRequiredText(input.customerEmail);

  if (customerEmail === null) {
    return {
      ok: false,
      code: "missing_customer_email"
    };
  }

  if (!isValidEmail(customerEmail)) {
    return {
      ok: false,
      code: "invalid_customer_email"
    };
  }

  const customerFirstName = normalizeRequiredText(input.customerFirstName);

  if (customerFirstName === null) {
    return {
      ok: false,
      code: "missing_customer_first_name"
    };
  }

  const customerLastName = normalizeRequiredText(input.customerLastName);

  if (customerLastName === null) {
    return {
      ok: false,
      code: "missing_customer_last_name"
    };
  }

  const shippingAddressLine1 = normalizeRequiredText(input.shippingAddressLine1);

  if (shippingAddressLine1 === null) {
    return {
      ok: false,
      code: "missing_shipping_address_line_1"
    };
  }

  const shippingPostalCode = normalizeRequiredText(input.shippingPostalCode);

  if (shippingPostalCode === null) {
    return {
      ok: false,
      code: "missing_shipping_postal_code"
    };
  }

  if (!isValidFrenchPostalCode(shippingPostalCode)) {
    return {
      ok: false,
      code: "invalid_shipping_postal_code"
    };
  }

  const shippingCity = normalizeRequiredText(input.shippingCity);

  if (shippingCity === null) {
    return {
      ok: false,
      code: "missing_shipping_city"
    };
  }

  const billingSameAsShipping = normalizeBillingSameAsShipping(
    input.billingSameAsShipping
  );

  if (billingSameAsShipping) {
    return {
      ok: true,
      data: {
        customerEmail,
        customerFirstName,
        customerLastName,
        customerPhone: normalizeOptionalText(input.customerPhone),
        shippingAddressLine1,
        shippingAddressLine2: normalizeOptionalText(input.shippingAddressLine2),
        shippingPostalCode,
        shippingCity,
        shippingCountryCode: "FR",
        billingSameAsShipping: true,
        billingFirstName: null,
        billingLastName: null,
        billingPhone: null,
        billingAddressLine1: null,
        billingAddressLine2: null,
        billingPostalCode: null,
        billingCity: null,
        billingCountryCode: null
      }
    };
  }

  const billingFirstName = normalizeRequiredText(input.billingFirstName);

  if (billingFirstName === null) {
    return {
      ok: false,
      code: "missing_billing_first_name"
    };
  }

  const billingLastName = normalizeRequiredText(input.billingLastName);

  if (billingLastName === null) {
    return {
      ok: false,
      code: "missing_billing_last_name"
    };
  }

  const billingAddressLine1 = normalizeRequiredText(input.billingAddressLine1);

  if (billingAddressLine1 === null) {
    return {
      ok: false,
      code: "missing_billing_address_line_1"
    };
  }

  const billingPostalCode = normalizeRequiredText(input.billingPostalCode);

  if (billingPostalCode === null) {
    return {
      ok: false,
      code: "missing_billing_postal_code"
    };
  }

  if (!isValidFrenchPostalCode(billingPostalCode)) {
    return {
      ok: false,
      code: "invalid_billing_postal_code"
    };
  }

  const billingCity = normalizeRequiredText(input.billingCity);

  if (billingCity === null) {
    return {
      ok: false,
      code: "missing_billing_city"
    };
  }

  return {
    ok: true,
    data: {
      customerEmail,
      customerFirstName,
      customerLastName,
      customerPhone: normalizeOptionalText(input.customerPhone),
      shippingAddressLine1,
      shippingAddressLine2: normalizeOptionalText(input.shippingAddressLine2),
      shippingPostalCode,
      shippingCity,
      shippingCountryCode: "FR",
      billingSameAsShipping: false,
      billingFirstName,
      billingLastName,
      billingPhone: normalizeOptionalText(input.billingPhone),
      billingAddressLine1,
      billingAddressLine2: normalizeOptionalText(input.billingAddressLine2),
      billingPostalCode,
      billingCity,
      billingCountryCode: "FR"
    }
  };
}
