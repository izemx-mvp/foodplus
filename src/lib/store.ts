import { useSyncExternalStore } from "react";
import {
  initialLeads, initialOrders, initialEmails, initialPosts, initialIdeas, initialMarketingConfig,
  type Lead, type Order, type Email, type SocialPost, type PostIdea, type MarketingConfig,
} from "./mock-data";

type State = {
  leads: Lead[];
  orders: Order[];
  emails: Email[];
  posts: SocialPost[];
  ideas: PostIdea[];
  marketing: MarketingConfig;
};

const state: State = {
  leads: initialLeads,
  orders: initialOrders,
  emails: initialEmails,
  posts: initialPosts,
  ideas: initialIdeas,
  marketing: initialMarketingConfig,
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
  removePost: (id: string) => { state.posts = state.posts.filter((p) => p.id !== id); emit(); },
  addIdeas: (ideas: PostIdea[]) => { state.ideas = [...ideas, ...state.ideas]; emit(); },
  removeIdea: (id: string) => { state.ideas = state.ideas.filter((i) => i.id !== id); emit(); },
  updateMarketingConfig: (patch: Partial<MarketingConfig>) => {
    state.marketing = { ...state.marketing, ...patch };
    emit();
  },
};
