import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import type { Email } from "@/lib/mock-data";
import { Sparkles, Reply, ListTodo, Mail as MailIcon, Bell } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/emails")({
  head: () => ({ meta: [{ title: "Emails – Foodplus" }] }),
  component: EmailsPage,
});

function autoSummary(e: Email): string {
  const s = e.subject.toLowerCase();
  const action = s.includes("retard") || s.includes("livraison")
    ? "Contacter logistique sous 24h"
    : s.includes("devis") || s.includes("commande")
    ? "Transmettre à l'ADV pour devis"
    : s.includes("facture") || s.includes("paiement")
    ? "Relancer comptabilité"
    : s.includes("rdv") || s.includes("rendez")
    ? "Confirmer le créneau"
    : "Réponse standard sous 48h";
  const sentiment = e.priority === "high" ? "Urgent" : "Neutre";
  return `${e.from.split(" ")[0]} — ${sentiment}. ${action}.`;
}

function suggestedReply(e: Email): string {
  return `Bonjour ${e.from.split(" ")[0]},\n\nMerci pour votre message. Nous avons bien pris en compte votre demande concernant "${e.subject}" et reviendrons vers vous dans les meilleurs délais.\n\nCordialement,\nÉquipe Foodplus`;
}

function EmailsPage() {
  const emails = useStore((s) => s.emails);
  const [selected, setSelected] = useState<Email | null>(null);
  const [reply, setReply] = useState("");

  const summaries = useMemo(() => {
    const m: Record<string, string> = {};
    emails.forEach((e) => { m[e.id] = autoSummary(e); });
    return m;
  }, [emails]);

  const relances = emails.filter((e) => e.unread).length;

  const open = (e: Email) => {
    setSelected(e);
    setReply(suggestedReply(e));
    if (e.unread) actions.markEmailRead(e.id);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><MailIcon className="h-6 w-6 text-primary" /> Inbox Foodplus</h1>
          <p className="text-sm text-muted-foreground">{emails.filter(e => e.unread).length} non-lus · résumés IA automatiques · synchronisé via Gmail</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.success(`${relances} relances programmées`)}><Bell className="h-4 w-4" /> Relances auto</Button>
          <Button variant="outline" onClick={() => toast.success("Inbox synchronisée")}><MailIcon className="h-4 w-4" /> Synchroniser</Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 divide-y">
          {emails.map((e) => (
            <button key={e.id} onClick={() => open(e)} className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-muted/40 ${e.unread ? "bg-info/5" : ""}`}>
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary shrink-0">
                {e.from.split(" ").map(w => w[0]).slice(0,2).join("")}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-sm ${e.unread ? "font-semibold" : ""}`}>{e.from}</span>
                  {e.priority === "high" && <StatusBadge tone="destructive">Urgent</StatusBadge>}
                  {e.unread && <span className="h-2 w-2 rounded-full bg-info" />}
                  <span className="ml-auto text-xs text-muted-foreground">{e.date}</span>
                </div>
                <div className={`text-sm mt-0.5 ${e.unread ? "font-medium" : "text-muted-foreground"}`}>{e.subject}</div>
                <div className="text-xs text-muted-foreground truncate">{e.preview}</div>
                <div className="mt-1.5 flex items-start gap-1.5 rounded border-l-2 border-primary/60 bg-primary/5 px-2 py-1">
                  <Sparkles className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                  <p className="text-[11px] text-foreground/80"><span className="font-medium text-primary">Résumé IA :</span> {summaries[e.id]}</p>
                </div>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <p className="text-xs text-muted-foreground">{selected.from} &lt;{selected.email}&gt; · {selected.date}</p>
              </DialogHeader>

              <div className="rounded-md border-l-4 border-primary bg-primary/5 p-3">
                <p className="text-xs font-medium text-primary flex items-center gap-1"><Sparkles className="h-3 w-3" /> Résumé IA automatique</p>
                <p className="mt-1 text-sm text-foreground/80">{summaries[selected.id]}</p>
              </div>

              <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{selected.preview}</div>

              <div>
                <p className="text-xs font-medium mb-1 flex items-center gap-1"><Reply className="h-3 w-3" /> Réponse suggérée (modifiable)</p>
                <Textarea value={reply} onChange={(e) => setReply(e.target.value)} rows={7} />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => { toast.success("Réponse envoyée via Gmail"); setSelected(null); }}><Reply className="h-4 w-4" /> Envoyer la réponse</Button>
                <Button variant="outline" onClick={() => toast.success("Relance programmée dans 3 jours")}><Bell className="h-4 w-4" /> Programmer relance</Button>
                <Button variant="outline" onClick={() => toast.success("Tâche créée", { description: `Suivi : ${selected.subject}` })}>
                  <ListTodo className="h-4 w-4" /> Créer tâche
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
