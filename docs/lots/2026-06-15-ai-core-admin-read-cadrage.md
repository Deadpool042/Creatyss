<!-- docs/lots/2026-06-15-ai-core-admin-read-cadrage.md -->

# Cadrage — `ai.core` ouverture admin bornée en lecture

## Objectif

Sortir `ai.core` de l'état L0 catalogué-sans-code en ouvrant une lecture admin
discrète du modèle réel déjà présent en base (`AiProvider`, `AiTask`), sans
introduire de génération IA, de provider SDK, de workflow de validation ni de
surface assistant artificielle.

## Périmètre

- seed `FeatureFlag` déjà présent, inchangé ;
- nouvelle page `/admin/settings/ai`, visible seulement si `ai.core` est actif ;
- lecture admin de `AiProvider` et `AiTask` via snapshot borné ;
- lien depuis Réglages avancés quand le module est actif ;
- mise à jour doctrine/roadmap de l'état courant.

## Hors périmètre

- création/édition de provider ;
- exécution de tâches IA ;
- intégration OpenAI ou autre provider ;
- workflow d'acceptation / rejet ;
- nouvelles capabilities admin dédiées ;
- ajout d'une entrée sidebar autonome.

## Invariants

- `ai-assistance` reste un module optionnel sensible ;
- aucune sortie IA n'est promue vérité métier ;
- aucune feature “assistant” n'est simulée sans mécanisme réel ;
- la page reste une observation du référentiel, pas un cockpit de production IA.

## Risques

- confusion produit entre “lecture admin du modèle” et “ouverture de l'IA produit” ;
- lecture de tables vides, donc UX potentiellement mince ;
- vocabulaire IA trop large si la page prétend faire plus que lire.

## Vérifications

- `pnpm run typecheck`
- page accessible seulement si `ai.core` actif ;
- page 404 sinon ;
- absence de mutation DB dans ce lot.

## Critères de fin

- `ai.core` n'est plus L0 dans la roadmap ;
- un opérateur interne peut lire l'état réel `AiProvider` / `AiTask` ;
- aucune capacité de génération, d'appel provider ou d'automatisation n'est ajoutée.
