# V15-6 — Registry consolidation and documentation

## Statut

**Validé. V15 est terminée. Le registry compte 11 items.**

---

## Audit final du registry

### État avant V15-6

8 items extraits lors des lots V15-2, V15-4, V15-5.

### Candidats restants examinés

| Composant         | Verdict     | Raison                                                                                   |
| ----------------- | ----------- | ---------------------------------------------------------------------------------------- |
| `item.tsx`        | **Extrait** | Compound list-item, zéro couplage, 100% token-driven, CVA, `asChild`, API propre         |
| `field.tsx`       | **Extrait** | Compound form field avec déduplication d'erreurs, orientations responsive, zéro couplage |
| `input-group.tsx` | **Extrait** | Compound input avec addons inline/block, gestion complète focus/invalid, zéro couplage   |

Les trois composants passent tous les critères : aucun contenu Creatyss, entièrement pilotés par les tokens du thème, API lisible, CVA standard, utilisables dans n'importe quel projet.

### Typecheck

```
pnpm run typecheck → clean (0 erreur)
```

---

## Registry final — 11 items

### Couche Admin (4 items)

| Item                 | Type                 | Dépendances registry                           | Description                                                                 |
| -------------------- | -------------------- | ---------------------------------------------- | --------------------------------------------------------------------------- |
| `admin-form-actions` | `registry:component` | —                                              | Flex row wrapper pour les boutons d'action d'un formulaire admin            |
| `admin-form-field`   | `registry:component` | `label`                                        | Champ de formulaire admin avec label, description optionnelle et slot input |
| `admin-page-shell`   | `registry:component` | —                                              | Shell de page admin : eyebrow, titre, description, slot actions, séparateur |
| `admin-form-section` | `registry:component` | `card`, `separator`, `@creatyss/section-intro` | Section de formulaire admin en card avec header optionnel                   |

### Couche Transverse — composants (2 items)

| Item            | Type                 | Dépendances registry | Description                                                        |
| --------------- | -------------------- | -------------------- | ------------------------------------------------------------------ |
| `notice`        | `registry:component` | —                    | Message de feedback inline : `success`, `alert`, `note`            |
| `section-intro` | `registry:component` | —                    | Bloc eyebrow + titre + description pour les sections. `h2` ou `h3` |

### Couche Transverse — primitives UI (5 items)

| Item          | Type          | Dépendances registry          | Description                                                                               |
| ------------- | ------------- | ----------------------------- | ----------------------------------------------------------------------------------------- |
| `empty`       | `registry:ui` | —                             | Compound empty state : conteneur centré en tirets, icon, titre, description, contenu      |
| `spinner`     | `registry:ui` | —                             | Loading spinner `Loader2Icon` avec `animate-spin` et `role="status"`                      |
| `item`        | `registry:ui` | `separator`                   | Compound list-item : media, contenu, titre, description, actions, header, footer          |
| `field`       | `registry:ui` | `label`, `separator`          | Compound form field : orientations `vertical`/`horizontal`/`responsive`, erreurs, légende |
| `input-group` | `registry:ui` | `button`, `input`, `textarea` | Compound input avec addons inline et block, texte, bouton, gestion états                  |

---

## Ce qui reste local

### Storefront public

Tout le storefront public est volontairement conservé dans le projet.

| Zone                       | Raison                                                                                        |
| -------------------------- | --------------------------------------------------------------------------------------------- |
| `public-site-shell`        | Nom de marque Creatyss, nav hardcodée, labels français, variables CSS `--shell-*` spécifiques |
| Pages boutique / catalogue | Logique métier catalogue, modèle de données Creatyss, contenu français                        |
| Pages blog                 | Narration éditoriale spécifique                                                               |
| Pages panier / checkout    | Flux commande, données client, "France" hardcodé                                              |

**Ce n'est pas un oubli.** Le storefront est par nature variable selon le client et le projet. L'extraire serait extraire l'identité Creatyss, pas un pattern réutilisable.

### Primitives non extraites

| Composant        | Raison                                                                                   |
| ---------------- | ---------------------------------------------------------------------------------------- |
| `data-table`     | Strings français hardcodées dans la pagination et les états vides                        |
| `combobox`       | Dépendance `@base-ui/react` non standard, complexité élevée                              |
| `auth-shell`     | Une couleur décorative hardcodée, hors périmètre                                         |
| `badge` (étendu) | Extension mineure de shadcn, gain trop faible                                            |
| `card` (étendu)  | Extension mineure de shadcn (`size`, `CardAction`), shadcn le fera probablement lui-même |

### Artefacts scaffold

`components/section-cards.tsx` et `components/site-header.tsx` sont des résidus shadcn sans usage réel dans le projet. Ils n'ont pas été extraits car ils ne correspondent pas à des patterns métier stabilisés.

---

## La couche thème

### Rôle

Le thème est la variable principale d'adaptation entre projets. Changer de thème doit permettre de changer l'identité visuelle sans modifier les composants du registry.

### Fichiers

| Fichier               | Description                                                                                    |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `themes/creatyss.css` | Identité Creatyss : amber brand `oklch(0.523 0.112 53.7)`, sidebar clair, `--radius: 0.625rem` |
| `themes/novamart.css` | Identité client test : indigo brand `oklch(0.52 0.18 262)`, sidebar sombre, `--radius: 0.5rem` |

### Tokens à changer d'un projet à l'autre

Les tokens principaux à redéfinir pour une nouvelle identité :

- `--brand` — couleur principale de marque
- `--primary` / `--primary-foreground` — couleur d'action principale
- `--sidebar-background` / `--sidebar-*` — identité de la sidebar admin
- `--background` / `--card` — surfaces principales
- `--radius` — arrondis globaux

### Ce qui reste stable

Les tokens de structure sémantique (`--foreground`, `--border`, `--muted`, `--destructive`, `--ring`, etc.) doivent rester définis mais peuvent varier dans leur valeur précise selon le contexte.

### Compatibilité registry / thème

Tous les items du registry sont 100% pilotés par les tokens sémantiques. Aucun n'embarque de valeur de couleur hardcodée (à l'exception de `notice` dont le `success` tone utilise les classes emerald de Tailwind — connu, documenté, acceptable).

---

## Workflow local — utilisation du registry sur un nouveau projet

### Prérequis (à faire une fois par machine)

```bash
# 1. Générer les certificats TLS locaux
make certs

# 2. Ajouter les entrées DNS locales
sudo make hosts-setup

# 3. Exporter la CA mkcert pour Node.js
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
# → À ajouter dans .zshrc/.bashrc pour ne pas avoir à le refaire
```

### Démarrer l'environnement

```bash
make up
# → Démarre Traefik + app + registry
# → https://creatyss.localhost     → application
# → https://registry.creatyss.localhost  → registry shadcn
```

### Installer un item

```bash
# Syntaxe namespace (@creatyss = clé dans components.json > registries)
npx shadcn add @creatyss/admin-page-shell
npx shadcn add @creatyss/empty
npx shadcn add @creatyss/field

# Avec dry-run pour vérifier avant installation
npx shadcn add @creatyss/admin-form-section --dry-run
```

### Configuration `components.json`

```json
{
  "registries": {
    "@creatyss": {
      "url": "https://registry.creatyss.localhost/{name}.json"
    }
  }
}
```

Règles du schéma shadcn :

- La clé **doit commencer par `@`**
- L'URL **doit contenir `{name}`**
- Seules `url`, `params`, `headers` sont valides dans l'objet (pas `style`)

### Résolution des dépendances

Le CLI shadcn résout automatiquement :

- les dépendances shadcn standard (`card`, `separator`, `label`, `button`, etc.)
- les dépendances `@creatyss/*` croisées (ex : `admin-form-section` → `@creatyss/section-intro`)

---

## Frontière claire : registry / thème / local

```
registry/                    ← patterns stables réinstallables
  items/                     ← 11 items
  index.json                 ← manifest

themes/                      ← identités visuelles
  creatyss.css               ← thème Creatyss
  novamart.css               ← thème client test

app/                         ← storefront local (ne pas extraire)
components/public/           ← shells et patterns publics (ne pas extraire)
components/admin/            ← implémentation locale admin (les items registry en sont une copie)
```

**Le registry est un miroir stable de certains composants locaux.** Le fichier source dans `components/` reste la référence vivante du projet. Le registry embarque le contenu inline pour la redistribution.

---

## Conclusion V15

### Ce qui est réutilisable aujourd'hui

Le registry Creatyss constitue un premier noyau solide et honnête :

- **4 composants admin** complets, couvrant les patterns les plus récurrents de n'importe quel back-office
- **2 composants transverses** simples (`notice`, `section-intro`) applicables admin et public
- **5 primitives UI** génériques (`empty`, `spinner`, `item`, `field`, `input-group`) utilisables dans tout projet React / Next.js avec shadcn

Ces 11 items sont :

- zéro couplage Creatyss
- 100% token-driven
- compatibles avec les deux thèmes testés
- installables via `npx shadcn add @creatyss/...`
- résolvant automatiquement leurs dépendances

### Ce qui n'est pas encore extrait (et c'est normal)

Le storefront Creatyss reste 100% local. Ce n'est pas une dette — c'est le comportement attendu d'un storefront e-commerce dont l'identité est par nature propre au projet.

Les quelques composants non extraits (`data-table`, `combobox`, `auth-shell`, extensions de primitives) ont été refusés pour des raisons précises documentées, pas par oubli.

### Maturité de la base multi-projets

Creatyss est aujourd'hui une base multi-projets **crédible et opérationnelle** pour un premier usage réel.

Ce qui manque pour aller plus loin n'est pas dans le registry — c'est l'usage réel sur un second projet, qui seul permettra de valider quels patterns supplémentaires méritent d'être extraits.

### V15 est terminée

Tous les lots V15-1 → V15-6 sont validés.

La suite logique n'est pas une nouvelle vague d'extraction, mais :

- l'utilisation réelle de cette base sur un autre projet
- ou le retour aux sujets métier du projet courant (fonctionnalités e-commerce, paiements, stock)
