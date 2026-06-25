"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createNewsletterCampaignAction } from "@/features/admin/marketing/newsletter/actions/create-newsletter-campaign.action";

export function AdminNewsletterCampaignCreateForm() {
  return (
    <form action={createNewsletterCampaignAction} className="grid gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-name">Nom interne</Label>
        <Input
          id="campaign-name"
          name="name"
          type="text"
          placeholder="Campagne juin 2026"
          required
          minLength={2}
          maxLength={200}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-subject">Objet de l&apos;email</Label>
        <Input
          id="campaign-subject"
          name="subjectLine"
          type="text"
          placeholder="Découvrez nos nouveautés…"
          required
          minLength={2}
          maxLength={200}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-preview">
          Texte de prévisualisation <span className="text-muted-foreground">(optionnel)</span>
        </Label>
        <Input
          id="campaign-preview"
          name="previewText"
          type="text"
          placeholder="Aperçu affiché dans les clients mail…"
          maxLength={300}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-body-html">Corps HTML</Label>
        <Textarea
          id="campaign-body-html"
          name="bodyHtml"
          placeholder="<p>Bonjour,</p><p>…</p>"
          required
          minLength={10}
          className="min-h-40 font-mono text-xs"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="campaign-body-text">
          Corps texte brut{" "}
          <span className="text-muted-foreground">
            (optionnel — fallback pour clients sans HTML)
          </span>
        </Label>
        <Textarea
          id="campaign-body-text"
          name="bodyText"
          placeholder="Bonjour,&#10;…"
          className="min-h-24"
        />
      </div>

      <div>
        <Button type="submit">Créer la campagne</Button>
      </div>
    </form>
  );
}
