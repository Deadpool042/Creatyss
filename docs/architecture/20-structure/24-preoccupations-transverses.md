# Préoccupations transverses

## Objectif

Ce document recense les préoccupations transverses structurantes du système.

Une préoccupation transverse est une responsabilité qui traverse plusieurs domaines, couches ou flux.

Elle n’est pas secondaire par nature.
Elle peut être structurellement indispensable.

---

## Définition

Relèvent de cette catégorie les mécanismes ou politiques qui :

- ne se limitent pas à un seul domaine ;
- influencent plusieurs zones du système ;
- nécessitent une gouvernance explicite ;
- participent à la robustesse, la traçabilité ou la cohérence globale.

---

## Préoccupations transverses structurantes de Creatyss

À l’état actuel de la doctrine, les préoccupations transverses suivantes doivent être considérées comme structurantes.

### Audit

L’audit est une préoccupation transverse critique.

Il sert à tracer des actions, changements ou décisions significatifs selon un point de vue fonctionnel ou opératoire.

Il ne relève pas d’un domaine local unique.

Référence :

- `../../domains/cross-cutting/audit.md`

### Observabilité

L’observabilité est une préoccupation transverse critique.

Elle rend le système :

- lisible ;
- diagnosable ;
- opérable ;
- corrélable dans le temps.

Elle ne doit pas être réduite à une simple accumulation de logs.

Référence :

- `../../domains/cross-cutting/observability.md`

### Jobs

Les jobs constituent une préoccupation transverse lorsqu’ils servent :

- des traitements différés ;
- des reprises ;
- des synchronisations ;
- des tâches techniques partagées ;
- des traitements non bornés à un seul domaine.

Référence :

- `../../domains/cross-cutting/jobs.md`

### Événements de domaine et backbone asynchrone

Le backbone événementiel constitue une préoccupation transverse structurante.

Il traverse plusieurs domaines et plusieurs flux.
Il doit rester gouverné, visible et borné.

Sa nature transverse ne le rend pas optionnel.

### Intégrations

Les intégrations sont transverses lorsqu’elles organisent les échanges entre le coeur et plusieurs systèmes externes.

Elles ne doivent pas être traitées comme de simples détails techniques locaux.

Référence :

- `../../domains/core/integrations.md`

---

## Règle importante

Transverse ne signifie pas optionnel.

Dans Creatyss :

- audit ;
- observabilité ;
- jobs ;
- événements ;
- intégrations structurantes

peuvent être classés comme transverses **et** non optionnels.

Leur rang documentaire ne doit jamais être interprété comme une baisse de criticité.

---

## Règle de conception

Toute préoccupation transverse significative doit :

- avoir une doctrine explicite ;
- posséder des conventions de mise en oeuvre ;
- déclarer son périmètre ;
- expliciter sa criticité ;
- être visible dans la documentation d’architecture ;
- être reliée à ses points d’impact dans les domaines.

---

## Risques à éviter

Une préoccupation transverse mal gouvernée produit souvent :

- du code dupliqué ;
- des comportements implicites ;
- des trous de traçabilité ;
- des politiques incohérentes ;
- une dette technique invisible.

---

## Anti-patterns à éviter

Le système doit éviter :

- de classer comme “secondaire” ce qui est simplement transverse ;
- de disperser l’audit ou l’observabilité sans doctrine explicite ;
- de multiplier les mécanismes asynchrones sans gouvernance commune ;
- de traiter les intégrations comme des ajouts opportunistes sans politique de robustesse.

---

## Documents liés

- `../30-execution/30-evenements-de-domaine-et-flux-asynchrones.md`
- `../30-execution/31-jobs-et-traitements-en-arriere-plan.md`
- `../30-execution/32-integrations-et-adaptateurs-fournisseurs.md`
- `../40-exploitation/42-observabilite-et-audit.md`
- `../../domains/cross-cutting/`
