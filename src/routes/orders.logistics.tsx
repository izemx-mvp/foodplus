import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useStore } from "@/lib/store";
import { WAREHOUSES, WAREHOUSE_STOCK, type Warehouse } from "@/lib/mock-data";
import { Truck, MapPin, Package, AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/orders/logistics")({
  head: () => ({ meta: [{ title: "Logistique – Foodplus" }] }),
  component: LogisticsPage,
});

const COORDS: Record<Warehouse, { x: number; y: number }> = {
  Tanger: { x: 30, y: 8 },
  Rabat: { x: 22, y: 28 },
  Marrakech: { x: 28, y: 58 },
  Agadir: { x: 18, y: 75 },
};

function LogisticsPage() {
  const orders = useStore((s) => s.orders);
  const [active, setActive] = useState<Warehouse>("Tanger");

  const byWh = (w: Warehouse) => orders.filter((o) => o.warehouse === w);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2"><Truck className="h-6 w-6" />Vue Logistique</h1>
        <p className="text-sm text-muted-foreground">Dépôts du réseau Foodplus au Maroc</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* Map */}
        <Card>
          <CardContent className="p-0">
            <div className="relative aspect-[3/4] bg-gradient-to-br from-info/5 via-muted/40 to-success/5 rounded-md overflow-hidden">
              {/* Stylized Morocco silhouette */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
                <path d="M15 5 L40 8 L55 25 L50 45 L40 65 L25 85 L10 90 L5 60 L8 30 Z" fill="currentColor" className="text-primary" />
              </svg>
              {WAREHOUSES.map((w) => {
                const c = COORDS[w];
                const items = byWh(w);
                const late = items.filter((o) => o.status === "delayed").length;
                const isActive = active === w;
                return (
                  <button key={w} onClick={() => setActive(w)} style={{ left: `${c.x}%`, top: `${c.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group">
                    <div className={"relative flex h-12 w-12 items-center justify-center rounded-full border-2 shadow-lg transition " + (isActive ? "bg-primary text-primary-foreground border-primary scale-110" : "bg-card border-primary/40 hover:scale-105")}>
                      <MapPin className="h-5 w-5" />
                      {late > 0 && <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-destructive text-[9px] grid place-items-center text-destructive-foreground font-bold">{late}</span>}
                    </div>
                    <span className={"absolute left-1/2 top-full -translate-x-1/2 mt-1 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-medium " + (isActive ? "bg-primary text-primary-foreground" : "bg-card border")}>{w}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Detail */}
        <div className="space-y-3">
          {WAREHOUSES.map((w) => {
            const stock = WAREHOUSE_STOCK[w];
            const pct = Math.round((stock.available / stock.capacity) * 100);
            const items = byWh(w);
            const toPrep = items.filter((o) => o.currentStep === "preparation_logistique" || o.currentStep === "validation_adv").length;
            const late = items.filter((o) => o.status === "delayed").length;
            const isActive = active === w;
            return (
              <Card key={w} className={isActive ? "ring-2 ring-primary" : ""}>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 grid place-items-center rounded-md bg-primary/10 text-primary"><Package className="h-4 w-4" /></div>
                      <div>
                        <p className="font-semibold">Dépôt de {w}</p>
                        <p className="text-[11px] text-muted-foreground">{items.length} commandes affectées</p>
                      </div>
                    </div>
                    {late > 0 && <Badge variant="outline" className="border-destructive/40 text-destructive bg-destructive/5"><AlertTriangle className="h-3 w-3 mr-1" />{late} retard</Badge>}
                  </div>
                  <div>
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Stock disponible</span>
                      <span>{stock.available} / {stock.capacity} unités · {pct}%</span>
                    </div>
                    <Progress value={pct} className="h-1.5" />
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-md bg-warning/10 border border-warning/30 px-2 py-1.5">
                      <p className="text-[10px] text-muted-foreground">À préparer</p>
                      <p className="font-semibold text-warning-foreground">{toPrep}</p>
                    </div>
                    <div className="rounded-md bg-destructive/10 border border-destructive/30 px-2 py-1.5">
                      <p className="text-[10px] text-muted-foreground">En retard</p>
                      <p className="font-semibold text-destructive">{late}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Commands for active warehouse */}
      <Card>
        <CardContent className="p-0">
          <div className="px-4 py-2 border-b text-xs font-semibold uppercase text-muted-foreground">Commandes — Dépôt {active}</div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
                <tr><th className="px-3 py-2 text-left">N°</th><th className="px-3 py-2 text-left">Client</th><th className="px-3 py-2 text-left">Étape</th><th className="px-3 py-2 text-right">Montant</th><th className="px-3 py-2 text-left">Livraison</th></tr>
              </thead>
              <tbody>
                {byWh(active).map((o) => (
                  <tr key={o.id} className="border-t">
                    <td className="px-3 py-2 font-mono text-xs">{o.id}</td>
                    <td className="px-3 py-2">{o.client}</td>
                    <td className="px-3 py-2 text-muted-foreground">{o.currentStep}</td>
                    <td className="px-3 py-2 text-right font-medium">{o.amount.toLocaleString("fr-FR")} MAD</td>
                    <td className="px-3 py-2 text-muted-foreground">{o.dueDate}</td>
                  </tr>
                ))}
                {byWh(active).length === 0 && <tr><td colSpan={5} className="px-3 py-8 text-center text-muted-foreground text-sm">Aucune commande sur ce dépôt.</td></tr>}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
