import {
  OrderAddressType,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
  type PrismaClient,
} from "../../../src/generated/prisma/client";
import type { DbClient } from "../shared/db";
import type { ImportedOrderInput } from "./order.types";

const SOURCE_SYSTEM = "woocommerce";

export async function findOrderBySource(prisma: DbClient, storeId: string, sourceId: string) {
  return prisma.order.findFirst({
    where: {
      storeId,
      sourceSystem: SOURCE_SYSTEM,
      sourceId,
    },
    select: {
      id: true,
    },
  });
}

// Création transactionnelle complète d'une commande importée : Order +
// OrderLine[] + OrderAddress (billing/shipping si renseignées) +
// OrderStatusHistory initial + Payment minimal. Interdits stricts respectés :
// aucun décrément de stock, aucune queue d'automatisation, aucune
// DiscountRedemption, aucun envoi d'email — cet outillage reste un import de
// données brutes, jamais un déclencheur des effets de bord du parcours
// commande natif (`features/commerce/orders/lib/order.repository.ts`).
export async function createOrderWithRelations(
  prisma: PrismaClient,
  storeId: string,
  input: ImportedOrderInput
) {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        storeId,
        customerId: input.customerId,
        orderNumber: input.orderNumber,
        status: input.status,
        currencyCode: input.currencyCode,
        subtotalAmount: input.subtotalAmount,
        shippingAmount: input.shippingAmount,
        discountAmount: input.discountAmount,
        taxAmount: input.taxAmount,
        totalAmount: input.totalAmount,
        customerEmail: input.customerEmail,
        customerFirstName: input.customerFirstName,
        customerLastName: input.customerLastName,
        notes: input.notes,
        sourceSystem: SOURCE_SYSTEM,
        sourceId: input.sourceId,
        placedAt: input.placedAt,
      },
      select: {
        id: true,
      },
    });

    if (input.lines.length > 0) {
      await tx.orderLine.createMany({
        data: input.lines.map((line) => ({
          orderId: order.id,
          productId: line.productId,
          variantId: line.variantId,
          quantity: line.quantity,
          unitPriceAmount: line.unitPriceAmount,
          lineSubtotalAmount: line.lineSubtotalAmount,
          lineDiscountAmount: line.lineDiscountAmount,
          lineTaxAmount: line.lineTaxAmount,
          lineTotalAmount: line.lineTotalAmount,
          productName: line.productName,
          sku: line.sku,
        })),
      });
    }

    const addressEntries = [
      input.billingAddress
        ? {
            type: OrderAddressType.BILLING,
            address: input.billingAddress,
          }
        : null,
      input.shippingAddress
        ? {
            type: OrderAddressType.SHIPPING,
            address: input.shippingAddress,
          }
        : null,
    ].filter((entry): entry is NonNullable<typeof entry> => entry !== null);

    for (const entry of addressEntries) {
      await tx.orderAddress.create({
        data: {
          orderId: order.id,
          type: entry.type,
          firstName: entry.address.firstName,
          lastName: entry.address.lastName,
          company: entry.address.company,
          line1: entry.address.line1,
          line2: entry.address.line2,
          postalCode: entry.address.postalCode,
          city: entry.address.city,
          region: entry.address.region,
          countryCode: entry.address.countryCode,
          phone: entry.address.phone,
        },
      });
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: input.status,
        notes: "Importé depuis WooCommerce",
      },
    });

    await tx.payment.create({
      data: {
        storeId,
        orderId: order.id,
        status: input.paymentStatus,
        methodType: input.paymentMethodType,
        currencyCode: input.currencyCode,
        amountCaptured: input.paymentStatus === PaymentStatus.CAPTURED ? input.totalAmount : null,
        provider: "woocommerce",
      },
    });

    // Une commande WooCommerce "completed" est mappée vers OrderStatus.COMPLETED,
    // que l'admin affiche comme "Expédiée" (mapping applicatif existant,
    // cf. entities/order/order-status.ts). Sans Shipment, la carte "Suivi
    // d'expédition" affichait "non expédiée" en contradiction avec ce libellé.
    // On crée donc un Shipment minimal, sans transporteur ni suivi fabriqués
    // (aucune de ces données n'existe côté WooCommerce) — seule shippedAt est
    // renseignée, et uniquement si WooCommerce fournit réellement date_completed.
    if (input.status === OrderStatus.COMPLETED) {
      await tx.shipment.create({
        data: {
          storeId,
          orderId: order.id,
          status: ShipmentStatus.SHIPPED,
          shippedAt: input.shippedAt,
        },
      });
    }

    return order;
  });
}

// Resync : politique volontairement minimale. Les lignes/adresses ne sont pas
// recréées à chaque exécution (elles ne changent pas rétroactivement côté
// WooCommerce une fois la commande passée) — seuls statut et montants sont
// resynchronisés. Exception : le Shipment minimal (cf. createOrderWithRelations)
// est assuré de façon idempotente, pour rattraper les commandes déjà
// importées avant l'introduction de ce comportement.
export async function updateOrder(prisma: DbClient, orderId: string, input: ImportedOrderInput) {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: input.status,
      subtotalAmount: input.subtotalAmount,
      shippingAmount: input.shippingAmount,
      discountAmount: input.discountAmount,
      taxAmount: input.taxAmount,
      totalAmount: input.totalAmount,
      notes: input.notes,
    },
    select: {
      id: true,
      storeId: true,
    },
  });

  if (input.status === OrderStatus.COMPLETED) {
    const existingShipment = await prisma.shipment.findFirst({
      where: { orderId: order.id },
      select: { id: true },
    });

    if (!existingShipment) {
      await prisma.shipment.create({
        data: {
          storeId: order.storeId,
          orderId: order.id,
          status: ShipmentStatus.SHIPPED,
          shippedAt: input.shippedAt,
        },
      });
    }
  }

  return order;
}
