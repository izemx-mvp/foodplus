import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { BrandLogo } from "@/components/BrandLogo";
import { useStore, actions } from "@/lib/store";
import type { IntegrationKey } from "@/lib/mock-data";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/integrations")({
  head: () => ({ meta: [{ title: "Intégrations – Foodplus" }] }),
  component: IntegrationsPage,
});

const ITEMS: { key: IntegrationKey; name: string; desc: string; category: string }[] = [
  { key: "gmail", name: "Gmail", desc: "Synchronisez votre inbox commerciale", category: "Communication" },
  { key: "sheets", name: "Google Sheets", desc: "Export leads, commandes, reporting", category: "Productivité" },
  { key: "calendar", name: "Google Calendar", desc: "Planifiez RDV et publications", category: "Productivité" },
  { key: "whatsapp", name: "WhatsApp Business", desc: "Messagerie client B2B au Maroc", category: "Communication" },
  { key: "facebook", name: "Facebook Pages", desc: "Publication automatique de posts", category: "Social Media" },
  { key: "instagram", name: "Instagram Business", desc: "Stories, Reels, posts IA", category: "Social Media" },
  { key: "linkedin", name: "LinkedIn", desc: "Prospection B2B & contenu IA", category: "Social Media" },
  { key: "crm", name: "ERP / CRM Foodplus", desc: "Système interne LRUCH", category: "Interne" },
];

function IntegrationsPage() {
  const integrations = useStore((s) => s.integrations);
  const [connecting, setConnecting] = useState<IntegrationKey | null>(null);

  const handleConnect = (key: IntegrationKey, name: string) => {
    setConnecting(key);
    setTimeout(() => {
      actions.toggleIntegration(key);
      setConnecting(null);
      toast.success(`${name} connecté`, { description: "Authentification OAuth validée" });
    }, 1400);
  };

  const handleDisconnect = (key: IntegrationKey, name: string) => {
    actions.toggleIntegration(key);
    toast.info(`${name} déconnecté`);
  };

  const categories = Array.from(new Set(ITEMS.map(i => i.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Intégrations</h1>
        <p className="text-sm text-muted-foreground">Connectez vos outils favoris à Foodplus · {Object.values(integrations).filter(Boolean).length}/{ITEMS.length} actives</p>
      </div>

      {categories.map((cat) => (
        <div key={cat}>
          <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{cat}</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {ITEMS.filter(i => i.category === cat).map((i) => {
              const connected = integrations[i.key];
              const isConnecting = connecting === i.key;
              return (
                <Card key={i.key} className="hover:border-primary/40 transition">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <BrandLogo brand={i.key} className="h-10 w-10 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-medium">{i.name}</h3>
                          {connected ? <StatusBadge tone="success">Connected</StatusBadge> : <StatusBadge tone="muted">Not connected</StatusBadge>}
                        </div>
                        <p className="mt-1 text-xs text-muted-foreground">{i.desc}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      {connected ? (
                        <Button variant="outline" size="sm" className="w-full" onClick={() => handleDisconnect(i.key, i.name)}>Disconnect</Button>
                      ) : (
                        <Button size="sm" className="w-full" onClick={() => handleConnect(i.key, i.name)} disabled={isConnecting}>
                          {isConnecting ? <><Loader2 className="h-3 w-3 animate-spin" /> Connexion…</> : "Connect"}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Dialog open={!!connecting} onOpenChange={() => {}}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {connecting && <BrandLogo brand={connecting} className="h-6 w-6" />}
              Connexion sécurisée
            </DialogTitle>
            <DialogDescription>Authentification OAuth en cours…</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="space-y-1.5">
              <label className="text-xs">Email du compte</label>
              <Input defaultValue="younes.elidrissi@foodplus.ma" readOnly />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs">Permissions demandées</label>
              <div className="rounded-md bg-muted p-3 text-xs space-y-1">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Lecture des données</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Écriture / publication</div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-3 w-3 text-success" /> Webhooks temps réel</div>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span className="text-sm text-muted-foreground">Validation en cours…</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
