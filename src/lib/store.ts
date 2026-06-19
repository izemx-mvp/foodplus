import { useSyncExternalStore } from "react";
import {
  initialLeads, initialOrders, initialEmails, initialPosts, initialDeals,
  type Lead, type Order, type Email, type SocialPost, type Deal, type IntegrationKey,
} from "./mock-data";

type State = {
  leads: Lead[];
  orders: Order[];
  emails: Email[];
  posts: SocialPost[];
  deals: Deal[];
  integrations: Record<IntegrationKey, boolean>;
};

const state: State = {
  leads: initialLeads,
  orders: initialOrders,
  emails: initialEmails,
  posts: initialPosts,
  deals: initialDeals,
  integrations: {
    gmail: true,
    sheets: true,
    calendar: false,
    whatsapp: true,
    facebook: false,
    instagram: true,
    linkedin: false,
    crm: true,
  },
};

const listeners = new Set<() => void>();
const subscribe = (cb: () => void) => { listeners.add(cb); return () => listeners.delete(cb); };
const emit = () => listeners.forEach((l) => l());

export const useStore = <T,>(selector: (s: State) => T): T =>
  useSyncExternalStore(subscribe, () => selector(state), () => selector(state));

export const actions = {
  updateLead: (id: string, patch: Partial<Lead>) => {
    state.leads = state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
    emit();
  },
  addLead: (lead: Lead) => { state.leads = [lead, ...state.leads]; emit(); },
  moveDeal: (id: string, stage: Deal["stage"]) => {
    state.deals = state.deals.map((d) => (d.id === id ? { ...d, stage } : d));
    emit();
  },
  updateOrder: (id: string, patch: Partial<Order>) => {
    state.orders = state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o));
    emit();
  },
  markEmailRead: (id: string) => {
    state.emails = state.emails.map((e) => (e.id === id ? { ...e, unread: false } : e));
    emit();
  },
  addPost: (p: SocialPost) => { state.posts = [p, ...state.posts]; emit(); },
  updatePost: (id: string, patch: Partial<SocialPost>) => {
    state.posts = state.posts.map((p) => (p.id === id ? { ...p, ...patch } : p));
    emit();
  },
  toggleIntegration: (key: IntegrationKey) => {
    state.integrations[key] = !state.integrations[key];
    emit();
  },
};
