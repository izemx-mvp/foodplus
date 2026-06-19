## Module Commandes — Centre Opérationnel

Refonte complète de `/orders` en hub opérationnel multi-vues, plus deux pages spécialisées (`/orders/logistics`, `/orders/billing`). Tout reste en mock (store actuel) ; ajout de champs simulés sur `Order`.

### 1. Données (src/lib/mock-data.ts)

Étendre `Order` :
- `priority: "low" | "normal" | "high"`
- `commercial`, `adv`, `warehouse` (Tanger/Rabat/Marrakech/Agadir)
- `client: { name, ice, address, city, phone, email }` (garder `client` string via getter pour compat)
- `dueDate`, `subtotal`, `tax`, `paid`
- `currentStep: WorkflowStepKey` (déjà construit via workflow)
- `stepHistory: { step, user, date, comment, durationDays }[]`
- `communications: { kind: "email"|"whatsapp"|"call"|"note", author, date, content }[]`
- `aiSuggestions: { tone: "info"|"warning"|"danger"|"success", text }[]`
- `documents`: liste fixe (devis, BC, BP, BL, facture) avec `generatedAt`
- `invoiceStatus: "draft"|"sent"|"pending"|"paid"|"late"`

Mettre à jour `initialOrders` avec données réalistes pour 10 commandes.

### 2. Store (src/lib/store.ts)

Ajouter :
- `addOrder(order)`
- `advanceOrderStep(id)` — marque toutes les tâches de l'étape courante done, passe à la suivante
- `addCommunication(id, comm)`
- `updateOrderClient(id, patch)`
- `addOrderProduct/removeOrderProduct/updateOrderProduct`

### 3. Page principale `/orders` (src/routes/orders.tsx)

**Header KPI** (6 cartes, couleurs sémantiques) :
Commandes du mois · CA du mois · En validation ADV · En préparation · Livraisons du jour · Factures impayées.

**Barre de recherche + filtres** :
- Recherche : N°, client, téléphone, commercial
- Filtres : statut, commercial, ADV, dépôt, ville, date, priorité
- Boutons : ➕ Nouvelle commande, 📤 Export CSV, 🔄 Actualiser

**Pipeline Kanban 9 colonnes** (les `WORKFLOW_STEPS`) :
- Chaque colonne : nom, nombre, valeur DH totale, temps moyen
- Cartes premium (style HubSpot) : N°, badge priorité, client, montant, commercial, ADV, dépôt, dates, nb produits, actions (Voir / Modifier / Étape suivante / Commentaire)
- Drag & drop pour changer d'étape

**Dialog Nouvelle commande** : formulaire compact (client, dépôt, priorité, dates, 1+ produits).

### 4. Fiche complète commande — Sheet latéral 6 onglets

Composant `OrderSheet` (`Sheet` shadcn, `side="right"`, large) avec `Tabs` :

1. **Infos générales** — client (société, ICE, adresse, ville, tél, email), responsables, résumé financier (sous-total, TVA, total, payé, reste).
2. **Produits** — table éditable (ajouter / modifier qté / supprimer) avec colonne stock simulé.
3. **Workflow** — timeline verticale 9 étapes avec ✓/⏳/○, responsable, date, commentaire, temps passé ; checkboxes pour tâches (réutilise existant) + bouton "Étape suivante".
4. **Documents** — 5 cartes (devis, BC, BP, BL, facture) avec actions Voir / Télécharger (toast) / Envoyer.
5. **Communication** — fil chronologique (email/WhatsApp/appel/note) + champ ajout commentaire interne.
6. **IA Assistant** — liste de suggestions colorées + boutons "Relancer client / ADV / logistique", "Générer email", "Générer WhatsApp" (toast simulé).

### 5. Vue 360° (onglet en haut de la page)

Bouton "Commande 360°" dans la fiche → ouvre `Dialog` plein écran 3 colonnes :
- Gauche : infos client + financier
- Centre : workflow temps réel
- Droite : documents + IA + notifications + dernières communications

### 6. Page `/orders/logistics`

Carte Maroc stylisée (SVG simple ou grille) avec 4 dépôts (Tanger, Rabat, Marrakech, Agadir) ; chaque dépôt : stock dispo (mock), commandes à préparer, commandes en retard. Liste détaillée à droite.

### 7. Page `/orders/billing`

Kanban 5 colonnes (Brouillon, Envoyée, En attente, Payée, En retard) basé sur `invoiceStatus`. Carte facture : client, montant, échéance, statut.

### 8. Centre de notifications

Panneau latéral permanent : badge dans le header (réutiliser bouton notif existant) → `Popover` affichant : commandes bloquées ADV, factures à échéance, livraisons en retard, commandes clôturées du jour. Calculées depuis `state.orders`.

### Détails techniques

- Composants shadcn : `Sheet`, `Tabs`, `Dialog`, `Popover`, `Card`, `Badge`, `Checkbox`, `Progress`, `Select`, `Input`, `Textarea`, `DropdownMenu`. Tous déjà présents.
- Drag & drop : étendu aux 9 colonnes (overflow-x scroll).
- Export Excel : CSV téléchargé côté client (Blob, pas de dépendance).
- Pas de backend, pas de Lovable Cloud (mock store en mémoire conservé).
- Couleurs sémantiques via tokens existants (`success`, `warning`, `destructive`, `info`).

### Fichiers touchés

- `src/lib/mock-data.ts` — extension `Order`, données enrichies
- `src/lib/store.ts` — nouvelles actions
- `src/routes/orders.tsx` — refonte (KPI, filtres, kanban 9 colonnes, dialog création, sheet 6 onglets, vue 360°)
- `src/routes/orders.logistics.tsx` — nouveau (carte dépôts)
- `src/routes/orders.billing.tsx` — nouveau (kanban factures)
- `src/components/AppSidebar.tsx` — sous-liens Commandes / Logistique / Facturation
- `src/routes/__root.tsx` — popover notifications branché sur les commandes
