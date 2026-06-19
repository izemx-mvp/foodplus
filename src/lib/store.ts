import { useSyncExternalStore } from "react";
import {
  initialLeads, initialOrders, initialEmails, initialPosts, initialIdeas, initialMarketingConfig,
  WORKFLOW_STEPS,
  type Lead, type Order, type OrderItem, type Email, type SocialPost, type PostIdea, type MarketingConfig,
  type Communication, type WorkflowStepKey,
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

const STEP_KEYS: WorkflowStepKey[] = WORKFLOW_STEPS.map((s) => s.key);

export const actions = {
  updateLead: (id: string, patch: Partial<Lead>) => {
    state.leads = state.leads.map((l) => (l.id === id ? { ...l, ...patch } : l));
    emit();
  },
  addLead: (lead: Lead) => { state.leads = [lead, ...state.leads]; emit(); },
  addOrder: (order: Order) => { state.orders = [order, ...state.orders]; emit(); },
  updateOrder: (id: string, patch: Partial<Order>) => {
    state.orders = state.orders.map((o) => (o.id === id ? { ...o, ...patch } : o));
    emit();
  },
  toggleOrderTask: (id: string, step: string, taskIndex: number) => {
    state.orders = state.orders.map((o) => {
      if (o.id !== id) return o;
      const wf = { ...o.workflow };
      const key = step as keyof typeof wf;
      const s = wf[key];
      if (!s) return o;
      wf[key] = { ...s, tasks: s.tasks.map((t, i) => (i === taskIndex ? { ...t, done: !t.done } : t)) };
      return { ...o, workflow: wf };
    });
    emit();
  },
  setOrderStep: (id: string, step: WorkflowStepKey) => {
    state.orders = state.orders.map((o) => (o.id === id ? { ...o, currentStep: step } : o));
    emit();
  },
  advanceOrderStep: (id: string) => {
    state.orders = state.orders.map((o) => {
      if (o.id !== id) return o;
      const idx = STEP_KEYS.indexOf(o.currentStep);
      if (idx < 0 || idx >= STEP_KEYS.length - 1) return o;
      const cur = o.workflow[o.currentStep];
      const next = STEP_KEYS[idx + 1];
      const wf = {
        ...o.workflow,
        [o.currentStep]: { ...cur, tasks: cur.tasks.map((t) => ({ ...t, done: true })) },
      };
      return { ...o, workflow: wf, currentStep: next };
    });
    emit();
  },
  addOrderProduct: (id: string, item: OrderItem) => {
    state.orders = state.orders.map((o) => o.id === id ? { ...o, details: [...o.details, item], items: o.items + item.qty } : o);
    emit();
  },
  updateOrderProduct: (id: string, idx: number, patch: Partial<OrderItem>) => {
    state.orders = state.orders.map((o) => o.id === id ? { ...o, details: o.details.map((d, i) => i === idx ? { ...d, ...patch } : d) } : o);
    emit();
  },
  removeOrderProduct: (id: string, idx: number) => {
    state.orders = state.orders.map((o) => o.id === id ? { ...o, details: o.details.filter((_, i) => i !== idx) } : o);
    emit();
  },
  addCommunication: (id: string, comm: Communication) => {
    state.orders = state.orders.map((o) => o.id === id ? { ...o, communications: [comm, ...o.communications] } : o);
    emit();
  },
  reassignOrder: (id: string, role: "commercial" | "adv" | "logistique" | "facturation", person: string) => {
    state.orders = state.orders.map((o) => {
      if (o.id !== id) return o;
      const prev = role === "commercial" ? o.commercial : role === "adv" ? o.adv : role === "logistique" ? o.driver : (o as Order & { facturation?: string }).facturation ?? "—";
      const patch: Partial<Order> = role === "commercial" ? { commercial: person }
        : role === "adv" ? { adv: person }
        : role === "logistique" ? { driver: person }
        : {};
      const log: Communication = {
        id: `log-${Date.now()}`, kind: "assignment", author: "Système",
        date: new Date().toISOString().slice(0, 10),
        content: `Réassignation ${role} : ${prev} → ${person}`,
      };
      return { ...o, ...patch, communications: [log, ...o.communications] };
    });
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
