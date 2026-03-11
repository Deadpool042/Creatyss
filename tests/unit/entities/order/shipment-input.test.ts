import { describe, expect, it } from "vitest";
import { validateShipmentInput } from "@/entities/order/shipment-input";

describe("validateShipmentInput", () => {
  it("normalise une reference de suivi renseignee", () => {
    const formData = new FormData();

    formData.set("trackingReference", "  COLISSIMO-123456  ");

    const result = validateShipmentInput(formData);

    expect(result).toEqual({
      ok: true,
      data: {
        trackingReference: "COLISSIMO-123456"
      }
    });
  });

  it("convertit une valeur vide en null", () => {
    const formData = new FormData();

    formData.set("trackingReference", "   ");

    const result = validateShipmentInput(formData);

    expect(result).toEqual({
      ok: true,
      data: {
        trackingReference: null
      }
    });
  });
});
