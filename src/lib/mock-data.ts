export type LeadStatus = "new" | "hot" | "qualified" | "contacted" | "lost";
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
};

export const CITIES = ["Casablanca", "Rabat", "Tanger", "Marrakech", "Agadir", "Fès", "Meknès", "Oujda"];
export const SECTORS = ["Hôtellerie", "Restauration", "Grande Distribution", "Boulangerie", "Traiteur", "Cantine", "Café", "Épicerie Fine"];

export const initialLeads: Lead[] = [
  { id: "L-001", company: "Hôtel Atlas Marrakech", contact: "Younes El Amrani", sector: "Hôtellerie", city: "Marrakech", score: 92, status: "hot", email: "y.amrani@atlas-mrk.ma", phone: "+212 661 23 45 67" },
  { id: "L-002", company: "Restaurant Dar Zellij", contact: "Sanaa Benkirane", sector: "Restauration", city: "Fès", score: 78, status: "qualified", email: "contact@darzellij.ma", phone: "+212 535 12 34 56" },
  { id: "L-003", company: "Marjane Holding", contact: "Karim Tazi", sector: "Grande Distribution", city: "Casablanca", score: 88, status: "contacted", email: "k.tazi@marjane.ma", phone: "+212 522 99 88 77" },
  { id: "L-004", company: "Boulangerie Paul Rabat", contact: "Fatima Zahra", sector: "Boulangerie", city: "Rabat", score: 65, status: "new", email: "rabat@paul.ma", phone: "+212 537 76 54 32" },
  { id: "L-005", company: "Sofitel Tanger", contact: "Mehdi Alaoui", sector: "Hôtellerie", city: "Tanger", score: 95, status: "hot", email: "m.alaoui@sofitel-tng.ma", phone: "+212 539 34 12 00" },
  { id: "L-006", company: "Café Maure", contact: "Rachid Bennani", sector: "Café", city: "Rabat", score: 54, status: "new", email: "rachid@cafemaure.ma", phone: "+212 537 22 33 44" },
  { id: "L-007", company: "Traiteur Royal", contact: "Najat Idrissi", sector: "Traiteur", city: "Casablanca", score: 81, status: "qualified", email: "najat@traiteurroyal.ma", phone: "+212 522 55 66 77" },
  { id: "L-008", company: "Cantine OCP", contact: "Hamza Berrada", sector: "Cantine", city: "Agadir", score: 73, status: "contacted", email: "h.berrada@ocp.ma", phone: "+212 528 11 22 33" },
  { id: "L-009", company: "Carrefour Market", contact: "Soufiane Lahlou", sector: "Grande Distribution", city: "Tanger", score: 86, status: "hot", email: "s.lahlou@carrefour.ma", phone: "+212 539 88 99 00" },
  { id: "L-010", company: "Riad Yasmine", contact: "Imane Cherkaoui", sector: "Hôtellerie", city: "Marrakech", score: 69, status: "new", email: "imane@riadyasmine.ma", phone: "+212 524 44 55 66" },
  { id: "L-011", company: "Pizza Hut Casa", contact: "Anas El Fassi", sector: "Restauration", city: "Casablanca", score: 71, status: "qualified", email: "anas@pizzahut.ma", phone: "+212 522 33 44 55" },
  { id: "L-012", company: "Épicerie Bio Souss", contact: "Khadija Naciri", sector: "Épicerie Fine", city: "Agadir", score: 58, status: "new", email: "khadija@biosouss.ma", phone: "+212 528 77 88 99" },
  { id: "L-013", company: "Hôtel Hyatt Casa", contact: "Tarik Benjelloun", sector: "Hôtellerie", city: "Casablanca", score: 90, status: "hot", email: "t.benj@hyatt.ma", phone: "+212 522 11 00 99" },
  { id: "L-014", company: "Boulangerie La Mie", contact: "Salma Bouzidi", sector: "Boulangerie", city: "Meknès", score: 62, status: "contacted", email: "salma@lamie.ma", phone: "+212 535 65 43 21" },
  { id: "L-015", company: "Aswak Assalam", contact: "Omar Sefrioui", sector: "Grande Distribution", city: "Oujda", score: 76, status: "qualified", email: "o.sefrioui@aswak.ma", phone: "+212 536 12 34 56" },
  { id: "L-016", company: "Restaurant Le Cabestan", contact: "Yasmine Berrada", sector: "Restauration", city: "Casablanca", score: 84, status: "hot", email: "y.berrada@cabestan.ma", phone: "+212 522 39 11 22" },
  { id: "L-017", company: "Mövenpick Tanger", contact: "Adil Ouazzani", sector: "Hôtellerie", city: "Tanger", score: 87, status: "contacted", email: "a.ouazzani@movenpick.ma", phone: "+212 539 56 78 90" },
  { id: "L-018", company: "Cafétéria Centrale", contact: "Hind Mansouri", sector: "Café", city: "Fès", score: 49, status: "lost", email: "hind@cafecentrale.ma", phone: "+212 535 99 88 77" },
  { id: "L-019", company: "Traiteur Andalous", contact: "Brahim Ksikes", sector: "Traiteur", city: "Marrakech", score: 80, status: "qualified", email: "brahim@andalous.ma", phone: "+212 524 67 89 01" },
  { id: "L-020", company: "Riad Fès Maya", contact: "Leila Tahri", sector: "Hôtellerie", city: "Fès", score: 74, status: "new", email: "leila@riadmaya.ma", phone: "+212 535 23 45 67" },
];

export type OrderStatus = "preparation" | "in_progress" | "delivered" | "delayed";
export type Order = {
  id: string;
  client: string;
  city: string;
  amount: number;
  items: number;
  status: OrderStatus;
  date: string;
  stage: "commercial" | "adv" | "logistique" | "livraison";
};

export const initialOrders: Order[] = [
  { id: "CMD-2401", client: "Hôtel Atlas Marrakech", city: "Marrakech", amount: 84500, items: 24, status: "delivered", date: "2026-06-12", stage: "livraison" },
  { id: "CMD-2402", client: "Marjane Holding", city: "Casablanca", amount: 215000, items: 56, status: "in_progress", date: "2026-06-15", stage: "logistique" },
  { id: "CMD-2403", client: "Sofitel Tanger", city: "Tanger", amount: 132000, items: 38, status: "preparation", date: "2026-06-17", stage: "adv" },
  { id: "CMD-2404", client: "Restaurant Dar Zellij", city: "Fès", amount: 23400, items: 12, status: "delayed", date: "2026-06-10", stage: "logistique" },
  { id: "CMD-2405", client: "Traiteur Royal", city: "Casablanca", amount: 56800, items: 19, status: "in_progress", date: "2026-06-16", stage: "logistique" },
  { id: "CMD-2406", client: "Cantine OCP", city: "Agadir", amount: 98700, items: 41, status: "delivered", date: "2026-06-11", stage: "livraison" },
  { id: "CMD-2407", client: "Hôtel Hyatt Casa", city: "Casablanca", amount: 167000, items: 48, status: "preparation", date: "2026-06-18", stage: "commercial" },
  { id: "CMD-2408", client: "Carrefour Market", city: "Tanger", amount: 189500, items: 62, status: "in_progress", date: "2026-06-17", stage: "adv" },
  { id: "CMD-2409", client: "Mövenpick Tanger", city: "Tanger", amount: 74200, items: 21, status: "delayed", date: "2026-06-09", stage: "livraison" },
  { id: "CMD-2410", client: "Riad Yasmine", city: "Marrakech", amount: 31200, items: 14, status: "preparation", date: "2026-06-19", stage: "commercial" },
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

export type SocialPlatform = "instagram" | "facebook" | "linkedin";
export type PostStatus = "draft" | "scheduled" | "published" | "failed";
export type SocialPost = {
  id: string;
  platform: SocialPlatform;
  title: string;
  content: string;
  hashtags: string[];
  date: string;
  status: PostStatus;
};

export const initialPosts: SocialPost[] = [
  { id: "P1", platform: "instagram", title: "Nouvelle gamme huile d'argan bio", content: "Découvrez notre nouvelle gamme premium 🌿", hashtags: ["#FoodplusMaroc", "#BioMA", "#Argan"], date: "2026-06-19", status: "published" },
  { id: "P2", platform: "facebook", title: "Promo épices du terroir -20%", content: "Offre limitée sur toute la gamme épices.", hashtags: ["#Promo", "#Epices"], date: "2026-06-20", status: "scheduled" },
  { id: "P3", platform: "linkedin", title: "Foodplus rejoint le groupe LRUCH", content: "Une nouvelle étape stratégique pour le groupe.", hashtags: ["#LRUCH", "#FoodIndustry"], date: "2026-06-18", status: "published" },
  { id: "P4", platform: "instagram", title: "Behind the scenes - entrepôt Casa", content: "Visite de nos installations logistiques.", hashtags: ["#BTS", "#Logistique"], date: "2026-06-21", status: "draft" },
  { id: "P5", platform: "facebook", title: "Nouveau partenariat hôtelier", content: "Foodplus x Sofitel : un partenariat d'excellence.", hashtags: ["#Partenariat"], date: "2026-06-22", status: "scheduled" },
  { id: "P6", platform: "linkedin", title: "Recrutement : Commerciaux B2B", content: "Rejoignez l'équipe Foodplus dans 4 villes.", hashtags: ["#Recrutement", "#Maroc"], date: "2026-06-17", status: "published" },
  { id: "P7", platform: "instagram", title: "Recette du chef - Tajine premium", content: "Notre chef partenaire revisite le tajine.", hashtags: ["#Recette", "#Tajine"], date: "2026-06-23", status: "draft" },
  { id: "P8", platform: "facebook", title: "Salon SIAM 2026 - Stand B14", content: "Retrouvez-nous au SIAM de Meknès.", hashtags: ["#SIAM2026"], date: "2026-06-24", status: "scheduled" },
  { id: "P9", platform: "linkedin", title: "Étude de cas - Marjane Holding", content: "Comment nous avons optimisé la supply chain.", hashtags: ["#CaseStudy"], date: "2026-06-16", status: "failed" },
  { id: "P10", platform: "instagram", title: "Concours - Gagnez un panier gourmet", content: "Participez et tentez de gagner.", hashtags: ["#Concours", "#Cadeau"], date: "2026-06-25", status: "draft" },
];

export type CRMStage = "lead" | "contacted" | "proposal" | "negotiation" | "won" | "lost";
export type Deal = {
  id: string;
  company: string;
  value: number;
  contact: string;
  stage: CRMStage;
  probability: number;
};

export const initialDeals: Deal[] = [
  { id: "D1", company: "Hôtel Atlas Marrakech", value: 240000, contact: "Younes El Amrani", stage: "negotiation", probability: 75 },
  { id: "D2", company: "Marjane Holding", value: 850000, contact: "Karim Tazi", stage: "proposal", probability: 60 },
  { id: "D3", company: "Sofitel Tanger", value: 410000, contact: "Mehdi Alaoui", stage: "won", probability: 100 },
  { id: "D4", company: "Restaurant Dar Zellij", value: 78000, contact: "Sanaa Benkirane", stage: "contacted", probability: 30 },
  { id: "D5", company: "Traiteur Royal", value: 156000, contact: "Najat Idrissi", stage: "proposal", probability: 55 },
  { id: "D6", company: "Cantine OCP", value: 320000, contact: "Hamza Berrada", stage: "won", probability: 100 },
  { id: "D7", company: "Hôtel Hyatt Casa", value: 520000, contact: "Tarik Benjelloun", stage: "negotiation", probability: 80 },
  { id: "D8", company: "Carrefour Market", value: 680000, contact: "Soufiane Lahlou", stage: "proposal", probability: 50 },
  { id: "D9", company: "Cafétéria Centrale", value: 42000, contact: "Hind Mansouri", stage: "lost", probability: 0 },
  { id: "D10", company: "Riad Yasmine", value: 95000, contact: "Imane Cherkaoui", stage: "lead", probability: 15 },
  { id: "D11", company: "Mövenpick Tanger", value: 285000, contact: "Adil Ouazzani", stage: "contacted", probability: 35 },
  { id: "D12", company: "Pizza Hut Casa", value: 134000, contact: "Anas El Fassi", stage: "lead", probability: 20 },
];

export type IntegrationKey = "gmail" | "sheets" | "calendar" | "whatsapp" | "facebook" | "instagram" | "linkedin" | "crm";
