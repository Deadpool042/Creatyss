import { prisma } from "@/db/prisma-client";
import { newsletterSubscriberSelect } from "../types/rows";

export async function findNewsletterSubscriberRowByEmail(email: string) {
  return prisma.newsletterSubscriber.findUnique({
    where: { email },
    select: newsletterSubscriberSelect,
  });
}

export async function listNewsletterSubscriberRows() {
  return prisma.newsletterSubscriber.findMany({
    orderBy: [{ createdAt: "desc" }],
    select: newsletterSubscriberSelect,
  });
}
