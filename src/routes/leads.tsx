import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import type { Lead } from "@/lib/mock-data";
import { Sparkles, MessageSquare, CheckCircle2, Phone, Mail, Plus } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/leads")({
  head: () => ({ meta: [{ title: "Leads – Foodplus" }] }),
  component: LeadsPage,
});

const statusTone = (s: Lead["status"]) =>
  s === "hot" ? "warning" : s === "qualified" ? "success" : s === "contacted" ? "info" : s === "lost" ? "destructive" : "muted";
const statusLabel = (s: Lead["status"]) =>
  ({ hot: "Lead chaud", qualified: "Qualifié", contacted: "Contacté", new: "Nouveau", lost: "Perdu" }[s]);

function LeadsPage() {
  const leads = useStore((s) => s.leads);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<Lead | null>(null);
  const [aiMessage, setAiMessage] = useState<{ lead: Lead; msg: string } | null>(null);

  const filtered = leads.filter((l) =>
    [l.company, l.contact, l.city, l.sector].join(" ").toLowerCase().includes(filter.toLowerCase())
  );

  const generateAIMessage = (lead: Lead) => {
    const msg = `Bonjour ${lead.contact.split(" ")[0]},\n\nJe me permets de vous contacter au nom de Foodplus, distributeur agroalimentaire de référence au Maroc (groupe LRUCH).\n\nNous travaillons déjà avec plusieurs acteurs du secteur ${lead.sector.toLowerCase()} à ${lead.city}, et nous pourrions vous proposer des conditions avantageuses sur notre gamme premium (huiles, épices, conserves, produits frais).\n\nSeriez-vous disponible pour un échange de 15 minutes cette semaine ?\n\nCordialement,\nYounes El Idrissi – Foodplus`;
    setAiMessage({ lead, msg });
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Leads & Prospection IA</h1>
          <p className="text-sm text-muted-foreground">{leads.length} prospects · {leads.filter(l => l.status === "hot").length} chauds</p>
        </div>
        <div className="flex gap-2">
          <Input placeholder="Filtrer entreprises, villes…" value={filter} onChange={(e) => setFilter(e.target.value)} className="w-64" />
          <Button onClick={() => toast.success("Scan IA lancé", { description: "Recherche sur LinkedIn, CGEM, annuaires…" })}>
            <Sparkles className="h-4 w-4" /> Scanner le marché
          </Button>
        </div>
      </div>

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
                  <th className="px-4 py-3 text-left">Score</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((l) => (
                  <tr key={l.id} className="border-t hover:bg-muted/30 cursor-pointer" onClick={() => setSelected(l)}>
                    <td className="px-4 py-3 font-medium">{l.company}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.contact}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.sector}</td>
                    <td className="px-4 py-3 text-muted-foreground">{l.city}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
                          <div className={`h-full ${l.score > 80 ? "bg-success" : l.score > 60 ? "bg-warning" : "bg-destructive"}`} style={{ width: `${l.score}%` }} />
                        </div>
                        <span className="text-xs font-medium">{l.score}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge tone={statusTone(l.status)}>{statusLabel(l.status)}</StatusBadge></td>
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-1">
                        <Button size="sm" variant="ghost" onClick={() => generateAIMessage(l)} title="Générer message IA">
                          <Sparkles className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { actions.updateLead(l.id, { status: "qualified" }); toast.success(`${l.company} qualifié`); }} title="Qualifier">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => { actions.updateLead(l.id, { status: "contacted" }); toast.success(`Contact IA envoyé à ${l.company}`); }} title="Contacter">
                          <MessageSquare className="h-3.5 w-3.5" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`${l.company} ajouté au CRM`)} title="Ajouter au CRM">
                          <Plus className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.company}</DialogTitle>
                <DialogDescription>{selected.sector} · {selected.city}</DialogDescription>
              </DialogHeader>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {selected.email}</div>
                <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {selected.phone}</div>
                <div className="flex items-center gap-2">Score IA : <span className="font-semibold">{selected.score}/100</span></div>
                <div className="flex items-center gap-2">Statut : <StatusBadge tone={statusTone(selected.status)}>{statusLabel(selected.status)}</StatusBadge></div>
                <div className="rounded-md bg-muted p-3 text-xs">
                  <p className="font-medium mb-1">💡 Insight IA</p>
                  <p className="text-muted-foreground">Entreprise en forte croissance ({selected.city}). Potentiel d'achat estimé : 80-120K MAD/an. Recommandation : approche commerciale ciblée gamme premium.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { generateAIMessage(selected); setSelected(null); }}><Sparkles className="h-4 w-4" />Message IA</Button>
                <Button variant="outline" onClick={() => { actions.updateLead(selected.id, { status: "qualified" }); toast.success("Qualifié"); setSelected(null); }}>Qualifier</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={!!aiMessage} onOpenChange={(o) => !o && setAiMessage(null)}>
        <DialogContent>
          {aiMessage && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-linkedin" /> Message IA personnalisé</DialogTitle>
                <DialogDescription>Généré pour {aiMessage.lead.company} – {aiMessage.lead.contact}</DialogDescription>
              </DialogHeader>
              <Textarea value={aiMessage.msg} onChange={(e) => setAiMessage({ ...aiMessage, msg: e.target.value })} rows={12} />
              <div className="flex gap-2">
                <Button onClick={() => { actions.updateLead(aiMessage.lead.id, { status: "contacted" }); toast.success("Email envoyé via Gmail", { description: aiMessage.lead.email }); setAiMessage(null); }}>
                  <Mail className="h-4 w-4" /> Envoyer
                </Button>
                <Button variant="outline" onClick={() => { navigator.clipboard?.writeText(aiMessage.msg); toast.success("Copié"); }}>Copier</Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
