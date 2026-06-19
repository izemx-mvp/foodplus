import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import type { OrderStatus } from "@/lib/mock-data";
import { Package, Truck, CheckCircle2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/orders")({
  head: () => ({ meta: [{ title: "Commandes – Foodplus" }] }),
  component: OrdersPage,
});

const tone = (s: OrderStatus) => s === "delivered" ? "success" : s === "in_progress" ? "info" : s === "preparation" ? "warning" : "destructive";
const label = (s: OrderStatus) => ({ delivered: "Livré", in_progress: "En cours", preparation: "Préparation", delayed: "Retard" }[s]);

const FLOW: OrderStatus[] = ["preparation", "in_progress", "delivered"];

function OrdersPage() {
  const orders = useStore((s) => s.orders);
  const totals = {
    delivered: orders.filter(o => o.status === "delivered").length,
    inProgress: orders.filter(o => o.status === "in_progress").length,
    prep: orders.filter(o => o.status === "preparation").length,
    delayed: orders.filter(o => o.status === "delayed").length,
  };
  const ca = orders.reduce((s, o) => s + o.amount, 0);

  const next = (id: string, current: OrderStatus) => {
    const idx = FLOW.indexOf(current);
    if (idx < FLOW.length - 1) {
      const ns = FLOW[idx + 1];
      actions.updateOrder(id, { status: ns });
      toast.success(`Commande ${id} → ${label(ns)}`);
    } else toast.info("Commande déjà livrée");
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Commandes & Logistique</h1>
        <p className="text-sm text-muted-foreground">{orders.length} commandes · CA total {(ca/1000).toFixed(0)}K MAD</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Package className="h-4 w-4 text-warning-foreground" /><span className="text-xs text-muted-foreground">Préparation</span></div><p className="mt-1 text-2xl font-semibold">{totals.prep}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><Truck className="h-4 w-4 text-info" /><span className="text-xs text-muted-foreground">En cours</span></div><p className="mt-1 text-2xl font-semibold">{totals.inProgress}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-success" /><span className="text-xs text-muted-foreground">Livrées</span></div><p className="mt-1 text-2xl font-semibold text-success">{totals.delivered}</p></CardContent></Card>
        <Card><CardContent className="p-4"><div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4 text-destructive" /><span className="text-xs text-muted-foreground">En retard</span></div><p className="mt-1 text-2xl font-semibold text-destructive">{totals.delayed}</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left">N° Commande</th>
                  <th className="px-4 py-3 text-left">Client</th>
                  <th className="px-4 py-3 text-left">Ville</th>
                  <th className="px-4 py-3 text-right">Montant</th>
                  <th className="px-4 py-3 text-center">Articles</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-t hover:bg-muted/30">
                    <td className="px-4 py-3 font-mono text-xs font-medium">{o.id}</td>
                    <td className="px-4 py-3">{o.client}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.city}</td>
                    <td className="px-4 py-3 text-right font-medium">{o.amount.toLocaleString()} MAD</td>
                    <td className="px-4 py-3 text-center text-muted-foreground">{o.items}</td>
                    <td className="px-4 py-3 text-muted-foreground">{o.date}</td>
                    <td className="px-4 py-3"><StatusBadge tone={tone(o.status)}>{label(o.status)}</StatusBadge></td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-1">
                        {o.status === "delayed" ? (
                          <Button size="sm" variant="outline" onClick={() => { actions.updateOrder(o.id, { status: "in_progress" }); toast.success("Relance logistique envoyée"); }}>Relancer</Button>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => next(o.id, o.status)}>Étape suivante</Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
