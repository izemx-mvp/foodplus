import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { StatusBadge } from "@/components/StatusBadge";
import { BrandLogo } from "@/components/BrandLogo";
import { useStore, actions } from "@/lib/store";
import type { Email } from "@/lib/mock-data";
import { Sparkles, Reply, ListTodo, Mail as MailIcon } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/emails")({
  head: () => ({ meta: [{ title: "Emails – Foodplus" }] }),
  component: EmailsPage,
});

function EmailsPage() {
  const emails = useStore((s) => s.emails);
  const [selected, setSelected] = useState<Email | null>(null);
  const [ai, setAI] = useState<{ summary: string; reply: string } | null>(null);

  const open = (e: Email) => {
    setSelected(e);
    if (e.unread) actions.markEmailRead(e.id);
  };

  const runAI = (e: Email) => {
    setAI({
      summary: `📝 Résumé : ${e.from} (${e.subject}). Demande à traiter sous 24h. Sentiment : ${e.priority === "high" ? "urgent" : "neutre"}. Action recommandée : ${e.subject.toLowerCase().includes("retard") ? "contacter logistique" : e.subject.toLowerCase().includes("devis") ? "envoyer devis ADV" : "réponse standard"}.`,
      reply: `Bonjour ${e.from.split(" ")[0]},\n\nMerci pour votre message. Nous avons bien pris en compte votre demande concernant "${e.subject}" et reviendrons vers vous dans les meilleurs délais.\n\nN'hésitez pas à me contacter si besoin.\n\nCordialement,\nÉquipe Foodplus`,
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><BrandLogo brand="gmail" className="h-6 w-6" /> Inbox Foodplus</h1>
          <p className="text-sm text-muted-foreground">{emails.filter(e => e.unread).length} non-lus · synchronisé via Gmail</p>
        </div>
        <Button variant="outline" onClick={() => toast.success("Inbox synchronisée")}><MailIcon className="h-4 w-4" /> Synchroniser</Button>
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
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      <Dialog open={!!selected} onOpenChange={(o) => { if (!o) { setSelected(null); setAI(null); } }}>
        <DialogContent className="max-w-2xl">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.subject}</DialogTitle>
                <p className="text-xs text-muted-foreground">{selected.from} &lt;{selected.email}&gt; · {selected.date}</p>
              </DialogHeader>
              <div className="rounded-md border bg-muted/30 p-4 text-sm whitespace-pre-wrap">{selected.preview}</div>

              {ai && (
                <div className="space-y-3">
                  <div className="rounded-md border-l-4 border-linkedin bg-linkedin/5 p-3 text-xs">
                    <p className="font-medium text-linkedin">🧠 Analyse IA</p>
                    <p className="mt-1 text-muted-foreground">{ai.summary}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-1">Réponse suggérée :</p>
                    <Textarea value={ai.reply} onChange={(e) => setAI({ ...ai, reply: e.target.value })} rows={8} />
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                {!ai && <Button onClick={() => runAI(selected)}><Sparkles className="h-4 w-4" /> Résumé + réponse IA</Button>}
                {ai && <Button onClick={() => { toast.success("Réponse envoyée via Gmail"); setSelected(null); setAI(null); }}><Reply className="h-4 w-4" /> Envoyer</Button>}
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
