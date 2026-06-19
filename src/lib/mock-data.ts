export type LeadStatus = "new" | "qualified" | "contacted" | "negotiation" | "won" | "lost";
export type Lead = {
  id: string;
  company: string;
  contact: string;
  sector: string;
  city: string;
  score: number;
  status: LeadStatus;
  email: string;
  phone: string;
  value: number;
  notes: string;
  nextAction: string; // ISO date
};

export const CITIES = ["Casablanca", "Rabat", "Tanger", "Marrakech", "Agadir", "Fès", "Meknès", "Oujda"];
export const SECTORS = ["Hôtellerie", "Restauration", "Grande Distribution", "Boulangerie", "Traiteur", "Cantine", "Café", "Épicerie Fine"];

export const LEAD_STATUSES: { key: LeadStatus; label: string; tone: "muted" | "info" | "warning" | "success" | "destructive" }[] = [
  { key: "new", label: "Nouveau", tone: "muted" },
  { key: "qualified", label: "Qualifié", tone: "info" },
  { key: "contacted", label: "Contacté", tone: "info" },
  { key: "negotiation", label: "Négociation", tone: "warning" },
  { key: "won", label: "Gagné", tone: "success" },
  { key: "lost", label: "Perdu", tone: "destructive" },
];

export const initialLeads: Lead[] = [
  { id: "L-001", company: "Hôtel Atlas Marrakech", contact: "Younes El Amrani", sector: "Hôtellerie", city: "Marrakech", score: 92, status: "negotiation", email: "y.amrani@atlas-mrk.ma", phone: "+212 661 23 45 67", value: 240000, notes: "Intéressé par la gamme premium huiles + épices. Décision sous 2 semaines.", nextAction: "2026-06-22" },
  { id: "L-002", company: "Restaurant Dar Zellij", contact: "Sanaa Benkirane", sector: "Restauration", city: "Fès", score: 78, status: "qualified", email: "contact@darzellij.ma", phone: "+212 535 12 34 56", value: 78000, notes: "Recherche fournisseur épices marocaines de qualité.", nextAction: "2026-06-20" },
  { id: "L-003", company: "Marjane Holding", contact: "Karim Tazi", sector: "Grande Distribution", city: "Casablanca", score: 88, status: "contacted", email: "k.tazi@marjane.ma", phone: "+212 522 99 88 77", value: 850000, notes: "Appel d'offres référencement national. Délai 30j.", nextAction: "2026-06-25" },
  { id: "L-004", company: "Boulangerie Paul Rabat", contact: "Fatima Zahra", sector: "Boulangerie", city: "Rabat", score: 65, status: "new", email: "rabat@paul.ma", phone: "+212 537 76 54 32", value: 45000, notes: "Lead entrant via formulaire site web.", nextAction: "2026-06-21" },
  { id: "L-005", company: "Sofitel Tanger", contact: "Mehdi Alaoui", sector: "Hôtellerie", city: "Tanger", score: 95, status: "won", email: "m.alaoui@sofitel-tng.ma", phone: "+212 539 34 12 00", value: 410000, notes: "Contrat signé. Première livraison juillet.", nextAction: "2026-07-01" },
  { id: "L-006", company: "Café Maure", contact: "Rachid Bennani", sector: "Café", city: "Rabat", score: 54, status: "new", email: "rachid@cafemaure.ma", phone: "+212 537 22 33 44", value: 18000, notes: "Petit volume, à qualifier.", nextAction: "2026-06-23" },
  { id: "L-007", company: "Traiteur Royal", contact: "Najat Idrissi", sector: "Traiteur", city: "Casablanca", score: 81, status: "qualified", email: "najat@traiteurroyal.ma", phone: "+212 522 55 66 77", value: 156000, notes: "Événementiel haut de gamme. Besoin produits premium.", nextAction: "2026-06-19" },
  { id: "L-008", company: "Cantine OCP", contact: "Hamza Berrada", sector: "Cantine", city: "Agadir", score: 73, status: "contacted", email: "h.berrada@ocp.ma", phone: "+212 528 11 22 33", value: 320000, notes: "Renouvellement contrat annuel à étudier.", nextAction: "2026-06-24" },
  { id: "L-009", company: "Carrefour Market", contact: "Soufiane Lahlou", sector: "Grande Distribution", city: "Tanger", score: 86, status: "negotiation", email: "s.lahlou@carrefour.ma", phone: "+212 539 88 99 00", value: 680000, notes: "Négociation prix sur 12 références.", nextAction: "2026-06-20" },
  { id: "L-010", company: "Riad Yasmine", contact: "Imane Cherkaoui", sector: "Hôtellerie", city: "Marrakech", score: 69, status: "new", email: "imane@riadyasmine.ma", phone: "+212 524 44 55 66", value: 95000, notes: "Nouveau riad, équipement complet à prévoir.", nextAction: "2026-06-26" },
  { id: "L-011", company: "Pizza Hut Casa", contact: "Anas El Fassi", sector: "Restauration", city: "Casablanca", score: 71, status: "qualified", email: "anas@pizzahut.ma", phone: "+212 522 33 44 55", value: 134000, notes: "Chaîne nationale, 8 points de vente.", nextAction: "2026-06-22" },
  { id: "L-012", company: "Épicerie Bio Souss", contact: "Khadija Naciri", sector: "Épicerie Fine", city: "Agadir", score: 58, status: "new", email: "khadija@biosouss.ma", phone: "+212 528 77 88 99", value: 28000, notes: "Recherche produits bio certifiés.", nextAction: "2026-06-27" },
  { id: "L-013", company: "Hôtel Hyatt Casa", contact: "Tarik Benjelloun", sector: "Hôtellerie", city: "Casablanca", score: 90, status: "negotiation", email: "t.benj@hyatt.ma", phone: "+212 522 11 00 99", value: 520000, notes: "Proposition envoyée. Décision imminente.", nextAction: "2026-06-21" },
  { id: "L-014", company: "Boulangerie La Mie", contact: "Salma Bouzidi", sector: "Boulangerie", city: "Meknès", score: 62, status: "contacted", email: "salma@lamie.ma", phone: "+212 535 65 43 21", value: 52000, notes: "Échantillons farines envoyés.", nextAction: "2026-06-23" },
  { id: "L-015", company: "Aswak Assalam", contact: "Omar Sefrioui", sector: "Grande Distribution", city: "Oujda", score: 76, status: "qualified", email: "o.sefrioui@aswak.ma", phone: "+212 536 12 34 56", value: 390000, notes: "Référencement régional Oriental.", nextAction: "2026-06-25" },
  { id: "L-016", company: "Restaurant Le Cabestan", contact: "Yasmine Berrada", sector: "Restauration", city: "Casablanca", score: 84, status: "negotiation", email: "y.berrada@cabestan.ma", phone: "+212 522 39 11 22", value: 120000, notes: "Resto gastronomique. Sélectif sur la qualité.", nextAction: "2026-06-19" },
  { id: "L-017", company: "Mövenpick Tanger", contact: "Adil Ouazzani", sector: "Hôtellerie", city: "Tanger", score: 87, status: "contacted", email: "a.ouazzani@movenpick.ma", phone: "+212 539 56 78 90", value: 285000, notes: "Renouvellement contrat F&B.", nextAction: "2026-06-24" },
  { id: "L-018", company: "Cafétéria Centrale", contact: "Hind Mansouri", sector: "Café", city: "Fès", score: 49, status: "lost", email: "hind@cafecentrale.ma", phone: "+212 535 99 88 77", value: 42000, notes: "Préférence concurrent. À recontacter dans 6 mois.", nextAction: "2026-12-01" },
  { id: "L-019", company: "Traiteur Andalous", contact: "Brahim Ksikes", sector: "Traiteur", city: "Marrakech", score: 80, status: "qualified", email: "brahim@andalous.ma", phone: "+212 524 67 89 01", value: 175000, notes: "Mariages haut de gamme à Marrakech.", nextAction: "2026-06-26" },
  { id: "L-020", company: "Riad Fès Maya", contact: "Leila Tahri", sector: "Hôtellerie", city: "Fès", score: 74, status: "new", email: "leila@riadmaya.ma", phone: "+212 535 23 45 67", value: 68000, notes: "Nouvelle ouverture, devis initial demandé.", nextAction: "2026-06-22" },
];

export type OrderStatus = "preparation" | "in_progress" | "delivered" | "delayed";
export type OrderItem = { name: string; qty: number; price: number };
export type Order = {
  id: string;
  client: string;
  city: string;
  amount: number;
  items: number;
  status: OrderStatus;
  date: string;
  stage: "commercial" | "adv" | "logistique" | "livraison";
  address: string;
  driver: string;
  details: OrderItem[];
};

export const ORDER_STATUSES: { key: OrderStatus; label: string; tone: "muted" | "info" | "warning" | "success" | "destructive" }[] = [
  { key: "preparation", label: "Préparation", tone: "warning" },
  { key: "in_progress", label: "En cours", tone: "info" },
  { key: "delivered", label: "Livrée", tone: "success" },
  { key: "delayed", label: "En retard", tone: "destructive" },
];

const sampleItems = (): OrderItem[] => [
  { name: "Huile d'olive extra vierge 5L", qty: 12, price: 320 },
  { name: "Épices Ras El Hanout 1kg", qty: 8, price: 180 },
  { name: "Riz Basmati premium 25kg", qty: 4, price: 650 },
];

export const initialOrders: Order[] = [
  { id: "CMD-2401", client: "Hôtel Atlas Marrakech", city: "Marrakech", amount: 84500, items: 24, status: "delivered", date: "2026-06-12", stage: "livraison", address: "Av. Mohammed VI, Marrakech", driver: "Hassan B.", details: sampleItems() },
  { id: "CMD-2402", client: "Marjane Holding", city: "Casablanca", amount: 215000, items: 56, status: "in_progress", date: "2026-06-15", stage: "logistique", address: "Plateforme Marjane Aïn Sebaâ", driver: "Karim M.", details: sampleItems() },
  { id: "CMD-2403", client: "Sofitel Tanger", city: "Tanger", amount: 132000, items: 38, status: "preparation", date: "2026-06-17", stage: "adv", address: "Sofitel Tanger City Center", driver: "—", details: sampleItems() },
  { id: "CMD-2404", client: "Restaurant Dar Zellij", city: "Fès", amount: 23400, items: 12, status: "delayed", date: "2026-06-10", stage: "logistique", address: "Médina, Fès", driver: "Youssef A.", details: sampleItems() },
  { id: "CMD-2405", client: "Traiteur Royal", city: "Casablanca", amount: 56800, items: 19, status: "in_progress", date: "2026-06-16", stage: "logistique", address: "Maârif, Casablanca", driver: "Mohamed R.", details: sampleItems() },
  { id: "CMD-2406", client: "Cantine OCP", city: "Agadir", amount: 98700, items: 41, status: "delivered", date: "2026-06-11", stage: "livraison", address: "Site OCP Agadir", driver: "Said L.", details: sampleItems() },
  { id: "CMD-2407", client: "Hôtel Hyatt Casa", city: "Casablanca", amount: 167000, items: 48, status: "preparation", date: "2026-06-18", stage: "commercial", address: "Place des Nations Unies", driver: "—", details: sampleItems() },
  { id: "CMD-2408", client: "Carrefour Market", city: "Tanger", amount: 189500, items: 62, status: "in_progress", date: "2026-06-17", stage: "adv", address: "Carrefour Ibn Battouta", driver: "Rachid K.", details: sampleItems() },
  { id: "CMD-2409", client: "Mövenpick Tanger", city: "Tanger", amount: 74200, items: 21, status: "delayed", date: "2026-06-09", stage: "livraison", address: "Mövenpick Tanger Bay", driver: "Adil S.", details: sampleItems() },
  { id: "CMD-2410", client: "Riad Yasmine", city: "Marrakech", amount: 31200, items: 14, status: "preparation", date: "2026-06-19", stage: "commercial", address: "Médina de Marrakech", driver: "—", details: sampleItems() },
];

export type Email = {
  id: string;
  from: string;
  email: string;
  subject: string;
  preview: string;
  date: string;
  unread: boolean;
  priority: "high" | "normal" | "low";
};

export const initialEmails: Email[] = [
  { id: "E1", from: "Karim Tazi", email: "k.tazi@marjane.ma", subject: "Demande de devis - 200 cartons huile d'olive", preview: "Bonjour, suite à notre échange, pourriez-vous m'envoyer un devis pour 200 cartons...", date: "Il y a 12 min", unread: true, priority: "high" },
  { id: "E2", from: "Mehdi Alaoui", email: "m.alaoui@sofitel-tng.ma", subject: "Confirmation commande CMD-2403", preview: "Nous confirmons la commande pour livraison la semaine prochaine.", date: "Il y a 1h", unread: true, priority: "high" },
  { id: "E3", from: "Younes El Amrani", email: "y.amrani@atlas-mrk.ma", subject: "Réception commande - tout est conforme", preview: "Bonjour, la livraison est bien arrivée. Merci pour la rapidité.", date: "Il y a 3h", unread: false, priority: "normal" },
  { id: "E4", from: "Sanaa Benkirane", email: "contact@darzellij.ma", subject: "Retard livraison CMD-2404", preview: "La commande n'est toujours pas arrivée, pouvez-vous vérifier ?", date: "Il y a 5h", unread: true, priority: "high" },
  { id: "E5", from: "Najat Idrissi", email: "najat@traiteurroyal.ma", subject: "Nouvelle demande catalogue 2026", preview: "Pourriez-vous m'envoyer le catalogue complet 2026 ?", date: "Hier", unread: false, priority: "normal" },
  { id: "E6", from: "Hamza Berrada", email: "h.berrada@ocp.ma", subject: "Reconduction contrat annuel", preview: "Nous souhaitons reconduire notre contrat pour l'année 2027.", date: "Hier", unread: true, priority: "high" },
  { id: "E7", from: "Soufiane Lahlou", email: "s.lahlou@carrefour.ma", subject: "Question prix - riz basmati", preview: "Quel est votre meilleur prix pour 500 sacs de riz basmati 5kg ?", date: "Hier", unread: false, priority: "normal" },
  { id: "E8", from: "Anas El Fassi", email: "anas@pizzahut.ma", subject: "Facture FAC-2025-1198", preview: "Merci de me transmettre la facture du mois dernier.", date: "2j", unread: false, priority: "low" },
  { id: "E9", from: "Tarik Benjelloun", email: "t.benj@hyatt.ma", subject: "RDV commercial semaine prochaine", preview: "Pouvons-nous fixer un rendez-vous mardi à 14h ?", date: "2j", unread: true, priority: "normal" },
  { id: "E10", from: "Salma Bouzidi", email: "salma@lamie.ma", subject: "Réclamation qualité - lot 8821", preview: "Nous avons constaté un problème sur le lot reçu.", date: "3j", unread: false, priority: "high" },
  { id: "E11", from: "Omar Sefrioui", email: "o.sefrioui@aswak.ma", subject: "Proposition partenariat", preview: "Aswak Assalam souhaite étudier un partenariat exclusif.", date: "3j", unread: false, priority: "normal" },
  { id: "E12", from: "Yasmine Berrada", email: "y.berrada@cabestan.ma", subject: "Demande échantillons", preview: "Pourriez-vous m'envoyer des échantillons des nouveautés ?", date: "4j", unread: false, priority: "low" },
  { id: "E13", from: "Adil Ouazzani", email: "a.ouazzani@movenpick.ma", subject: "Litige livraison CMD-2409", preview: "Le colis est arrivé endommagé, voir photos jointes.", date: "4j", unread: true, priority: "high" },
  { id: "E14", from: "Brahim Ksikes", email: "brahim@andalous.ma", subject: "Confirmation rendez-vous", preview: "Je confirme notre rendez-vous de jeudi 10h.", date: "5j", unread: false, priority: "low" },
  { id: "E15", from: "Leila Tahri", email: "leila@riadmaya.ma", subject: "Première commande - bienvenue", preview: "Bonjour, je souhaite passer ma première commande...", date: "5j", unread: false, priority: "normal" },
];

export type SocialPlatform = "instagram" | "facebook" | "linkedin" | "tiktok" | "x";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type PostTone = "Professionnel" | "Convivial" | "Premium" | "Inspirant" | "Humoristique";

export type SocialPost = {
  id: string;
  platforms: SocialPlatform[];
  title: string;
  content: string;
  hashtags: string[];
  date: string; // ISO
  status: PostStatus;
  images: string[]; // descriptions
  tone: PostTone;
};

export const initialPosts: SocialPost[] = [
  { id: "P1", platforms: ["instagram"], title: "Nouvelle gamme huile d'argan bio", content: "Découvrez notre nouvelle gamme premium 🌿", hashtags: ["#FoodplusMaroc", "#BioMA", "#Argan"], date: "2026-06-19", status: "published", images: ["Bouteille d'huile d'argan sur fond beige"], tone: "Premium" },
  { id: "P2", platforms: ["facebook"], title: "Promo épices du terroir -20%", content: "Offre limitée sur toute la gamme épices.", hashtags: ["#Promo", "#Epices"], date: "2026-06-20", status: "scheduled", images: ["Pile d'épices colorées"], tone: "Convivial" },
  { id: "P3", platforms: ["linkedin"], title: "Foodplus rejoint le groupe LRUCH", content: "Une nouvelle étape stratégique pour le groupe.", hashtags: ["#LRUCH", "#FoodIndustry"], date: "2026-06-18", status: "published", images: ["Logos Foodplus x LRUCH"], tone: "Professionnel" },
  { id: "P4", platforms: ["instagram"], title: "Behind the scenes - entrepôt Casa", content: "Visite de nos installations logistiques.", hashtags: ["#BTS", "#Logistique"], date: "2026-06-21", status: "draft", images: ["Entrepôt moderne", "Équipe logistique"], tone: "Convivial" },
  { id: "P5", platforms: ["facebook", "linkedin"], title: "Nouveau partenariat hôtelier", content: "Foodplus x Sofitel : un partenariat d'excellence.", hashtags: ["#Partenariat"], date: "2026-06-22", status: "scheduled", images: ["Poignée de main devant le Sofitel"], tone: "Premium" },
  { id: "P6", platforms: ["linkedin"], title: "Recrutement : Commerciaux B2B", content: "Rejoignez l'équipe Foodplus dans 4 villes.", hashtags: ["#Recrutement", "#Maroc"], date: "2026-06-17", status: "published", images: ["Annonce visuelle de recrutement"], tone: "Professionnel" },
  { id: "P7", platforms: ["instagram", "tiktok"], title: "Recette du chef - Tajine premium", content: "Notre chef partenaire revisite le tajine.", hashtags: ["#Recette", "#Tajine"], date: "2026-06-23", status: "draft", images: ["Tajine fumant", "Chef en cuisine"], tone: "Inspirant" },
  { id: "P8", platforms: ["facebook"], title: "Salon SIAM 2026 - Stand B14", content: "Retrouvez-nous au SIAM de Meknès.", hashtags: ["#SIAM2026"], date: "2026-06-24", status: "scheduled", images: ["Visuel salon SIAM"], tone: "Professionnel" },
  { id: "P9", platforms: ["linkedin"], title: "Étude de cas - Marjane Holding", content: "Comment nous avons optimisé la supply chain.", hashtags: ["#CaseStudy"], date: "2026-06-16", status: "failed", images: ["Infographie supply chain"], tone: "Professionnel" },
  { id: "P10", platforms: ["instagram"], title: "Concours - Gagnez un panier gourmet", content: "Participez et tentez de gagner.", hashtags: ["#Concours", "#Cadeau"], date: "2026-06-25", status: "draft", images: ["Panier gourmet enrubanné"], tone: "Convivial" },
];

export type PostIdea = {
  id: string;
  title: string;
  hook: string;
  suggestedPlatforms: SocialPlatform[];
  tone: PostTone;
};

export const initialIdeas: PostIdea[] = [
  { id: "I1", title: "Les 5 huiles d'olive marocaines à connaître", hook: "Saviez-vous que le Maroc est le 4e producteur mondial d'huile d'olive ?", suggestedPlatforms: ["instagram", "facebook"], tone: "Inspirant" },
  { id: "I2", title: "Témoignage client - Hôtel Atlas Marrakech", hook: "Comment Foodplus a optimisé le F&B d'un palace.", suggestedPlatforms: ["linkedin"], tone: "Professionnel" },
  { id: "I3", title: "Carrousel : nouveautés gamme épices 2026", hook: "5 épices qui vont transformer vos plats.", suggestedPlatforms: ["instagram"], tone: "Premium" },
  { id: "I4", title: "Reel - dans les coulisses du contrôle qualité", hook: "Chaque produit passe 12 contrôles avant livraison.", suggestedPlatforms: ["instagram", "tiktok"], tone: "Convivial" },
  { id: "I5", title: "Infographie - notre empreinte logistique au Maroc", hook: "8 villes, 12 entrepôts, 200+ livraisons/jour.", suggestedPlatforms: ["linkedin", "facebook"], tone: "Professionnel" },
];

export type MarketingConfig = {
  website: string;
  logo: string;
  description: string;
  tone: PostTone;
  frequency: "daily" | "3xweek" | "weekly" | "monthly";
};

export const initialMarketingConfig: MarketingConfig = {
  website: "https://foodplus.ma",
  logo: "",
  description: "Foodplus, filiale du groupe LRUCH, est le distributeur agroalimentaire B2B de référence au Maroc. Nous accompagnons hôtels, restaurants, traiteurs et grande distribution avec une gamme premium de produits locaux et importés.",
  tone: "Premium",
  frequency: "3xweek",
};
