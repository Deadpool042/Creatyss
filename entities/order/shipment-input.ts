export type ShipmentInput = {
  trackingReference: string | null;
};

export type ShipmentInputResult =
  | {
      ok: true;
      data: ShipmentInput;
    }
  | {
      ok: false;
      message: string;
    };

function normalizeOptionalText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const normalizedValue = value.trim();

  return normalizedValue.length > 0 ? normalizedValue : null;
}

export function validateShipmentInput(formData: FormData): ShipmentInputResult {
  return {
    ok: true,
    data: {
      trackingReference: normalizeOptionalText(formData.get("trackingReference"))
    }
  };
}
