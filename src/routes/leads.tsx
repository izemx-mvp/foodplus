import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import { LEAD_STATUSES, SECTORS, CITIES, type Lead, type LeadStatus } from "@/lib/mock-data";
import { Sparkles, Mail, Phone, Plus, List, KanbanSquare, CalendarDays, GripVertical, X } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads & CRM – Foodplus" }] }),
  component: LeadsPage,
});

type View = "list" | "kanban" | "calendar";

const statusMeta = (s: LeadStatus) => LEAD_STATUSES.find((x) => x.key === s)!;

function LeadsPage() {
  const leads = useStore((s) => s.leads);
  const [view, setView] = useState<View>("list");
  const [q, setQ] = useState("");
  const [sector, setSector] = useState<string>("all");
  const [city, setCity] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");
  const [minScore, setMinScore] = useState(0);
  const [selected, setSelected] = useState<Lead | null>(null);
  const [aiMsg, setAiMsg] = useState<{ lead: Lead; msg: string } | null>(null);

  const filtered = useMemo(() => leads.filter((l) => {
    if (q && ![l.company, l.contact, l.email].join(" ").toLowerCase().includes(q.toLowerCase())) return false;
    if (sector !== "all" && l.sector !== sector) return false;
    if (city !== "all" && l.city !== city) return false;
    if (status !== "all" && l.status !== status) return false;
    if (l.score < minScore) return false;
    return true;
  }), [leads, q, sector, city, status, minScore]);

  const generateAIMessage = (lead: Lead) => {
    const msg = `Bonjour ${lead.contact.split(" ")[0]},

Je me permets de vous contacter au nom de Foodplus, distributeur agroalimentaire de référence au Maroc (groupe LRUCH).

Nous travaillons déjà avec plusieurs acteurs du secteur ${lead.sector.toLowerCase()} à ${lead.city}, et nous pourrions vous proposer des conditions avantageuses sur notre gamme premium.

Seriez-vous disponible pour un échange de 15 minutes cette semaine ?

Cordialement,
Younes El Idrissi – Foodplus`;
    setAiMsg({ lead, msg });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads & CRM</h1>
          <p className="text-sm text-muted-foreground">
            {filtered.length}/{leads.length} prospects · {leads.filter((l) => l.status === "won").length} gagnés ·{" "}
            {(leads.filter((l) => l.status !== "lost" && l.status !== "won").reduce((s, l) => s + l.value, 0) / 1000).toFixed(0)}K MAD en pipeline
          </p>
        </div>
        <div className="flex gap-2">
          <Tabs value={view} onValueChange={(v) => setView(v as View)}>
            <TabsList>
              <TabsTrigger value="list"><List className="h-3.5 w-3.5 mr-1" />Liste</TabsTrigger>
              <TabsTrigger value="kanban"><KanbanSquare className="h-3.5 w-3.5 mr-1" />Kanban</TabsTrigger>
              <TabsTrigger value="calendar"><CalendarDays className="h-3.5 w-3.5 mr-1" />Calendrier</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button onClick={() => toast.success("Scan IA lancé", { description: "Recherche LinkedIn, CGEM, annuaires…" })}>
            <Sparkles className="h-4 w-4" />Scanner
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-3 flex flex-wrap items-center gap-2">
          <Input placeholder="Rechercher entreprise, contact, email…" value={q} onChange={(e) => setQ(e.target.value)} className="w-64" />
          <Select value={sector} onValueChange={setSector}>
            <SelectTrigger className="w-44"><SelectValue placeholder="Secteur" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous secteurs</SelectItem>
              {SECTORS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="w-36"><SelectValue placeholder="Ville" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes villes</SelectItem>
              {CITIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous statuts</SelectItem>
              {LEAD_STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            Score min
            <input type="range" min={0} max={100} value={minScore} onChange={(e) => setMinScore(Number(e.target.value))} className="w-28" />
            <span className="w-7 text-right font-medium text-foreground">{minScore}</span>
          </div>
        </CardContent>
      </Card>

      {view === "list" && <ListView leads={filtered} onSelect={setSelected} onAI={generateAIMessage} />}
      {view === "kanban" && <KanbanView leads={filtered} onSelect={setSelected} />}
      {view === "calendar" && <CalendarView leads={filtered} onSelect={setSelected} />}

      <LeadDialog lead={selected} onClose={() => setSelected(null)} onAI={generateAIMessage} />

      <Dialog open={!!aiMsg} onOpenChange={(o) => !o && setAiMsg(null)}>
        <DialogContent>
          {aiMsg && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Message IA</DialogTitle>
                <DialogDescription>{aiMsg.lead.company} – {aiMsg.lead.contact}</DialogDescription>
              </DialogHeader>
              <Textarea value={aiMsg.msg} onChange={(e) => setAiMsg({ ...aiMsg, msg: e.target.value })} rows={12} />
              <div className="flex gap-2">
                <Button onClick={() => { actions.updateLead(aiMsg.lead.id, { status: "contacted" }); toast.success("Email envoyé via Gmail", { description: aiMsg.lead.email }); setAiMsg(null); }}>
                  <Mail className="h-4 w-4" />Envoyer
                </Button>
                <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(aiMsg.msg); toast.success("Copié"); }}>Copier</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ListView({ leads, onSelect, onAI }: { leads: Lead[]; onSelect: (l: Lead) => void; onAI: (l: Lead) => void }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">Entreprise</th>
                <th className="px-4 py-3 text-left">Contact</th>
                <th className="px-4 py-3 text-left">Secteur</th>
                <th className="px-4 py-3 text-left">Ville</th>
                <th className="px-4 py-3 text-right">Valeur</th>
                <th className="px-4 py-3 text-left">Score</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => {
                const m = statusMeta(l.status);
                return (
                  <tr key={l.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => onSelect(l)}>
                    <td className="px-4 py-3 font-medium">{l.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.contact}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.sector}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.city}</td>
                    <td className="px-4 py-3 text-right font-medium">{(l.value / 1000).toFixed(0)}K MAD</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${l.score > 80 ? "bg-success" : l.score > 60 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${l.score}%` }} />
                        </div>
                        <span className="text-xs font-medium">{l.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge tone={m.tone}>{m.label}</StatusBadge></td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => onAI(l)} title="Message IA"><Sparkles className="h-3.5 w-3.5" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => { actions.updateLead(l.id, { status: "contacted" }); toast.success(`${l.company} contacté`); }} title="Contacter"><Mail className="h-3.5 w-3.5" /></Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {leads.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-muted-foreground">Aucun lead ne correspond aux filtres.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function KanbanView({ leads, onSelect }: { leads: Lead[]; onSelect: (l: Lead) => void }) {
  const [dragging, setDragging] = useState<string | null>(null);

  const drop = (target: LeadStatus) => {
    if (!dragging) return;
    actions.updateLead(dragging, { status: target });
    toast.success(`Lead déplacé → ${statusMeta(target).label}`);
    setDragging(null);
  };

  return (
    <div className="grid gap-3 lg:grid-cols-6 md:grid-cols-3 sm:grid-cols-2">
      {LEAD_STATUSES.map((s) => {
        const cards = leads.filter((l) => l.status === s.key);
        const total = cards.reduce((sum, l) => sum + l.value, 0);
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
              {cards.map((l) => (
                <div key={l.id}
                  draggable
                  onDragStart={() => setDragging(l.id)}
                  onDragEnd={() => setDragging(null)}
                  onClick={() => onSelect(l)}
                  className="group cursor-grab rounded-md border bg-card p-3 text-sm shadow-sm hover:shadow-md active:cursor-grabbing transition">
                  <div className="flex items-start gap-2">
                    <GripVertical className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{l.company}</p>
                      <p className="text-xs text-muted-foreground truncate">{l.contact}</p>
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{l.city}</span>
                        <span className="font-medium">{(l.value / 1000).toFixed(0)}K</span>
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

function CalendarView({ leads, onSelect }: { leads: Lead[]; onSelect: (l: Lead) => void }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthName = cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const byDay = useMemo(() => {
    const m: Record<string, Lead[]> = {};
    leads.forEach((l) => { (m[l.nextAction] ||= []).push(l); });
    return m;
  }, [leads]);

  const cells: (number | null)[] = [];
  const offset = (firstDay + 6) % 7; // Monday-first
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium capitalize">{monthName}</div>
          <div className="flex gap-1">
            <Button size="sm" variant="outline" onClick={() => setCursor(new Date(year, month - 1, 1))}>‹</Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}>Aujourd'hui</Button>
            <Button size="sm" variant="outline" onClick={() => setCursor(new Date(year, month + 1, 1))}>›</Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-[10px] uppercase text-muted-foreground">
          {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => <div key={d} className="px-2 py-1">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((d, i) => {
            if (d === null) return <div key={i} className="h-24 rounded bg-muted/20" />;
            const iso = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const items = byDay[iso] || [];
            const isToday = iso === today.toISOString().slice(0, 10);
            return (
              <div key={i} className={`h-24 rounded border p-1 overflow-hidden ${isToday ? "border-primary bg-primary/5" : "bg-card"}`}>
                <div className="text-[10px] text-muted-foreground">{d}</div>
                <div className="space-y-0.5">
                  {items.slice(0, 2).map((l) => (
                    <button key={l.id} onClick={() => onSelect(l)} className="block w-full truncate rounded bg-primary/10 px-1 text-[10px] text-left text-primary hover:bg-primary/20">
                      {l.company}
                    </button>
                  ))}
                  {items.length > 2 && <div className="text-[10px] text-muted-foreground px-1">+{items.length - 2}</div>}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function LeadDialog({ lead, onClose, onAI }: { lead: Lead | null; onClose: () => void; onAI: (l: Lead) => void }) {
  return (
    <Dialog open={!!lead} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        {lead && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{lead.company}</span>
                <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
              </DialogTitle>
              <DialogDescription>{lead.sector} · {lead.city} · {lead.contact}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2 text-sm">
              <div className="space-y-2">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" />{lead.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" />{lead.phone}</div>
                <div>Score IA : <span className="font-semibold">{lead.score}/100</span></div>
                <div>Valeur estimée : <span className="font-semibold">{lead.value.toLocaleString()} MAD</span></div>
                <div>Prochaine action : <span className="font-medium">{lead.nextAction}</span></div>
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted-foreground">Statut</label>
                <Select value={lead.status} onValueChange={(v) => { actions.updateLead(lead.id, { status: v as LeadStatus }); toast.success(`Statut → ${statusMeta(v as LeadStatus).label}`); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {LEAD_STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
                  </SelectContent>
                </Select>
                <label className="text-xs text-muted-foreground mt-2 block">Notes</label>
                <Textarea defaultValue={lead.notes} rows={4} onBlur={(e) => actions.updateLead(lead.id, { notes: e.target.value })} />
              </div>
            </div>
            <div className="rounded-md bg-muted p-3 text-xs">
              <p className="font-medium mb-1">💡 Insight IA</p>
              <p className="text-muted-foreground">Entreprise active à {lead.city}. Potentiel d'achat estimé : {(lead.value / 1000).toFixed(0)}K MAD/an. Recommandation : approche commerciale ciblée gamme premium.</p>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => { onAI(lead); onClose(); }}><Sparkles className="h-4 w-4" />Message IA</Button>
              <Button variant="outline" onClick={() => { actions.updateLead(lead.id, { status: "won" }); toast.success("Lead gagné 🎉"); onClose(); }}><Plus className="h-4 w-4" />Marquer gagné</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
