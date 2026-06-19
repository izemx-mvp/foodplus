import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore, actions } from "@/lib/store";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Users, TrendingUp, Package, Target, RefreshCw, Sparkles, Megaphone,
  ArrowUpRight, ArrowDownRight, Activity,
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Dashboard – Foodplus" }] }),
  component: Dashboard,
});

function Dashboard() {
  const leads = useStore((s) => s.leads);
  const orders = useStore((s) => s.orders);
  const navigate = useNavigate();
  const [refreshing, setRefreshing] = useState(false);

  const qualified = leads.filter((l) => l.status === "qualified" || l.status === "negotiation").length;
  const won = leads.filter((l) => l.status === "won");
  const conversion = Math.round((won.length / leads.length) * 100);
  const delivered = orders.filter((o) => o.status === "delivered").length;
  const delayed = orders.filter((o) => o.status === "delayed").length;
  const revenue = won.reduce((s, l) => s + l.value, 0);
  const pipeline = leads.filter((l) => l.status !== "lost" && l.status !== "won").reduce((s, l) => s + l.value, 0);

  const kpis = [
    { label: "Leads générés", value: leads.length, delta: "+12%", up: true, icon: Users, iconClass: "bg-info/15 text-info", to: "/leads" as const },
    { label: "Leads qualifiés", value: qualified, delta: "+8%", up: true, icon: Target, iconClass: "bg-warning/20 text-warning-foreground", to: "/leads" as const },
    { label: "Taux de conversion", value: `${conversion}%`, delta: "+3.2pts", up: true, icon: TrendingUp, iconClass: "bg-success/15 text-success", to: "/leads" as const },
    { label: "Commandes livrées", value: `${delivered}/${orders.length}`, delta: `${delayed} retard`, up: delayed === 0, icon: Package, iconClass: delayed > 0 ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success", to: "/orders" as const },
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => { setRefreshing(false); toast.success("Données actualisées", { description: "Synchronisation avec ERP terminée" }); }, 800);
  };
  const handleGenerateLeads = () => {
    const cities = ["Casablanca", "Tanger", "Marrakech"];
    const sectors = ["Restauration", "Hôtellerie", "Boulangerie"];
    for (let i = 0; i < 3; i++) {
      actions.addLead({
        id: `L-${Date.now()}-${i}`,
        company: `Nouvelle entreprise ${i + 1}`,
        contact: "Contact IA",
        sector: sectors[i % 3],
        city: cities[i % 3],
        score: 60 + Math.floor(Math.random() * 35),
        status: "new",
        email: `contact${i}@nouveau.ma`,
        phone: "+212 6XX XXX XXX",
        value: 40000 + Math.floor(Math.random() * 80000),
        notes: "Lead généré par scan IA (LinkedIn + annuaires).",
        nextAction: new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      });
    }
    toast.success("3 nouveaux leads générés par IA", { description: "Sources : LinkedIn Sales Nav + Annuaire CGEM" });
    navigate({ to: "/leads" });
  };

  const recentActivity = [
    { tone: "success" as const, text: "Commande CMD-2406 livrée à Cantine OCP Agadir" },
    { tone: "info" as const, text: "Nouveau lead chaud : Sofitel Tanger (score 95)" },
    { tone: "warning" as const, text: "CMD-2404 en retard – Dar Zellij Fès" },
    { tone: "linkedin" as const, text: "Post LinkedIn publié : 1.2K vues, 42 réactions" },
    { tone: "instagram" as const, text: "Post Instagram en brouillon : Tajine du chef" },
    { tone: "destructive" as const, text: "Lead perdu : Cafétéria Centrale (concurrence)" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Bonjour Younes 👋</h1>
          <p className="text-sm text-muted-foreground">Vue d'ensemble de l'activité Foodplus · {new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} /> Actualiser
          </Button>
          <Button variant="outline" onClick={handleGenerateLeads}>
            <Sparkles className="h-4 w-4" /> Générer leads
          </Button>
          <Button onClick={() => toast.success("Campagne IA lancée", { description: "Génération de 12 posts multi-canaux en cours…" })}>
            <Megaphone className="h-4 w-4" /> Lancer campagne IA
          </Button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="overflow-hidden">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">{k.label}</p>
                  <p className="mt-2 text-3xl font-semibold">{k.value}</p>
                </div>
                <div className={`grid h-10 w-10 place-items-center rounded-lg ${k.iconClass}`}>
                  <k.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                {k.up ? <ArrowUpRight className="h-3 w-3 text-success" /> : <ArrowDownRight className="h-3 w-3 text-destructive" />}
                <span className={k.up ? "text-success" : "text-destructive"}>{k.delta}</span>
                <span className="text-muted-foreground">vs semaine dernière</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base"><Activity className="h-4 w-4 text-primary" /> Performance commerciale (30 jours)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartBars />
            <div className="mt-4 grid grid-cols-3 gap-4 border-t pt-4">
              <div><p className="text-xs text-muted-foreground">Pipeline total</p><p className="text-lg font-semibold">{(pipeline / 1000).toFixed(0)}K MAD</p></div>
              <div><p className="text-xs text-muted-foreground">CA gagné</p><p className="text-lg font-semibold text-success">{(revenue / 1000).toFixed(0)}K MAD</p></div>
              <div><p className="text-xs text-muted-foreground">Panier moyen</p><p className="text-lg font-semibold">{Math.round(orders.reduce((s, o) => s + o.amount, 0) / orders.length / 1000)}K MAD</p></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Activité récente</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-sm">
                <StatusBadge tone={a.tone}>•</StatusBadge>
                <span className="flex-1 text-muted-foreground">{a.text}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ChartBars() {
  const data = [42, 55, 38, 67, 72, 58, 80, 75, 88, 62, 91, 84];
  const max = Math.max(...data);
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((v, i) => (
        <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
          <div
            className="w-full rounded-t bg-gradient-to-t from-primary to-info transition-all hover:opacity-80"
            style={{ height: `${(v / max) * 100}%`, minHeight: "4px" }}
          />
          <span className="text-[10px] text-muted-foreground">S{i + 1}</span>
        </div>
      ))}
    </div>
  );
}
