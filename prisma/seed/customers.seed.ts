import type { PrismaClient } from "@/src/generated/prisma/client";

type SeedCustomer = Readonly<{
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  status: "LEAD" | "ACTIVE" | "INACTIVE" | "BLOCKED";
  acceptsEmail: boolean;
  acceptsSms?: boolean;
  notes?: string;
  firstSeenAt: Date;
  lastSeenAt?: Date;
  activatedAt?: Date;
  blockedAt?: Date;
}>;

const DAY_IN_MS = 24 * 60 * 60 * 1_000;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_IN_MS);
}

const DEV_CUSTOMERS: readonly SeedCustomer[] = [
  {
    email: "camille.bernard@example.test",
    firstName: "Camille",
    lastName: "Bernard",
    phone: "+33612010203",
    status: "ACTIVE",
    acceptsEmail: true,
    firstSeenAt: daysAgo(180),
    lastSeenAt: daysAgo(3),
    activatedAt: daysAgo(175),
    notes: "Cliente régulière, intéressée par les cabas.",
  },
  {
    email: "julie.roche@example.test",
    firstName: "Julie",
    lastName: "Roche",
    phone: "+33622030405",
    status: "ACTIVE",
    acceptsEmail: true,
    firstSeenAt: daysAgo(120),
    lastSeenAt: daysAgo(12),
    activatedAt: daysAgo(118),
  },
  {
    email: "marion.faure@example.test",
    firstName: "Marion",
    lastName: "Faure",
    status: "LEAD",
    acceptsEmail: true,
    firstSeenAt: daysAgo(20),
    lastSeenAt: daysAgo(4),
    notes: "Inscription à la newsletter sans commande.",
  },
  {
    email: "sophie.perrin@example.test",
    firstName: "Sophie",
    lastName: "Perrin",
    phone: "+33633040506",
    status: "INACTIVE",
    acceptsEmail: false,
    firstSeenAt: daysAgo(420),
    lastSeenAt: daysAgo(260),
    activatedAt: daysAgo(415),
  },
  {
    email: "claire.moreau@example.test",
    firstName: "Claire",
    lastName: "Moreau",
    status: "ACTIVE",
    acceptsEmail: false,
    firstSeenAt: daysAgo(75),
    lastSeenAt: daysAgo(2),
    activatedAt: daysAgo(70),
  },
  {
    email: "lea.giraud@example.test",
    firstName: "Léa",
    lastName: "Giraud",
    phone: "+33644050607",
    status: "LEAD",
    acceptsEmail: false,
    firstSeenAt: daysAgo(8),
    lastSeenAt: daysAgo(1),
  },
  {
    email: "anne.martin@example.test",
    firstName: "Anne",
    lastName: "Martin",
    status: "BLOCKED",
    acceptsEmail: false,
    firstSeenAt: daysAgo(200),
    lastSeenAt: daysAgo(90),
    blockedAt: daysAgo(85),
    notes: "Compte de démonstration bloqué.",
  },
  {
    email: "elodie.dubois@example.test",
    firstName: "Élodie",
    lastName: "Dubois",
    phone: "+33655060708",
    status: "ACTIVE",
    acceptsEmail: true,
    firstSeenAt: daysAgo(52),
    lastSeenAt: daysAgo(6),
    activatedAt: daysAgo(50),
  },
];

export async function seedCustomers(prisma: PrismaClient, storeId: string): Promise<void> {
  for (const customer of DEV_CUSTOMERS) {
    await prisma.customer.upsert({
      where: {
        storeId_email: {
          storeId,
          email: customer.email,
        },
      },
      update: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        displayName: `${customer.firstName} ${customer.lastName}`,
        status: customer.status,
        acceptsEmail: customer.acceptsEmail,
        firstSeenAt: customer.firstSeenAt,
        ...(customer.phone !== undefined ? { phone: customer.phone } : {}),
        ...(customer.acceptsSms !== undefined ? { acceptsSms: customer.acceptsSms } : {}),
        ...(customer.notes !== undefined ? { notes: customer.notes } : {}),
        ...(customer.lastSeenAt !== undefined ? { lastSeenAt: customer.lastSeenAt } : {}),
        ...(customer.activatedAt !== undefined ? { activatedAt: customer.activatedAt } : {}),
        ...(customer.blockedAt !== undefined ? { blockedAt: customer.blockedAt } : {}),
      },
      create: {
        storeId,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        displayName: `${customer.firstName} ${customer.lastName}`,
        status: customer.status,
        isGuest: false,
        acceptsEmail: customer.acceptsEmail,
        firstSeenAt: customer.firstSeenAt,
        ...(customer.phone !== undefined ? { phone: customer.phone } : {}),
        ...(customer.acceptsSms !== undefined ? { acceptsSms: customer.acceptsSms } : {}),
        ...(customer.notes !== undefined ? { notes: customer.notes } : {}),
        ...(customer.lastSeenAt !== undefined ? { lastSeenAt: customer.lastSeenAt } : {}),
        ...(customer.activatedAt !== undefined ? { activatedAt: customer.activatedAt } : {}),
        ...(customer.blockedAt !== undefined ? { blockedAt: customer.blockedAt } : {}),
      },
    });
  }

  console.warn(`Seed customers OK — ${DEV_CUSTOMERS.length} clients`);
}
