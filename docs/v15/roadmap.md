# Roadmap V15

## Objectif général

La V15 vise à transformer Creatyss en base réutilisable multi-projets.

Après la séquence V12 → V14, le projet dispose déjà :

- d’une base UI plus cohérente
- d’une couche admin largement stabilisée
- d’une meilleure séparation entre thème, composants et écrans
- d’un CSS custom progressivement réduit

Le prochain gain principal n’est plus seulement un cleanup CSS supplémentaire.

Le prochain gain principal est la capacité à :

- réutiliser une partie importante du projet sur d’autres e-commerces
- changer l’identité visuelle sans réécrire la structure
- installer des patterns stabilisés via un registry
- s’appuyer sur le MCP shadcn pour accélérer cette réutilisation

## Principes de travail

Chaque lot V15 doit respecter les règles suivantes :

- priorité à la réutilisabilité réelle
- pas d’extraction abstraite sans usage concret
- admin prioritaire sur storefront pour la mutualisation
- thème séparé de la structure
- pas de nouvelle complexité gratuite
- pas de refonte métier sous couvert d’extraction
- TypeScript strict
- aucun `any`
- pas de dépendance inutile

## Cadrage de la V15

La V15 repose sur une séparation claire entre trois couches.

### 1. Foundation thème

Couche pilotée par tokens et variables.

Elle comprend notamment :

- les tokens `:root`
- `.dark`
- `@theme inline`
- les alias de couleurs sémantiques
- les surfaces
- les radius
- les couleurs sidebar
- les variables de brand
- les règles de base minimales

Cette couche ne doit pas être traitée comme du legacy CSS à supprimer.

### 2. Registry réutilisable

Couche destinée à contenir les patterns stables réinstallables d’un projet à l’autre.

Elle doit contenir en priorité :

- les patterns admin stabilisés
- certaines surfaces transverses neutres
- quelques wrappers ou sections réutilisables
- les blocs dont la variabilité métier est faible

### 3. Projet client

Couche spécifique au projet final.

Elle comprend notamment :

- le storefront propre au client
- les variations de storytelling
- les sections marketing spécifiques
- les adaptations catalogue propres au projet
- les choix UX propres au contexte client

## Ordre de priorité V15

### Priorité 1 — Admin réutilisable

L’admin est la couche la plus stable d’un projet à l’autre.

C’est donc le premier candidat à l’extraction registry.

### Priorité 2 — Foundation de thème

Le thème doit devenir la vraie variable d’adaptation entre projets.

L’objectif est de pouvoir changer l’identité visuelle sans réécrire les patterns d’interface.

### Priorité 3 — Workflow MCP

Le registry ne doit pas être théorique.

Il faut valider un vrai usage avec le MCP shadcn :

- navigation
- recherche
- installation
- réinstallation dans un autre projet
- maintien de cohérence

### Priorité 4 — Public réutilisable limité

Le storefront ne doit pas être extrait massivement.

Seuls les blocs publics suffisamment neutres et réellement stables doivent sortir du projet.

---

## V15-1 — Registry strategy

### Objectif

Définir la stratégie d’extraction registry pour Creatyss.

### Attendus

- identifier ce qui doit sortir en registry
- identifier ce qui doit rester local au projet
- définir les conventions de nommage
- définir les namespaces
- formaliser la frontière admin / public / thème
- cadrer le rôle du MCP shadcn dans le workflow

### Intention

Ce lot doit empêcher une extraction opportuniste ou floue.

Il pose la doctrine avant les extractions réelles.

---

## V15-2 — First admin registry extraction

### Objectif

Extraire un premier lot très stable de patterns admin vers un registry compatible shadcn.

### Cibles probables

- `AdminPageShell`
- `AdminFormSection`
- `AdminFormField`
- `AdminFormActions`
- `Notice`
- éventuellement quelques cards admin très stables

### Attendus

- premiers items registry exploitables
- structure initiale du registry
- fichiers de configuration cohérents
- première validation de réinstallation possible

### Intention

Commencer petit, sur les patterns les plus stables du projet.

---

## V15-3 — Theme packs foundation

### Objectif

Valider que la structure du projet peut supporter plusieurs identités visuelles sans réécriture des patterns d’interface.

### Attendus

- formalisation d’un thème Creatyss
- création d’un second thème de test pour un autre client fictif
- validation de la variabilité sur les tokens principaux
- clarification de ce qui relève du thème et de ce qui relève de la structure

### Intention

Montrer que le vrai point de variation entre projets est bien le thème, pas la structure admin.

---

## V15-4 — MCP workflow validation

**Statut : validé (complété par V15-4B).**

### Objectif

Valider un vrai usage du MCP shadcn avec le registry produit.

### Attendus

- navigation dans le registry
- recherche d’items
- installation d’items par langage naturel
- vérification que le workflow est réellement utile
- documentation des limites et du bon usage

### Intention

Éviter de mettre en place un registry “théorique” non utilisé en pratique.

### V15-4B — Local HTTPS and hosted registry validation

**Statut : validé.**

Lot de complément qui a permis de valider complètement le workflow namespace en conditions HTTPS réelles.

- Traefik + nginx locaux opérationnels
- `https://registry.creatyss.localhost` servi et accessible
- namespace `@creatyss` fonctionnel dans `components.json`
- `npx shadcn add @creatyss/notice --dry-run` → OK
- `npx shadcn add @creatyss/admin-form-section --dry-run` → OK (dépendances résolues)
- friction documentée : `NODE_EXTRA_CA_CERTS` requis pour Node.js + mkcert
- hébergement public non requis pour valider le workflow local

---

## V15-5 — Selective public registry extraction

**Statut : validé. 2 items extraits (`empty`, `spinner`). Storefront conservé local.**

### Objectif

Extraire seulement quelques patterns publics réellement stables et réutilisables.

### Résultat

- Storefront public : 0 pattern extractible (tout couplé à Creatyss)
- `empty` extrait : compound empty state, 100% token-driven, zéro contenu Creatyss
- `spinner` extrait : loading spinner trivial, universel
- `item`, `field`, `input-group` : reportés à V15-6 (primitives transverses, pas storefront)
- Registry passe de 6 à 8 items

### Intention

Le storefront doit rester adaptable.

Ce lot ne doit pas transformer le front public en structure rigide commune à tous les projets.

---

## V15-6 — Registry consolidation and documentation

**Statut : validé. V15 terminée. Registry : 11 items.**

### Objectif

Consolider le registry, documenter les conventions retenues et clôturer proprement la phase initiale d’extraction.

### Résultat

- `item`, `field`, `input-group` extraits
- Registry final : 11 items (4 admin, 2 composants transverses, 5 primitives UI)
- Documentation complète du registry, du thème, du périmètre local et du workflow
- V15 clôturée — base multi-projets opérationnelle

### Intention

Sortir de V15 avec une base réellement exploitable pour d’autres projets, pas avec une extraction partielle difficile à relire.

---

## Sortie attendue de V15

À la fin de la V15, Creatyss doit idéalement disposer :

- d’une stratégie registry claire
- d’un premier registry compatible shadcn
- d’un premier lot de patterns admin extraits
- d’une base de thème plus explicitement pilotée
- d’un workflow MCP validé en pratique
- d’une séparation claire entre :
  - structure réutilisable
  - thème variable
  - storefront spécifique projet

## Suite logique après V15

Une fois cette base posée, la suite logique pourra être :

- retour aux sujets métier
- nouvelles fonctionnalités e-commerce
- paiements réels
- gestion de stock
- durcissement des flux commande
- ou poursuite sélective de l’extraction registry si un vrai besoin multi-projets se confirme

## Résumé

La V15 marque un pivot.

Le sujet n’est plus seulement de nettoyer l’existant.

Le sujet devient de transformer Creatyss en base premium réutilisable, avec :

- un admin largement mutualisable
- un thème réellement variable d’un projet à l’autre
- un storefront restant adaptable
- un registry et un workflow MCP capables de soutenir cette réutilisation.
