# Lot V7-4 — Détail commande

Cadre général : `docs/v7/admin-ui-ux-doctrine.md`
Roadmap : `docs/v7/admin-ui-ux-roadmap.md`

---

## Objectif

Découper `orders/[id]/page.tsx` (~441 lignes) en composants de section colocalisés. Réduire `page.tsx` à son rôle d'orchestration.

---

## Périmètre

- `app/admin/(protected)/orders/[id]/page.tsx`
- Composants colocalisés dans `app/admin/(protected)/orders/[id]/`
- Promotion vers `components/admin/` si un composant est réutilisable sur d'autres pages

### Sections cibles

- Synthèse et état de la commande
- Actions disponibles (expédition, transitions de statut)
- Expédition et suivi
- Paiement
- Emails transactionnels
- Informations cliente
- Adresses de livraison et de facturation
- Récapitulatif des lignes

### Responsabilités de `page.tsx`

Le `page.tsx` se limite à :

- charger les données de la commande
- résoudre les params et search params
- mapper les messages de statut ou d'erreur
- déléguer chaque section à son composant

---

## Hors périmètre

- Aucun changement de comportement
- Aucun changement de wording
- Aucune modification de repository, de schéma ou de Server Action
- Les `<article>` sémantiques présents sont préservés

---

## Contraintes UI/UX

- Maintenir une hiérarchie visuelle claire et une densité maîtrisée sur les sections extraites
- Les sections doivent rester rapides à parcourir et lisibles
- Les nouveaux composants suivent la base prioritaire shadcn/ui + Tailwind

---

## Vérifications

```bash
pnpm run typecheck
pnpm exec playwright test tests/e2e/admin/orders.spec.ts
```

---

## Critères de validation

- Le comportement de la page est identique avant et après le découpage
- Aucun heading métier visible n'est renommé
- Les sections extraites restent rapides à parcourir, cohérentes et lisibles
- `page.tsx` fait moins de 200 lignes après le lot
- `pnpm run typecheck` passe sans erreur
- Les tests e2e ciblés passent sans régression
