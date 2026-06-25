import { type NextRequest, NextResponse } from "next/server";

import { db } from "@/core/db";

/**
 * GET /api/newsletter/unsubscribe?token=<base64url(subscriberId)>
 *
 * Endpoint public de désinscription newsletter (invariant RGPD/LPM).
 * Décode le token, passe l'abonné en UNSUBSCRIBED et retourne une page HTML.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return htmlResponse("Lien invalide", "Le lien de désinscription est invalide ou expiré.");
  }

  let subscriberId: string;

  try {
    subscriberId = Buffer.from(token, "base64url").toString("utf-8");
  } catch {
    return htmlResponse("Lien invalide", "Le lien de désinscription est invalide ou expiré.");
  }

  if (!subscriberId) {
    return htmlResponse("Lien invalide", "Le lien de désinscription est invalide ou expiré.");
  }

  const subscriber = await db.newsletterSubscriber.findUnique({
    where: { id: subscriberId },
    select: { id: true, status: true, archivedAt: true },
  });

  if (!subscriber || subscriber.archivedAt) {
    return htmlResponse(
      "Déjà désinscrit(e)",
      "Vous n'êtes plus inscrit(e) sur notre liste de diffusion."
    );
  }

  if (subscriber.status === "UNSUBSCRIBED") {
    return htmlResponse(
      "Déjà désinscrit(e)",
      "Vous êtes déjà désinscrit(e) de notre liste de diffusion."
    );
  }

  await db.newsletterSubscriber.update({
    where: { id: subscriberId },
    data: {
      status: "UNSUBSCRIBED",
      unsubscribedAt: new Date(),
    },
  });

  return htmlResponse(
    "Désinscription confirmée",
    "Vous êtes désinscrit(e) de notre liste de diffusion. Vous ne recevrez plus nos emails."
  );
}

function htmlResponse(title: string, message: string): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      background: #f9fafb;
      color: #111827;
    }
    .card {
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 2rem 2.5rem;
      max-width: 420px;
      text-align: center;
      box-shadow: 0 1px 3px rgba(0,0,0,.06);
    }
    h1 { font-size: 1.25rem; font-weight: 600; margin: 0 0 .75rem; }
    p  { font-size: .9rem; color: #6b7280; margin: 0; line-height: 1.6; }
  </style>
</head>
<body>
  <div class="card">
    <h1>${title}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
