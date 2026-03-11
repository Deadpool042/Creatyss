import { describe, expect, it } from "vitest";
import { validateGuestCheckoutInput } from "@/entities/checkout/guest-checkout-input";

describe("validateGuestCheckoutInput", () => {
  it("valide un checkout invite avec facturation identique", () => {
    const result = validateGuestCheckoutInput({
      customerEmail: " client@example.com ",
      customerFirstName: "  Jeanne ",
      customerLastName: " Dupont ",
      customerPhone: " 0612345678 ",
      shippingAddressLine1: " 12 rue des Tanneurs ",
      shippingAddressLine2: " Batiment B ",
      shippingPostalCode: "75001",
      shippingCity: " Paris ",
      billingSameAsShipping: "true",
      billingFirstName: "",
      billingLastName: "",
      billingPhone: "",
      billingAddressLine1: "",
      billingAddressLine2: "",
      billingPostalCode: "",
      billingCity: ""
    });

    expect(result).toEqual({
      ok: true,
      data: {
        customerEmail: "client@example.com",
        customerFirstName: "Jeanne",
        customerLastName: "Dupont",
        customerPhone: "0612345678",
        shippingAddressLine1: "12 rue des Tanneurs",
        shippingAddressLine2: "Batiment B",
        shippingPostalCode: "75001",
        shippingCity: "Paris",
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
    });
  });

  it("valide une facturation separee", () => {
    const result = validateGuestCheckoutInput({
      customerEmail: "client@example.com",
      customerFirstName: "Jeanne",
      customerLastName: "Dupont",
      customerPhone: "",
      shippingAddressLine1: "12 rue des Tanneurs",
      shippingAddressLine2: "",
      shippingPostalCode: "75001",
      shippingCity: "Paris",
      billingSameAsShipping: null,
      billingFirstName: "Jeanne",
      billingLastName: "Dupont",
      billingPhone: "",
      billingAddressLine1: "20 avenue Victor Hugo",
      billingAddressLine2: "",
      billingPostalCode: "33000",
      billingCity: "Bordeaux"
    });

    expect(result).toEqual({
      ok: true,
      data: {
        customerEmail: "client@example.com",
        customerFirstName: "Jeanne",
        customerLastName: "Dupont",
        customerPhone: null,
        shippingAddressLine1: "12 rue des Tanneurs",
        shippingAddressLine2: null,
        shippingPostalCode: "75001",
        shippingCity: "Paris",
        shippingCountryCode: "FR",
        billingSameAsShipping: false,
        billingFirstName: "Jeanne",
        billingLastName: "Dupont",
        billingPhone: null,
        billingAddressLine1: "20 avenue Victor Hugo",
        billingAddressLine2: null,
        billingPostalCode: "33000",
        billingCity: "Bordeaux",
        billingCountryCode: "FR"
      }
    });
  });

  it("rejette un email invalide", () => {
    expect(
      validateGuestCheckoutInput({
        customerEmail: "not-an-email",
        customerFirstName: "Jeanne",
        customerLastName: "Dupont",
        customerPhone: "",
        shippingAddressLine1: "12 rue des Tanneurs",
        shippingAddressLine2: "",
        shippingPostalCode: "75001",
        shippingCity: "Paris",
        billingSameAsShipping: "true",
        billingFirstName: "",
        billingLastName: "",
        billingPhone: "",
        billingAddressLine1: "",
        billingAddressLine2: "",
        billingPostalCode: "",
        billingCity: ""
      })
    ).toEqual({
      ok: false,
      code: "invalid_customer_email"
    });
  });

  it("rejette un code postal de livraison invalide", () => {
    expect(
      validateGuestCheckoutInput({
        customerEmail: "client@example.com",
        customerFirstName: "Jeanne",
        customerLastName: "Dupont",
        customerPhone: "",
        shippingAddressLine1: "12 rue des Tanneurs",
        shippingAddressLine2: "",
        shippingPostalCode: "7501",
        shippingCity: "Paris",
        billingSameAsShipping: "true",
        billingFirstName: "",
        billingLastName: "",
        billingPhone: "",
        billingAddressLine1: "",
        billingAddressLine2: "",
        billingPostalCode: "",
        billingCity: ""
      })
    ).toEqual({
      ok: false,
      code: "invalid_shipping_postal_code"
    });
  });

  it("rejette un code postal de facturation invalide si l'adresse est separee", () => {
    expect(
      validateGuestCheckoutInput({
        customerEmail: "client@example.com",
        customerFirstName: "Jeanne",
        customerLastName: "Dupont",
        customerPhone: "",
        shippingAddressLine1: "12 rue des Tanneurs",
        shippingAddressLine2: "",
        shippingPostalCode: "75001",
        shippingCity: "Paris",
        billingSameAsShipping: null,
        billingFirstName: "Jeanne",
        billingLastName: "Dupont",
        billingPhone: "",
        billingAddressLine1: "20 avenue Victor Hugo",
        billingAddressLine2: "",
        billingPostalCode: "3300",
        billingCity: "Bordeaux"
      })
    ).toEqual({
      ok: false,
      code: "invalid_billing_postal_code"
    });
  });
});
