# V15-4B — Local HTTPS and hosted registry validation

## Statut

**Validé.** Le workflow namespace `@creatyss` fonctionne en conditions réalistes.

---

## Objectif du lot

V15-4B prolonge V15-4 sur le seul point qui restait bloquant : valider le workflow registry complet en conditions HTTPS réelles, avec namespace et résolution automatique des dépendances.

Après V15-4, la conclusion était claire :

- le registry fonctionnait via `npx shadcn add ./registry/items/[item].json`
- mais le namespace `@creatyss/...` dans `components.json` n'était pas encore testable
- la raison n'était pas un problème de structure des items
- la raison était l'absence d'un registry servi via une vraie URL HTTPS

V15-4B a résolu ce point en mettant en place un environnement local HTTPS avec Traefik + nginx, et en validant réellement les commandes shadcn avec namespace.

---

## Infrastructure mise en place

### Services Docker

Deux services ajoutés au `docker-compose.yml` :

**`traefik`** — reverse proxy local
- ports 80 et 443
- routing par label Docker
- TLS servi depuis les certs mkcert montés

**`registry`** — serveur nginx statique
- sert les fichiers JSON du répertoire `registry/`
- accessible uniquement via Traefik

### URLs locales

| URL | Cible |
|-----|-------|
| `https://creatyss.localhost` | Application Next.js |
| `https://registry.creatyss.localhost` | Registry shadcn Creatyss |

### Fichiers de configuration

| Fichier | Rôle |
|---------|------|
| `docker/traefik/traefik.yml` | Configuration Traefik (entrypoints, providers) |
| `docker/traefik/tls.yml` | Déclaration des certificats TLS |
| `docker/traefik/certs/local.crt` | Certificat mkcert (gitignored) |
| `docker/traefik/certs/local.key` | Clé privée mkcert (gitignored) |
| `docker/registry/nginx.conf` | Configuration nginx pour le registry |

### Routes nginx

Le registry nginx sert les items à plusieurs chemins pour être compatible avec les différentes conventions de résolution du CLI shadcn :

- `https://registry.creatyss.localhost/{name}.json`
- `https://registry.creatyss.localhost/r/{name}.json`
- `https://registry.creatyss.localhost/r/styles/[style]/{name}.json`

---

## Setup initial (à faire une seule fois)

### 1. Générer les certificats TLS locaux

```bash
make certs
```

Requiert `mkcert` installé. Génère `docker/traefik/certs/local.crt` et `local.key` pour les domaines `creatyss.localhost` et `registry.creatyss.localhost`.

### 2. Ajouter les entrées DNS locales

```bash
sudo make hosts-setup
```

Ajoute dans `/etc/hosts` :

```
127.0.0.1 creatyss.localhost
127.0.0.1 registry.creatyss.localhost
```

---

## Configuration `components.json`

Le namespace est déclaré dans `components.json` :

```json
{
  "registries": {
    "@creatyss": {
      "url": "https://registry.creatyss.localhost/{name}.json"
    }
  }
}
```

### Contraintes de format (cause des échecs précédents)

Le schéma officiel (`https://ui.shadcn.com/schema.json`) impose :

- la clé **doit commencer par `@`**
- la valeur objet n'accepte que `url`, `params`, `headers` (`additionalProperties: false`)
- l'URL **doit contenir `{name}`** (validé par regex)
- `"style"` n'est **pas** une propriété valide → cause `Invalid configuration`

---

## Limite Node.js / mkcert

Node.js ne trust pas automatiquement la CA racine de mkcert. Sans configuration supplémentaire, le CLI shadcn échoue avec une erreur de certificat auto-signé.

### Solution

Exporter la variable avant d'utiliser le CLI :

```bash
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

Cette variable doit être définie dans chaque session de terminal où `npx shadcn add @creatyss/...` est utilisé. Elle peut être ajoutée au `.zshrc` ou `.bashrc` si le workflow est fréquent.

---

## Validation réelle

### Prérequis

```bash
make up  # services Traefik + app + registry démarrés
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

### Commandes validées

```bash
npx shadcn add @creatyss/notice --dry-run
```

Résultat : **OK** — résolution correcte vers `https://registry.creatyss.localhost/notice.json`.

```bash
npx shadcn add @creatyss/admin-form-section --dry-run
```

Résultat : **OK** — résolution correcte de l'item + résolution automatique des dépendances `card`, `separator`, `@creatyss/section-intro`.

### Ce qui a été vérifié

- le namespace `@creatyss` est correctement lu depuis `components.json`
- le CLI route vers le registry local, pas vers `ui.shadcn.com`
- les `registryDependencies` sont résolues dans le bon ordre
- la dépendance croisée `@creatyss/section-intro` est résolue via le même registry local

---

## Conclusion

### Ce lot est clos

Le workflow namespace local est **pleinement validé**. Le registry Creatyss est opérationnel en conditions HTTPS réalistes.

### Ce qui fonctionne

- infrastructure locale Traefik + registry nginx : opérationnelle
- namespace `@creatyss` dans `components.json` : opérationnel
- résolution d'items via URL HTTPS locale : opérationnelle
- résolution automatique des dépendances inter-items : opérationnelle
- `npx shadcn add @creatyss/notice --dry-run` : validé
- `npx shadcn add @creatyss/admin-form-section --dry-run` : validé

### Ce qui n'est pas requis

Un hébergement public du registry **n'est pas nécessaire** pour valider le workflow local. La mise en production du registry sur un VPS ou CDN est une décision future indépendante de la validation du workflow.

### Friction restante

La seule friction identifiée est la variable `NODE_EXTRA_CA_CERTS` à définir manuellement dans chaque session. Elle est documentée ci-dessus et ne bloque pas l'usage.

---

## Suite logique

V15-4B étant validé, V15-4 est désormais **pleinement validé en local**.

La suite logique est V15-5 — Selective public registry extraction.
