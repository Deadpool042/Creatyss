"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createNewsletterSubscriberAction } from "@/features/admin/marketing/newsletter/actions/create-newsletter-subscriber.action";

export function AdminNewsletterSubscriberCreateForm() {
  return (
    <form action={createNewsletterSubscriberAction} className="grid gap-4 sm:grid-cols-2">
      <div className="flex flex-col gap-1.5 sm:col-span-2">
        <Label htmlFor="newsletter-email">Email</Label>
        <Input
          id="newsletter-email"
          name="email"
          type="email"
          placeholder="abonne@example.com"
          required
          maxLength={255}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newsletter-first-name">Prénom (optionnel)</Label>
        <Input id="newsletter-first-name" name="firstName" maxLength={120} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="newsletter-last-name">Nom (optionnel)</Label>
        <Input id="newsletter-last-name" name="lastName" maxLength={120} />
      </div>

      <div className="sm:col-span-2">
        <Button type="submit">Ajouter l&apos;abonné</Button>
      </div>
    </form>
  );
}
