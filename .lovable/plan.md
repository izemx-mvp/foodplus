
# Restructuration majeure Foodplus

## 1. Fusion Leads + CRM → `/leads` (single interface)

Une seule page avec:
- **Filtres** en haut: recherche, secteur, ville, statut, score min
- **Toggle de vue**: `Liste` | `Kanban` | `Calendrier`
- **Vue Liste**: tableau actuel amélioré
- **Vue Kanban**: colonnes par statut (Nouveau / Qualifié / Contacté / Négociation / Gagné / Perdu) avec **drag & drop** pour changer le statut
- **Vue Calendrier**: prochaines relances / RDV par jour
- **Détail lead** (dialog au clic): infos complètes (entreprise, contact, email, tél, secteur, ville, score, notes, historique, valeur estimée) + **changer le statut** via select + bouton "Générer message IA"

→ Supprimer `/crm` (route + lien sidebar). Le pipeline kanban devient la vue Kanban de `/leads`.

## 2. Marketing `/marketing` — 3 onglets

### Onglet `Configuration`
- Site web (input URL)
- Logo entreprise (upload / URL)
- Description Foodplus (textarea)
- Tonalité (select: Professionnel, Convivial, Premium, Inspirant, Humoristique)
- Fréquence auto-génération posts (select: Quotidien, 3x/sem, Hebdo, Mensuel)
- Bouton "Enregistrer"

### Onglet `Idées`
- Bouton **"Générer plus d'idées"** (mock — ajoute 3 idées simulées IA)
- Liste d'idées (titre, hook, plateformes suggérées, tonalité). Chaque idée:
  - Bouton **Planifier** (ouvre dialog: date + plateformes Instagram/Facebook/LinkedIn/TikTok)
  - Bouton **Publier maintenant**
  - Bouton supprimer

### Onglet `Calendrier`
- Filtre vue: `Grille mensuelle` | `Vue Agenda (liste)`
- Posts planifiés affichés
- Bouton **"Générer un post"** (ouvre dialog création):
  - Nombre d'images souhaité
  - Description de chaque image
  - Tonalité du post
  - Description / idée du post
  - Plateformes cibles (multi-select: Instagram, Facebook, LinkedIn, TikTok, X)
  - Date de publication
  - Bouton "Créer" → ajoute au calendrier

→ Supprimer `/integrations` et `/workflow` (routes + liens sidebar).

## 3. Commandes `/orders`

- **Filtres**: recherche, statut, client
- **Toggle vue**: `Liste` | `Kanban`
- **Vue Kanban**: colonnes par statut (Préparation / En cours / Livrée / En retard) avec **drag & drop**
- **Détail commande** (dialog au clic): client, articles, total, date, livreur, adresse, historique statut + changer statut

## 4. Sidebar mise à jour

Dashboard · Leads & CRM · Marketing · Commandes · Emails

## Technique
- État global: étendre `src/lib/store.ts` (config marketing, idées, posts planifiés)
- Mock data: ajouter idées de posts, posts planifiés, articles de commande, notes leads
- Drag & drop: HTML5 native (déjà utilisé dans CRM actuel)
- Calendrier: grille mensuelle custom légère (pas de lib externe)
- Routes supprimées: `/crm`, `/workflow`, `/integrations` (fichiers supprimés, TanStack régénère routeTree)

## Fichiers
- Modifier: `src/lib/store.ts`, `src/lib/mock-data.ts`, `src/components/AppSidebar.tsx`, `src/routes/leads.tsx`, `src/routes/marketing.tsx`, `src/routes/orders.tsx`
- Supprimer: `src/routes/crm.tsx`, `src/routes/workflow.tsx`, `src/routes/integrations.tsx`
