# Template de document d’architecture

## Objectif

Ce document définit le template de référence pour créer ou refondre un document dans `docs/architecture/`.

Tous les documents n’ont pas besoin de toutes les sections, mais leur structure doit rester stable et justifiable.

---

## Template recommandé

```md
# Titre

## Objectif

Pourquoi ce document existe.

## Périmètre

Ce qui est couvert et ce qui ne l’est pas.

## Définitions

Les notions utiles si le document introduit une sémantique locale.

## Règles

Les règles d’architecture qui font autorité.

## Conséquences de conception

Ce que ces règles impliquent pour le design, le code, les flux ou la documentation.

## Anti-patterns à éviter

Les erreurs classiques liées au sujet.

## Documents liés

Les références vers les autres documents structurants.
```

---

## Règles d’usage

### Règle 1 — Un document doit avoir une fonction unique

Un document ne doit pas être simultanément :

- une note de réflexion ;
- un backlog ;
- un inventaire ;
- une doctrine ;
- un guide d’exploitation.

Si plusieurs fonctions coexistent, le document doit être scindé.

### Règle 2 — Les sections doivent servir le sujet

Le template n’est pas un rituel vide.

Une section absente est acceptable si elle n’a aucun sens pour le document.
Une section présente doit être utile.

### Règle 3 — Le ton doit rester normatif

Un document d’architecture sert à cadrer.
Il ne doit pas ressembler à un brouillon de réflexion.

---

## Signaux d’un bon document

Un bon document d’architecture :

- a un objectif explicite ;
- répond à une question identifiable ;
- pose des règles claires ;
- aide à prendre une décision ;
- n’empiète pas sur un autre document sans raison ;
- reste relisible plusieurs mois plus tard.

---

## Signaux d’un mauvais document

Un mauvais document d’architecture :

- mélange plusieurs niveaux d’abstraction ;
- accumule des notes sans structure ;
- répète le glossaire sans nécessité ;
- décrit un sujet trop vaste sans frontières ;
- ne permet pas de savoir ce qui fait autorité.

---

## Règle finale

Lorsqu’un document devient hybride, ambigu ou redondant, il doit être :

- resserré ;
- scindé ;
- renommé ;
- ou supprimé.

La stabilité documentaire prime sur l’accumulation.
