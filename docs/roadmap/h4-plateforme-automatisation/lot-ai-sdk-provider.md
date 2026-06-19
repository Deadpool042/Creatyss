# Lot — AI : SDK provider réel

## Statut

A faire

## Objectif

Brancher un SDK AI réel sur le modèle `AiProvider`/`AiTask` pour remplacer les suggestions locales et déterministes actuelles par des appels à un modèle de langage. Les niveaux `basic`/`assistant`/`advanced`/`automation` sont observés comme câblés mais sans provider SDK réel.

## Périmètre

Proposition — non observé comme implémenté à ce jour :

- `prisma/optional/ai/ai.prisma` — modèles `AiProvider` et `AiTask` déjà posés (observés)
- `features/ai-assistance/` — remplacement de la logique de suggestion locale par des appels SDK
- Configuration du provider : stockage de la clé API dans les variables d'environnement, enregistrement de l'`AiProvider` en DB
- Traçabilité : chaque appel SDK crée un `AiTask` avec statut, modèle utilisé, tokens consommés
- Surfaces concernées : SEO produit (niveau `basic`, déjà câblé) et SEO blog (niveau `assistant`, déjà câblé)

## Hors périmètre

- Assistant IA global (chatbot, aide contextuelle générale)
- Auto-génération et auto-publication de contenu sans validation humaine
- Multi-surfaces (extension à d'autres usages que SEO produit et blog)
- Calcul de coût et facturation par usage
- Fine-tuning ou modèles custom

## Dépendances

- Clé API provider AI (Anthropic Claude, OpenAI ou autre) — prérequis externe
- Décision sur le provider cible — à trancher en `architect-review`
- `ai.core` L3 observé avec surfaces SEO câblées comme base de départ

## Invariants

- La clé API ne doit jamais être exposée côté client ni dans les logs
- Les suggestions IA restent manuelles et réversibles — aucune suggestion ne s'applique automatiquement sans validation humaine
- Chaque appel SDK doit créer un `AiTask` tracé avec statut (`PENDING`/`SUCCEEDED`/`FAILED`) — l'observabilité est un invariant
- Si le provider est indisponible, le flux applicatif ne doit pas planter — dégradation gracieuse avec message d'erreur clair

## Risques

- Coût par token : un usage non borné de l'IA peut générer des coûts imprévus — rate limiting ou quota par boutique à prévoir
- Latence : les appels LLM peuvent prendre plusieurs secondes — l'UX doit refléter l'état `PENDING` de façon explicite
- Dépendance externe : si Anthropic ou OpenAI change son API ou ses prix, le lot doit être réadapté
- Contenu généré : les suggestions SEO générées peuvent contenir des inexactitudes — la validation humaine avant publication est obligatoire

## Vérifications

- `pnpm run typecheck`
- `pnpm run lint`
- Test manuel : suggestion SEO produit via SDK réel, vérification du `AiTask` créé en DB avec statut et tokens
- Test de dégradation gracieuse : provider indisponible → message d'erreur sans crash

## Critères de fin

- Une suggestion SEO est générée via un appel SDK réel au provider configuré
- Chaque appel crée un `AiTask` tracé en DB avec statut et métadonnées
- La clé API est dans les variables d'environnement, jamais en DB en clair
- La dégradation gracieuse est vérifiée (provider indisponible)
- `typecheck` et `lint` passent sans erreur

## Agent recommandé

`architect-review` pour le choix du provider et la conception du pattern d'appel SDK avec traçabilité, puis `next-feature-builder` pour l'implémentation.
