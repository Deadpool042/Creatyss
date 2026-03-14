# Doctrine — Admin workflows métier (V11)

## 1. Le cycle opérationnel complet

Un admin n'est pleinement utile que lorsque les trois étapes du cycle opérationnel sont fluides :

1. **Voir** — les données sont lisibles, denses, filtrables (V10)
2. **Décider** — l'état pertinent est visible là où la décision se prend
3. **Agir** — l'action est accessible sans aller-retour inutile, et protégée là où la conséquence est irréversible

V11 adresse les étapes 2 et 3.

## 2. Les actions doivent être visibles là où le besoin naît

### Principe

Une action disponible uniquement sur la fiche de détail crée une friction structurelle : l'admin doit naviguer, chercher le contexte, agir, puis revenir. Ce trajet est acceptable pour les actions complexes ou rares. Il est contre-productif pour les transitions courantes et répétitives.

### Application

**Acceptable sur la fiche uniquement :**
- Expédier une commande — nécessite un champ de saisie (référence de suivi)
- Modifier les informations générales d'un produit — formulaire complet
- Gérer les variantes et images — interaction riche

**À rendre accessibles depuis la liste :**
- Passer une commande payée en préparation — transition fréquente, aucune saisie requise
- Publier ou dépublier un produit — toggle de statut, aucune saisie requise
- Annuler une commande — depuis la liste ou la fiche, avec confirmation obligatoire
- Supprimer un article ou un produit — action depuis la fiche, mais avec confirmation obligatoire

## 3. Les actions destructives exigent toujours une confirmation explicite

### Principe

Une action irréversible déclenchée par un seul clic, sans étape intermédiaire, est une vulnérabilité UX. Elle expose à des erreurs de manipulation avec des conséquences réelles sur les données clients et les stocks.

### État actuel (vulnérabilités identifiées)

**"Annuler la commande"** — `order-detail-actions-card.tsx`
→ Bouton `variant="destructive"` lié à un `<form>` avec `action={updateOrderStatusAction}`. Aucune confirmation. Un clic annule la commande.

**"Supprimer le produit"** — `product-danger-zone-section.tsx`
→ Bouton `variant="destructive"` lié à un `<form>` avec `action={deleteProductAction}`. Aucune confirmation. Un clic supprime le produit avec ses variantes et ses images.

### Pattern de confirmation retenu

`AlertDialog` de shadcn/ui — déjà installé dans le projet (`components/ui/alert-dialog.tsx`).

Le pattern est :
1. Un bouton déclencheur affiche l'`AlertDialog`
2. L'`AlertDialog` décrit brièvement la conséquence irréversible
3. Le bouton de confirmation déclenche le Server Action existant
4. Le bouton d'annulation ferme sans rien modifier

Ce composant est un Client Component (`"use client"`). Le Server Action existant n'est pas modifié.

### Classification des actions

| Type | Définition | Pattern |
|------|------------|---------|
| **Action rapide sûre** | Réversible ou sans conséquence durable (ex. changer statut draft→published) | Bouton direct, feedback via redirect |
| **Action qui mérite confirmation** | Irréversible ou à fort impact métier (ex. annuler une commande payée) | `AlertDialog` obligatoire |
| **Action destructive** | Supprime des données définitivement (ex. supprimer un produit) | `AlertDialog` obligatoire, libellé explicite de la conséquence |

## 4. Les actions rapides ne doivent pas contourner les règles métier

### Principe

Exposer une action depuis la liste n'autorise pas à simplifier sa validation. Les règles métier existantes s'appliquent intégralement, y compris pour les quick actions.

### Application

**Transitions de statut commande** : le Server Action `updateOrderStatusAction` existant vérifie déjà les transitions autorisées via `resolveOrderStatusTransition`. Une quick action depuis la liste appelle le même Server Action avec les mêmes validations.

**Statut produit** : le toggle publish/draft passe par le Server Action existant ou un nouveau Server Action ciblé qui respecte les mêmes contraintes que `updateAdminProduct`.

Il n'y a pas de "mode simplifié" pour les quick actions. La vitesse est gagnée sur l'interface, pas sur la validation.

## 5. Les composants client sont justifiés par l'interaction, pas par la commodité

### Principe

Les composants `"use client"` introduits en V11 doivent avoir une raison d'être strictement interactive :
- `AlertDialog` → interaction de confirmation côté navigateur
- `DropdownMenu` → menu interactif au clic
- Toggle de statut → état local avant soumission

Les colonnes de la DataTable sont déjà dans des fichiers `"use client"` (`order-columns.tsx`, `product-columns.tsx`). Les nouveaux composants d'action colocalisés peuvent être des fichiers client séparés importés depuis ces colonnes.

### Ce qu'on évite

- Transformer une page Server Component en page Client Component pour une simple action de liste
- Créer un hook global de gestion d'état pour des actions qui peuvent être gérées via redirect
- Introduire un store de notifications client-side quand le pattern redirect-searchParams suffit

## 6. Le feedback doit être lisible et persistant

### Principe

Le feedback actuel repose sur des redirects avec searchParams (`?order_status=updated`). Ce pattern est solide, server-safe, et ne requiert aucune hydratation côté client. Il doit rester le pattern par défaut.

### Ce que V11 n'impose pas

V11 n'impose pas de remplacer les redirects par des toasts. `sonner.tsx` est installé dans le projet mais son utilisation doit rester optionnelle et ciblée sur des cas où le feedback est secondaire et non critique (ex. confirmation légère après une action sûre depuis la liste).

Les actions critiques — annulation de commande, suppression de produit — gardent le pattern redirect avec `Notice` afin que le feedback soit visible et persistant à la navigation.

## 7. Sobriété structurelle

### Principe

V11 ne doit pas introduire une complexité d'implémentation supérieure à la valeur métier apportée. Chaque composant ajouté doit correspondre à un besoin concret identifié.

Ne pas ajouter :
- Un système de notifications admin si les redirects suffisent
- Un état global de sélection de lignes si les bulk actions ne sont pas cadrées
- Un menu d'actions trop dense si deux actions suffisent

La règle : si l'action tient dans un bouton visible et direct, ne pas ajouter un menu. Le `DropdownMenu` est justifié quand plusieurs actions par ligne coexistent. Pour une seule action par ligne, un lien ou un bouton inline est préférable.
