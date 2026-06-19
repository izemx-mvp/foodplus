import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import { ORDER_STATUSES, WORKFLOW_STEPS, type Order, type OrderStatus } from "@/lib/mock-data";
import { Package, Truck, CheckCircle2, AlertTriangle, List, KanbanSquare, GripVertical, MapPin, User, X, Circle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Commandes – Foodplus" }] }),
  component: OrdersPage,
});

const statusMeta = (s: OrderStatus) => ORDER_STATUSES.find((x) => x.key === s)!;

function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = useMemo(() => orders.filter((o) => {
    if (q && ![o.id, o.client, o.city].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    if (status !== "all" && o.status !== status) return false;
    return true;
  }), [orders, q, status]);

  const totals = {
    prep: orders.filter((o) => o.status === "preparation").length,
    inProgress: orders.filter((o) => o.status === "in_progress").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    delayed: orders.filter((o) => o.status === "delayed").length,
  };
  const ca = orders.reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Commandes & Logistique</h1>
          <p className="text-sm text-muted-foreground">{orders.length} commandes · CA total {(ca / 1000).toFixed(0)}K MAD</p>
        </div>
        <Tabs value={view} onValueChange={(v) => setView(v as "list" | "kanban")}>
          <TabsList>
            <TabsTrigger value="list"><List className="h-3.5 w-3.5 mr-1" />Liste</TabsTrigger>
            <TabsTrigger value="kanban"><KanbanSquare className="h-3.5 w-3.5 mr-1" />Kanban</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Package className="h-4 w-4 text-warning-foreground" /><span className="text-xs text-muted-foreground">Préparation</span></div><p className="mt-1 text-2xl font-semibold">{totals.prep}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Truck className="h-4 w-4 text-info" /><span className="text-xs text-muted-foreground">En cours</span></div><p className="mt-1 text-2xl font-semibold">{totals.inProgress}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-xs text-muted-foreground">Livrées</span></div><p className="mt-1 text-2xl font-semibold text-success">{totals.delivered}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-xs text-muted-foreground">En retard</span></div><p className="mt-1 text-2xl font-semibold text-destructive">{totals.delayed}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          <Input placeholder="Rechercher N°, client, ville…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              {ORDER_STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {view === "list" ? (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left">N°</th>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left">Ville</th>
                    <th className="px-4 py-3 text-right">Montant</th>
                    <th className="px-4 py-3 text-center">Articles</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((o) => {
                    const m = statusMeta(o.status);
                    return (
                      <tr key={o.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(o)}>
                        <td className="px-4 py-3 font-mono text-xs font-medium">{o.id}</td>
                        <td className="px-4 py-3">{o.client}</td>
                        <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                        <td className="px-4 py-3 text-right font-medium">{o.amount.toLocaleString()} MAD</td>
                        <td className="px-4 py-3 text-center text-muted-foreground">{o.items}</td>
                        <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                        <td className="px-4 py-3"><StatusBadge tone={m.tone}>{m.label}</StatusBadge></td>
                      </tr>
                    );
                  })}
                  {filtered.length === 0 && (
                    <tr><td colSpan={7} className="px-4 py-10 text-center text-sm text-muted-foreground">Aucune commande.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <KanbanOrders orders={filtered} onSelect={setSelected} />
      )}

      <OrderDialog order={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function KanbanOrders({ orders, onSelect }: { orders: Order[]; onSelect: (o: Order) => void }) {
  const [dragging, setDragging] = useState<string | null>(null);
  const drop = (s: OrderStatus) => {
    if (!dragging) return;
    actions.updateOrder(dragging, { status: s });
    toast.success(`Commande → ${statusMeta(s).label}`);
    setDragging(null);
  };
  return (
    <div className="grid gap-3 lg:grid-cols-4 md:grid-cols-2">
      {ORDER_STATUSES.map((s) => {
        const cards = orders.filter((o) => o.status === s.key);
        const total = cards.reduce((sum, o) => sum + o.amount, 0);
        return (
          <div key={s.key}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => drop(s.key)}
            className="rounded-lg border bg-muted/30 p-2 min-h-[400px]">
            <div className="flex items-center justify-between px-1 pb-2">
              <div className="flex items-center gap-2">
                <StatusBadge tone={s.tone}>{s.label}</StatusBadge>
                <span className="text-xs text-muted-foreground">{cards.length}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">{(total / 1000).toFixed(0)}K</span>
            </div>
            <div className="space-y-2">
              {cards.map((o) => (
                <div key={o.id}
                  draggable
                  onDragStart={() => setDragging(o.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => onSelect(o)}
                  className="cursor-grab rounded-md border bg-card p-3 text-sm shadow-sm hover:shadow-md active:cursor-grabbing">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="font-mono text-[10px] text-muted-foreground">{o.id}</p>
                      <p className="font-medium truncate">{o.client}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{o.city}</span>
                        <span className="font-medium">{(o.amount / 1000).toFixed(0)}K</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function OrderDialog({ order, onClose }: { order: Order | null; onClose: () => void }) {
  const live = useStore((s) => s.orders.find((o) => o.id === order?.id) ?? null);
  const o = live ?? order;
  const totalTasks = o ? WORKFLOW_STEPS.reduce((n, s) => n + o.workflow[s.key].tasks.length, 0) : 0;
  const doneTasks = o ? WORKFLOW_STEPS.reduce((n, s) => n + o.workflow[s.key].tasks.filter((t) => t.done).length, 0) : 0;
  const pct = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <Dialog open={!!order} onOpenChange={(x) => !x && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        {o && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-2">
                <span>{o.id} · {o.client}</span>
                <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
              </DialogTitle>
              <DialogDescription>{o.date} · {o.city}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" />{o.address}</div>
                <div className="flex items-center gap-2"><User className="h-4 w-4 text-muted-foreground" />Livreur : {o.driver}</div>
                <div>Total : <span className="font-semibold">{o.amount.toLocaleString()} MAD</span></div>
                <div>Articles : <span className="font-semibold">{o.items}</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Statut</label>
                <Select value={o.status} onValueChange={(v) => { actions.updateOrder(o.id, { status: v as OrderStatus }); toast.success(`Statut → ${statusMeta(v as OrderStatus).label}`); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {ORDER_STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <div className="flex items-center justify-between px-3 py-2 border-b">
                <span className="text-xs font-medium uppercase text-muted-foreground">Workflow commande</span>
                <span className="text-xs text-muted-foreground">{doneTasks}/{totalTasks} · {pct}%</span>
              </div>
              <div className="px-3 pt-2"><Progress value={pct} className="h-1.5" /></div>
              <ol className="relative px-3 py-3 space-y-3">
                {WORKFLOW_STEPS.map((s, idx) => {
                  const st = o.workflow[s.key];
                  const allDone = st.tasks.every((t) => t.done);
                  const someDone = st.tasks.some((t) => t.done);
                  return (
                    <li key={s.key} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className={
                          "flex h-6 w-6 items-center justify-center rounded-full border text-[10px] font-semibold " +
                          (allDone ? "bg-success text-success-foreground border-success" : someDone ? "bg-warning/30 border-warning text-warning-foreground" : "bg-muted text-muted-foreground")
                        }>
                          {allDone ? <CheckCircle2 className="h-3.5 w-3.5" /> : <Circle className="h-3 w-3" />}
                        </div>
                        {idx < WORKFLOW_STEPS.length - 1 && <div className="w-px flex-1 bg-border mt-1" />}
                      </div>
                      <div className="flex-1 pb-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{idx + 1}. {s.label}</p>
                          {allDone && <span className="text-[10px] text-success">Complété</span>}
                        </div>
                        <ul className="mt-1.5 space-y-1.5">
                          {st.tasks.map((t, ti) => (
                            <li key={ti} className="flex items-start gap-2">
                              <Checkbox
                                checked={t.done}
                                onCheckedChange={() => actions.toggleOrderTask(o.id, s.key, ti)}
                                className="mt-0.5"
                              />
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

            <div className="rounded-md border">
              <div className="px-3 py-2 border-b text-xs font-medium text-muted-foreground uppercase">Détails articles</div>
              <div className="divide-y">
                {o.details.map((d, i) => (
                  <div key={i} className="px-3 py-2 flex items-center justify-between text-sm">
                    <span>{d.name}</span>
                    <span className="text-muted-foreground">{d.qty} × {d.price} MAD</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
