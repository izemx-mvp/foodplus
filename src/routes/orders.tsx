import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import {
  ORDER_STATUSES, WORKFLOW_STEPS, WAREHOUSES, buildWorkflow, TEAM, ROLE_LABEL,
  type Order, type OrderStatus, type OrderPriority, type Warehouse, type WorkflowStepKey, type TeamRole,
} from "@/lib/mock-data";
import {
  Package, Truck, CheckCircle2, AlertTriangle, Plus, Download, RefreshCw, Search, Eye,
  ArrowRight, MessageSquare, FileText, Send, Sparkles, Mail, Phone, User, Building2,
  CreditCard, Bot, LayoutGrid, Trash2, GripVertical, X, Clock, UserCheck, Users, Bell, Table as TableIcon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Commandes – Centre Opérationnel" }] }),
  component: OrdersPage,
});

const statusMeta = (s: OrderStatus) => ORDER_STATUSES.find((x) => x.key === s)!;
const stepMeta = (k: WorkflowStepKey) => WORKFLOW_STEPS.find((s) => s.key === k)!;
const fmtMoney = (n: number) => `${n.toLocaleString("fr-FR")} MAD`;
const fmtK = (n: number) => `${(n / 1000).toFixed(0)}K`;
const today = "2026-06-19";

const PRIORITY_TONE: Record<OrderPriority, "destructive" | "warning" | "muted"> = { high: "destructive", normal: "warning", low: "muted" };
const PRIORITY_LABEL: Record<OrderPriority, string> = { high: "Haute", normal: "Normale", low: "Basse" };

function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [commercial, setCommercial] = useState("all");
  const [adv, setAdv] = useState("all");
  const [warehouse, setWarehouse] = useState("all");
  const [city, setCity] = useState("all");
  const [priority, setPriority] = useState("all");
  const [date, setDate] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [view360, setView360] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => orders.filter((o) => {
    if (q && ![o.id, o.client, o.clientInfo.phone, o.commercial].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    if (status !== "all" && o.status !== status) return false;
    if (commercial !== "all" && o.commercial !== commercial) return false;
    if (adv !== "all" && o.adv !== adv) return false;
    if (warehouse !== "all" && o.warehouse !== warehouse) return false;
    if (city !== "all" && o.city !== city) return false;
    if (priority !== "all" && o.priority !== priority) return false;
    if (date && o.date !== date) return false;
    return true;
  }), [orders, q, status, commercial, adv, warehouse, city, priority, date]);

  // KPIs
  const monthOrders = orders.filter((o) => o.date.startsWith("2026-06"));
  const kpis = {
    countMonth: monthOrders.length,
    caMonth: monthOrders.reduce((s, o) => s + o.amount, 0),
    advBlocked: orders.filter((o) => o.stage === "adv").length,
    preparing: orders.filter((o) => o.currentStep === "preparation_logistique" || o.currentStep === "expedition").length,
    deliveriesToday: orders.filter((o) => o.dueDate === today).length,
    unpaid: orders.filter((o) => o.invoiceStatus === "pending" || o.invoiceStatus === "late").reduce((s, o) => s + (o.amount - o.paid), 0),
  };

  const commercials = Array.from(new Set(orders.map((o) => o.commercial)));
  const advs = Array.from(new Set(orders.map((o) => o.adv)));
  const cities = Array.from(new Set(orders.map((o) => o.city)));

  const exportCSV = () => {
    const rows = [
      ["N°", "Client", "Ville", "Montant", "Statut", "Étape", "Commercial", "ADV", "Dépôt", "Date", "Échéance"],
      ...filtered.map((o) => [o.id, o.client, o.city, o.amount, o.status, o.currentStep, o.commercial, o.adv, o.warehouse, o.date, o.dueDate]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `commandes-${today}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Export CSV téléchargé");
  };

  const reset = () => { setQ(""); setStatus("all"); setCommercial("all"); setAdv("all"); setWarehouse("all"); setCity("all"); setPriority("all"); setDate(""); toast.success("Filtres réinitialisés"); };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Commandes — Centre Opérationnel</h1>
          <p className="text-sm text-muted-foreground">{orders.length} commandes · pipeline temps réel</p>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Kpi tone="info" icon={Package} label="Commandes du mois" value={String(kpis.countMonth)} />
        <Kpi tone="success" icon={CreditCard} label="CA du mois" value={fmtMoney(kpis.caMonth)} />
        <Kpi tone={kpis.advBlocked > 2 ? "destructive" : "warning"} icon={AlertTriangle} label="En validation ADV" value={String(kpis.advBlocked)} />
        <Kpi tone="warning" icon={Package} label="En préparation" value={String(kpis.preparing)} />
        <Kpi tone="info" icon={Truck} label="Livraisons aujourd'hui" value={String(kpis.deliveriesToday)} />
        <Kpi tone={kpis.unpaid > 200000 ? "destructive" : "warning"} icon={FileText} label="Factures impayées" value={fmtMoney(kpis.unpaid)} />
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-3 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="N°, client, téléphone, commercial…" value={q} onChange={(e) => setQ(e.target.value)} className="pl-8" />
            </div>
            <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4 mr-1" />Nouvelle commande</Button>
            <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-1" />Export Excel</Button>
            <Button variant="outline" onClick={reset}><RefreshCw className="h-4 w-4 mr-1" />Actualiser</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Filter label="Statut" value={status} onChange={setStatus} options={[["all", "Tous statuts"], ...ORDER_STATUSES.map((s) => [s.key, s.label] as [string, string])]} />
            <Filter label="Commercial" value={commercial} onChange={setCommercial} options={[["all", "Tous"], ...commercials.map((c) => [c, c] as [string, string])]} />
            <Filter label="ADV" value={adv} onChange={setAdv} options={[["all", "Tous"], ...advs.map((c) => [c, c] as [string, string])]} />
            <Filter label="Dépôt" value={warehouse} onChange={setWarehouse} options={[["all", "Tous"], ...WAREHOUSES.map((c) => [c, c] as [string, string])]} />
            <Filter label="Ville" value={city} onChange={setCity} options={[["all", "Toutes"], ...cities.map((c) => [c, c] as [string, string])]} />
            <Filter label="Priorité" value={priority} onChange={setPriority} options={[["all", "Toutes"], ["high", "Haute"], ["normal", "Normale"], ["low", "Basse"]]} />
            <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-40" />
          </div>
        </CardContent>
      </Card>

      {/* Pipeline kanban */}
      <Pipeline orders={filtered} onSelect={setSelected} on360={setView360} />

      <OrderSheet id={selected} onClose={() => setSelected(null)} on360={() => { if (selected) setView360(selected); }} />
      <View360Dialog id={view360} onClose={() => setView360(null)} />
      <CreateOrderDialog open={creating} onClose={() => setCreating(false)} />
    </div>
  );
}


function Kpi({ icon: Icon, label, value, tone }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; tone: "success" | "warning" | "destructive" | "info" }) {
  const toneCls = {
    success: "text-success bg-success/10",
    warning: "text-warning-foreground bg-warning/15",
    destructive: "text-destructive bg-destructive/10",
    info: "text-info bg-info/10",
  }[tone];
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-2">
          <div className={"h-7 w-7 grid place-items-center rounded-md " + toneCls}><Icon className="h-4 w-4" /></div>
          <span className="text-xs text-muted-foreground">{label}</span>
        </div>
        <p className="mt-2 text-xl font-semibold truncate">{value}</p>
      </CardContent>
    </Card>
  );
}

function Filter({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: [string, string][] }) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[150px]"><SelectValue placeholder={label} /></SelectTrigger>
      <SelectContent>
        {options.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
      </SelectContent>
    </Select>
  );
}

function Pipeline({ orders, onSelect, on360 }: { orders: Order[]; onSelect: (id: string) => void; on360: (id: string) => void }) {
  const [dragging, setDragging] = useState<string | null>(null);
  const drop = (step: WorkflowStepKey) => {
    if (!dragging) return;
    actions.setOrderStep(dragging, step);
    toast.success(`Déplacée → ${stepMeta(step).label}`);
    setDragging(null);
  };
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {WORKFLOW_STEPS.map((s) => {
          const cards = orders.filter((o) => o.currentStep === s.key);
          const total = cards.reduce((sum, o) => sum + o.amount, 0);
          const avg = cards.length ? Math.round(cards.reduce((sum, o) => sum + (o.workflow[s.key].durationDays ?? 1), 0) / cards.length * 10) / 10 : 0;
          return (
            <div key={s.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => drop(s.key)}
              className="w-72 shrink-0 rounded-lg border bg-muted/30 p-2">
              <div className="px-1 pb-2">
                <p className="text-xs font-semibold uppercase tracking-wide">{s.label}</p>
                <div className="mt-1 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{cards.length} cmd · {fmtK(total)} MAD</span>
                  <span>~{avg}j</span>
                </div>
              </div>
              <div className="space-y-2 min-h-[100px]">
                {cards.map((o) => (
                  <OrderCard key={o.id} order={o} onDragStart={() => setDragging(o.id)} onDragEnd={() => setDragging(null)} onSelect={() => onSelect(o.id)} on360={() => on360(o.id)} />
                ))}
                {cards.length === 0 && <p className="text-center text-[11px] text-muted-foreground py-4">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function OrderCard({ order, onDragStart, onDragEnd, onSelect, on360 }: { order: Order; onDragStart: () => void; onDragEnd: () => void; onSelect: () => void; on360: () => void }) {
  const m = statusMeta(order.status);
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      className="group cursor-grab rounded-md border bg-card p-3 text-sm shadow-sm hover:shadow-md active:cursor-grabbing">
      <div className="flex items-start gap-2">
        <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between gap-1">
            <span className="font-mono text-[10px] text-muted-foreground">{order.id}</span>
            <Badge variant="outline" className={
              "text-[9px] px-1.5 py-0 border " +
              (order.priority === "high" ? "border-destructive/40 text-destructive bg-destructive/5"
                : order.priority === "normal" ? "border-warning/40 text-warning-foreground bg-warning/10"
                : "border-border text-muted-foreground")
            }>● {PRIORITY_LABEL[order.priority]}</Badge>
          </div>
          <p className="font-medium leading-tight truncate">{order.client}</p>
          <p className="text-base font-semibold">{fmtMoney(order.amount)}</p>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] text-muted-foreground">
            <span className="truncate">👤 {order.commercial}</span>
            <span className="truncate">📋 {order.adv}</span>
            <span className="truncate">🏬 {order.warehouse}</span>
            <span className="truncate">📦 {order.details.length} prod.</span>
            <span className="truncate">📅 {order.date}</span>
            <span className="truncate">🚚 {order.dueDate}</span>
          </div>
          <div className="flex items-center justify-between">
            <StatusBadge tone={m.tone}>{m.label}</StatusBadge>
            <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition">
              <Button size="icon" variant="ghost" className="h-6 w-6" title="Voir" onClick={onSelect}><Eye className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" title="360°" onClick={on360}><LayoutGrid className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" title="Étape suivante" onClick={(e) => { e.stopPropagation(); actions.advanceOrderStep(order.id); toast.success(`${order.id} → étape suivante`); }}><ArrowRight className="h-3 w-3" /></Button>
              <Button size="icon" variant="ghost" className="h-6 w-6" title="Commentaire" onClick={(e) => { e.stopPropagation(); onSelect(); }}><MessageSquare className="h-3 w-3" /></Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------ Sheet 6 onglets ------------ */
function OrderSheet({ id, onClose, on360 }: { id: string | null; onClose: () => void; on360: () => void }) {
  const order = useStore((s) => s.orders.find((o) => o.id === id) ?? null);
  if (!order) return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl" />
    </Sheet>
  );
  const restant = order.amount - order.paid;
  const m = statusMeta(order.status);

  return (
    <Sheet open={!!id} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-2xl flex flex-col p-0">
        <SheetHeader className="px-5 py-4 border-b">
          <div className="flex items-start justify-between gap-2">
            <div>
              <SheetTitle className="flex items-center gap-2">{order.id} · {order.client}</SheetTitle>
              <SheetDescription>{order.date} · {fmtMoney(order.amount)} · <StatusBadge tone={m.tone}>{m.label}</StatusBadge></SheetDescription>
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" onClick={on360}><LayoutGrid className="h-4 w-4 mr-1" />360°</Button>
              <Button size="sm" onClick={() => { actions.advanceOrderStep(order.id); toast.success("Étape suivante"); }}><ArrowRight className="h-4 w-4 mr-1" />Étape suivante</Button>
            </div>
          </div>
        </SheetHeader>

        <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="mx-5 mt-3 justify-start gap-1 bg-muted/40 flex-wrap h-auto">
            <TabsTrigger value="info">Infos</TabsTrigger>
            <TabsTrigger value="products">Produits</TabsTrigger>
            <TabsTrigger value="workflow">Workflow</TabsTrigger>
            <TabsTrigger value="docs">Documents</TabsTrigger>
            <TabsTrigger value="comm">Communication</TabsTrigger>
            <TabsTrigger value="ai">IA</TabsTrigger>
          </TabsList>

          <div className="flex-1 overflow-y-auto px-5 py-4">
            <TabsContent value="info" className="m-0 space-y-4">
              <InfoSection title="Client" icon={Building2}>
                <Row label="Société" value={order.client} />
                <Row label="ICE" value={order.clientInfo.ice} />
                <Row label="Adresse" value={order.clientInfo.address} />
                <Row label="Ville" value={order.city} />
                <Row label="Téléphone" value={order.clientInfo.phone} />
                <Row label="Email" value={order.clientInfo.email} />
              </InfoSection>
              <InfoSection title="Responsables" icon={User}>
                <Row label="Commercial" value={order.commercial} />
                <Row label="ADV" value={order.adv} />
                <Row label="Logistique" value={order.driver} />
              </InfoSection>
              <InfoSection title="Résumé financier" icon={CreditCard}>
                <Row label="Sous-total" value={fmtMoney(order.subtotal)} />
                <Row label="TVA (20%)" value={fmtMoney(order.tax)} />
                <Row label="Total" value={fmtMoney(order.amount)} bold />
                <Row label="Payé" value={fmtMoney(order.paid)} />
                <Row label="Reste à payer" value={fmtMoney(restant)} bold tone={restant > 0 ? "destructive" : "success"} />
              </InfoSection>
            </TabsContent>

            <TabsContent value="products" className="m-0">
              <ProductsTab order={order} />
            </TabsContent>

            <TabsContent value="workflow" className="m-0">
              <WorkflowTimeline order={order} />
            </TabsContent>

            <TabsContent value="docs" className="m-0 space-y-2">
              {DOCS.map((d) => (
                <Card key={d.key}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <div className="h-9 w-9 grid place-items-center rounded-md bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{d.label}</p>
                      <p className="text-[11px] text-muted-foreground">Généré le {order.date} · PDF</p>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toast.info(`${d.label} ouvert`)}><Eye className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => toast.success(`${d.label} téléchargé`)}><Download className="h-4 w-4" /></Button>
                    {d.canSend && <Button size="sm" variant="outline" onClick={() => toast.success(`${d.label} envoyé`)}><Send className="h-4 w-4 mr-1" />Envoyer</Button>}
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="comm" className="m-0">
              <CommTab order={order} />
            </TabsContent>

            <TabsContent value="ai" className="m-0">
              <AITab order={order} />
            </TabsContent>
          </div>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}

const DOCS = [
  { key: "devis", label: "Devis", canSend: true },
  { key: "bc", label: "Bon de commande", canSend: false },
  { key: "bp", label: "Bon de préparation", canSend: false },
  { key: "bl", label: "Bon de livraison", canSend: false },
  { key: "facture", label: "Facture", canSend: true },
];

function InfoSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode }) {
  return (
    <div className="rounded-md border">
      <div className="px-3 py-2 border-b flex items-center gap-2 text-xs font-semibold uppercase text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />{title}
      </div>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function Row({ label, value, bold, tone }: { label: string; value: string; bold?: boolean; tone?: "destructive" | "success" }) {
  return (
    <div className="px-3 py-2 flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className={
        (bold ? "font-semibold " : "") +
        (tone === "destructive" ? "text-destructive" : tone === "success" ? "text-success" : "")
      }>{value}</span>
    </div>
  );
}

function ProductsTab({ order }: { order: Order }) {
  const [name, setName] = useState("");
  const [qty, setQty] = useState(1);
  const [price, setPrice] = useState(0);
  return (
    <div className="space-y-3">
      <div className="rounded-md border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
            <tr><th className="px-3 py-2 text-left">Produit</th><th className="px-3 py-2 text-right">Qté</th><th className="px-3 py-2 text-right">Prix</th><th className="px-3 py-2 text-right">Stock</th><th className="w-8" /></tr>
          </thead>
          <tbody>
            {order.details.map((d, i) => (
              <tr key={i} className="border-t">
                <td className="px-3 py-2">{d.name}</td>
                <td className="px-3 py-2 text-right">
                  <Input type="number" value={d.qty} onChange={(e) => actions.updateOrderProduct(order.id, i, { qty: Number(e.target.value) })} className="h-7 w-16 text-right ml-auto" />
                </td>
                <td className="px-3 py-2 text-right">{fmtMoney(d.price)}</td>
                <td className="px-3 py-2 text-right">
                  <span className={(d.stock ?? 0) < d.qty ? "text-destructive font-medium" : ""}>{d.stock ?? "—"}</span>
                </td>
                <td className="px-2">
                  <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => actions.removeOrderProduct(order.id, i)}><Trash2 className="h-3.5 w-3.5" /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-md border p-3 space-y-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Ajouter un produit</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_80px_100px_auto]">
          <Input placeholder="Nom du produit" value={name} onChange={(e) => setName(e.target.value)} />
          <Input type="number" placeholder="Qté" value={qty} onChange={(e) => setQty(Number(e.target.value))} />
          <Input type="number" placeholder="Prix" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <Button onClick={() => {
            if (!name) { toast.error("Nom requis"); return; }
            actions.addOrderProduct(order.id, { name, qty, price, stock: 100 });
            setName(""); setQty(1); setPrice(0);
            toast.success("Produit ajouté");
          }}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>
    </div>
  );
}

function WorkflowTimeline({ order }: { order: Order }) {
  const currentIdx = WORKFLOW_STEPS.findIndex((s) => s.key === order.currentStep);
  const total = WORKFLOW_STEPS.reduce((n, s) => n + order.workflow[s.key].tasks.length, 0);
  const done = WORKFLOW_STEPS.reduce((n, s) => n + order.workflow[s.key].tasks.filter((t) => t.done).length, 0);
  const pct = Math.round((done / total) * 100);
  return (
    <div className="space-y-3">
      <div className="rounded-md border p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>Progression globale</span>
          <span>{done}/{total} · {pct}%</span>
        </div>
        <Progress value={pct} className="h-1.5" />
      </div>
      <ol className="relative space-y-3">
        {WORKFLOW_STEPS.map((s, idx) => {
          const st = order.workflow[s.key];
          const allDone = st.tasks.every((t) => t.done);
          const isCurrent = idx === currentIdx;
          return (
            <li key={s.key} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={
                  "flex h-7 w-7 items-center justify-center rounded-full border text-[10px] font-semibold " +
                  (allDone ? "bg-success text-success-foreground border-success"
                    : isCurrent ? "bg-warning/30 border-warning text-warning-foreground"
                    : "bg-muted text-muted-foreground")
                }>
                  {allDone ? <CheckCircle2 className="h-4 w-4" /> : isCurrent ? "⏳" : idx + 1}
                </div>
                {idx < WORKFLOW_STEPS.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
              </div>
              <div className="flex-1 pb-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{s.label}</p>
                  <span className="text-[10px] text-muted-foreground">
                    {st.owner ? `${st.owner} · ${st.date}` : isCurrent ? "En cours" : "À venir"}
                    {st.durationDays ? ` · ${st.durationDays}j` : ""}
                  </span>
                </div>
                <ul className="mt-1.5 space-y-1">
                  {st.tasks.map((t, ti) => (
                    <li key={ti} className="flex items-start gap-2">
                      <Checkbox checked={t.done} onCheckedChange={() => actions.toggleOrderTask(order.id, s.key, ti)} className="mt-0.5" />
                      <span className={"text-xs " + (t.done ? "line-through text-muted-foreground" : "")}>{t.label}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function CommTab({ order }: { order: Order }) {
  const [text, setText] = useState("");
  const KIND_ICON = { email: Mail, whatsapp: MessageSquare, call: Phone, note: FileText, assignment: UserCheck, system: Bell };
  return (
    <div className="space-y-3">
      <div className="rounded-md border p-3 space-y-2">
        <Textarea placeholder="Note interne, commentaire ADV / logistique…" value={text} onChange={(e) => setText(e.target.value)} rows={3} />
        <div className="flex justify-end">
          <Button size="sm" onClick={() => {
            if (!text.trim()) return;
            actions.addCommunication(order.id, { id: `c-${Date.now()}`, kind: "note", author: "Vous", date: today, content: text });
            setText("");
            toast.success("Note ajoutée");
          }}><Plus className="h-4 w-4 mr-1" />Ajouter</Button>
        </div>
      </div>
      <ul className="space-y-2">
        {order.communications.map((c) => {
          const I = KIND_ICON[c.kind];
          return (
            <li key={c.id} className="rounded-md border p-3 text-sm">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1.5"><I className="h-3.5 w-3.5" />{c.kind} · {c.author}</span>
                <span>{c.date}</span>
              </div>
              <p className="mt-1 text-sm">{c.content}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function AITab({ order }: { order: Order }) {
  const TONE_CLS = {
    info: "border-info/40 bg-info/5 text-info",
    warning: "border-warning/40 bg-warning/10 text-warning-foreground",
    danger: "border-destructive/40 bg-destructive/5 text-destructive",
    success: "border-success/40 bg-success/10 text-success",
  };
  return (
    <div className="space-y-3">
      <div className="rounded-md border p-3 bg-gradient-to-br from-primary/5 to-transparent">
        <div className="flex items-center gap-2"><Bot className="h-4 w-4 text-primary" /><span className="text-sm font-medium">Suggestions IA</span></div>
        <ul className="mt-2 space-y-1.5">
          {order.aiSuggestions.map((s, i) => (
            <li key={i} className={"rounded-md border px-3 py-2 text-xs " + TONE_CLS[s.tone]}>{s.text}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-md border p-3 space-y-2">
        <p className="text-xs font-semibold uppercase text-muted-foreground">Actions rapides</p>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={() => toast.success("Client relancé par email")}>📧 Relancer client</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("ADV notifié")}>📋 Relancer ADV</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Logistique notifiée")}>🚚 Relancer logistique</Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Email généré dans la boîte de réception")}><Sparkles className="h-3.5 w-3.5 mr-1" />Générer email</Button>
          <Button size="sm" variant="outline" className="col-span-2" onClick={() => toast.success("Message WhatsApp généré")}><Sparkles className="h-3.5 w-3.5 mr-1" />Générer WhatsApp</Button>
        </div>
      </div>
    </div>
  );
}

/* ------------ 360° dialog ------------ */
function View360Dialog({ id, onClose }: { id: string | null; onClose: () => void }) {
  const order = useStore((s) => s.orders.find((o) => o.id === id) ?? null);
  return (
    <Dialog open={!!id} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-7xl w-[95vw] max-h-[92vh] overflow-hidden flex flex-col p-0">
        {order && (
          <>
            <DialogHeader className="px-5 py-3 border-b flex flex-row items-center justify-between">
              <div>
                <DialogTitle className="flex items-center gap-2"><LayoutGrid className="h-4 w-4" />Vue 360° · {order.id} · {order.client}</DialogTitle>
                <DialogDescription>{fmtMoney(order.amount)} · {order.warehouse} · livraison {order.dueDate}</DialogDescription>
              </div>
              <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto grid gap-4 p-5 lg:grid-cols-3">
              <div className="space-y-3">
                <InfoSection title="Client" icon={Building2}>
                  <Row label="Société" value={order.client} />
                  <Row label="ICE" value={order.clientInfo.ice} />
                  <Row label="Ville" value={order.city} />
                  <Row label="Téléphone" value={order.clientInfo.phone} />
                  <Row label="Email" value={order.clientInfo.email} />
                </InfoSection>
                <InfoSection title="Résumé financier" icon={CreditCard}>
                  <Row label="Sous-total" value={fmtMoney(order.subtotal)} />
                  <Row label="TVA" value={fmtMoney(order.tax)} />
                  <Row label="Total" value={fmtMoney(order.amount)} bold />
                  <Row label="Payé" value={fmtMoney(order.paid)} />
                  <Row label="Reste" value={fmtMoney(order.amount - order.paid)} bold tone={order.amount - order.paid > 0 ? "destructive" : "success"} />
                </InfoSection>
              </div>
              <div><WorkflowTimeline order={order} /></div>
              <div className="space-y-3">
                <AITab order={order} />
                <div className="rounded-md border p-3 space-y-1.5">
                  <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5"><FileText className="h-3.5 w-3.5" />Documents</p>
                  {DOCS.map((d) => (
                    <button key={d.key} onClick={() => toast.success(`${d.label} téléchargé`)} className="w-full flex items-center justify-between rounded-md border px-2.5 py-1.5 text-xs hover:bg-muted/50">
                      <span>{d.label}</span><Download className="h-3.5 w-3.5" />
                    </button>
                  ))}
                </div>
                <div className="rounded-md border p-3 space-y-1.5">
                  <p className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5"><MessageSquare className="h-3.5 w-3.5" />Dernières communications</p>
                  {order.communications.slice(0, 3).map((c) => (
                    <div key={c.id} className="text-xs border-l-2 border-primary/40 pl-2 py-0.5">
                      <p className="text-muted-foreground">{c.kind} · {c.author} · {c.date}</p>
                      <p>{c.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

/* ------------ Create order ------------ */
function CreateOrderDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [client, setClient] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [amount, setAmount] = useState(50000);
  const [priority, setPriority] = useState<OrderPriority>("normal");
  const [warehouse, setWarehouse] = useState<Warehouse>("Rabat");
  const [commercial, setCommercial] = useState("Ahmed Benali");
  const [adv, setAdv] = useState("Sara M.");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [dueDate, setDueDate] = useState("2026-06-30");

  const submit = () => {
    if (!client) { toast.error("Client requis"); return; }
    const id = `CMD-${Date.now().toString().slice(-5)}`;
    const subtotal = Math.round(amount / 1.2);
    const order: Order = {
      id, client, city, amount, items: 1, status: "preparation", date: today,
      stage: "commercial", address: `${city}`, driver: "—", details: [{ name: "Produit personnalisé", qty: 1, price: amount, stock: 50 }],
      workflow: buildWorkflow("preparation"),
      priority, commercial, adv, warehouse,
      clientInfo: { ice: "000000000000000", address: city, phone, email },
      dueDate, subtotal, tax: amount - subtotal, paid: 0, currentStep: "creation",
      invoiceStatus: "draft",
      communications: [{ id: "c0", kind: "note", author: "Système", date: today, content: "Commande créée." }],
      aiSuggestions: [{ tone: "info", text: "Nouvelle commande — à valider commercialement." }],
    };
    actions.addOrder(order);
    toast.success(`${id} créée`);
    onClose();
    setClient(""); setAmount(50000); setPhone(""); setEmail("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Nouvelle commande</DialogTitle>
          <DialogDescription>Saisie rapide — vous pourrez compléter dans la fiche.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Client *"><Input value={client} onChange={(e) => setClient(e.target.value)} /></Field>
          <Field label="Ville"><Input value={city} onChange={(e) => setCity(e.target.value)} /></Field>
          <Field label="Téléphone"><Input value={phone} onChange={(e) => setPhone(e.target.value)} /></Field>
          <Field label="Email"><Input value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Field label="Montant (MAD)"><Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} /></Field>
          <Field label="Livraison prévue"><Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} /></Field>
          <Field label="Priorité">
            <Select value={priority} onValueChange={(v) => setPriority(v as OrderPriority)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="low">Basse</SelectItem><SelectItem value="normal">Normale</SelectItem><SelectItem value="high">Haute</SelectItem></SelectContent>
            </Select>
          </Field>
          <Field label="Dépôt">
            <Select value={warehouse} onValueChange={(v) => setWarehouse(v as Warehouse)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{WAREHOUSES.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Commercial"><Input value={commercial} onChange={(e) => setCommercial(e.target.value)} /></Field>
          <Field label="ADV"><Input value={adv} onChange={(e) => setAdv(e.target.value)} /></Field>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Annuler</Button>
          <Button onClick={submit}>Créer la commande</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="space-y-1"><label className="text-xs text-muted-foreground">{label}</label>{children}</div>;
}
