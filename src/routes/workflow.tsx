import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import type { Order } from "@/lib/mock-data";
import { ArrowRight, Briefcase, ClipboardList, Truck, PackageCheck } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/workflow")({
  head: () => ({ meta: [{ title: "Workflow – Foodplus" }] }),
  component: WorkflowPage,
});

const STAGES: { key: Order["stage"]; label: string; icon: any; tone: string }[] = [
  { key: "commercial", label: "Commercial", icon: Briefcase, tone: "text-info" },
  { key: "adv", label: "ADV", icon: ClipboardList, tone: "text-warning-foreground" },
  { key: "logistique", label: "Logistique", icon: Truck, tone: "text-linkedin" },
  { key: "livraison", label: "Livraison", icon: PackageCheck, tone: "text-success" },
];

const statusTone = (s: Order["status"]) => s === "delivered" ? "success" : s === "in_progress" ? "info" : s === "preparation" ? "warning" : "destructive";
const statusLabel = (s: Order["status"]) => ({ delivered: "Livré", in_progress: "En cours", preparation: "Préparation", delayed: "Retard" }[s]);

function WorkflowPage() {
  const orders = useStore((s) => s.orders);

  const advance = (o: Order) => {
    const idx = STAGES.findIndex(s => s.key === o.stage);
    if (idx < STAGES.length - 1) {
      const ns = STAGES[idx + 1];
      const newStatus: Order["status"] = ns.key === "livraison" ? "delivered" : ns.key === "logistique" ? "in_progress" : "preparation";
      actions.updateOrder(o.id, { stage: ns.key, status: newStatus });
      toast.success(`${o.id} → ${ns.label}`, { description: `Notification envoyée à l'équipe ${ns.label}` });
    } else {
      toast.info("Workflow terminé");
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Workflow Inter-départements</h1>
        <p className="text-sm text-muted-foreground">Lead → Qualification IA + ADV → Commande → Logistique → Livraison</p>
      </div>

      {/* Pipeline schema */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { l: "Lead capturé", t: "info" },
              { l: "Qualification IA + ADV", t: "warning" },
              { l: "Commande générée", t: "info" },
              { l: "Logistique assignée", t: "linkedin" },
              { l: "Livraison", t: "success" },
            ].map((s, i, arr) => (
              <div key={s.l} className="flex items-center gap-2 shrink-0">
                <StatusBadge tone={s.t as any}>{s.l}</StatusBadge>
                {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {STAGES.map((stage) => {
          const items = orders.filter((o) => o.stage === stage.key);
          return (
            <Card key={stage.key}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <stage.icon className={`h-4 w-4 ${stage.tone}`} />
                  {stage.label} <span className="ml-auto text-xs text-muted-foreground">{items.length}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-0">
                {items.map((o) => (
                  <div key={o.id} className="rounded-md border bg-card p-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs">{o.id}</span>
                      <StatusBadge tone={statusTone(o.status)}>{statusLabel(o.status)}</StatusBadge>
                    </div>
                    <div className="mt-1 font-medium truncate">{o.client}</div>
                    <div className="text-xs text-muted-foreground">{o.city} · {(o.amount/1000).toFixed(0)}K MAD</div>
                    <Button size="sm" variant="outline" className="mt-2 w-full" onClick={() => advance(o)}>
                      Étape suivante <ArrowRight className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {items.length === 0 && <div className="text-center text-xs text-muted-foreground py-4">Aucune commande</div>}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
