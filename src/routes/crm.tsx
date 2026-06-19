import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useStore, actions } from "@/lib/store";
import type { CRMStage, Deal } from "@/lib/mock-data";
import { toast } from "sonner";
import { ChevronRight, ChevronLeft } from "lucide-react";

export const Route = createFileRoute("/crm")({
  head: () => ({ meta: [{ title: "CRM Pipeline – Foodplus" }] }),
  component: CRMPage,
});

const STAGES: { key: CRMStage; label: string; tone: string }[] = [
  { key: "lead", label: "Lead", tone: "bg-muted text-muted-foreground" },
  { key: "contacted", label: "Contacté", tone: "bg-info/10 text-info" },
  { key: "proposal", label: "Proposition", tone: "bg-info/20 text-info" },
  { key: "negotiation", label: "Négociation", tone: "bg-warning/30 text-warning-foreground" },
  { key: "won", label: "🟢 Gagné", tone: "bg-success/15 text-success" },
  { key: "lost", label: "🔴 Perdu", tone: "bg-destructive/15 text-destructive" },
];

function CRMPage() {
  const deals = useStore((s) => s.deals);
  const [dragged, setDragged] = useState<string | null>(null);

  const move = (deal: Deal, dir: 1 | -1) => {
    const idx = STAGES.findIndex((s) => s.key === deal.stage);
    const next = STAGES[Math.min(STAGES.length - 1, Math.max(0, idx + dir))];
    if (next.key !== deal.stage) {
      actions.moveDeal(deal.id, next.key);
      toast.success(`${deal.company} → ${next.label}`);
    }
  };

  const dropOn = (stage: CRMStage) => {
    if (dragged) {
      actions.moveDeal(dragged, stage);
      const d = deals.find((x) => x.id === dragged);
      toast.success(`${d?.company} déplacé vers ${STAGES.find(s => s.key === stage)?.label}`);
      setDragged(null);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">CRM Pipeline</h1>
        <p className="text-sm text-muted-foreground">Glissez les opportunités entre colonnes · Total pipeline : {(deals.reduce((s,d)=>s+d.value,0)/1000).toFixed(0)}K MAD</p>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        {STAGES.map((stage) => {
          const items = deals.filter((d) => d.stage === stage.key);
          return (
            <div key={stage.key}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => dropOn(stage.key)}
              className="flex flex-col rounded-lg border bg-muted/30 p-2 min-h-[400px]"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <span className={`text-xs font-medium px-2 py-0.5 rounded ${stage.tone}`}>{stage.label}</span>
                <span className="text-xs text-muted-foreground">{items.length}</span>
              </div>
              <div className="space-y-2 flex-1">
                {items.map((d) => (
                  <Card key={d.id}
                    draggable
                    onDragStart={() => setDragged(d.id)}
                    onDragEnd={() => setDragged(null)}
                    className="p-3 cursor-grab active:cursor-grabbing hover:border-primary transition"
                  >
                    <div className="text-sm font-medium leading-tight">{d.company}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{d.contact}</div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-semibold text-success">{(d.value/1000).toFixed(0)}K MAD</span>
                      <span className="text-[10px] text-muted-foreground">{d.probability}%</span>
                    </div>
                    <div className="mt-2 flex gap-1 opacity-0 group-hover:opacity-100">
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => move(d, -1)}><ChevronLeft className="h-3 w-3" /></Button>
                      <Button size="sm" variant="ghost" className="h-6 w-6 p-0 ml-auto" onClick={() => move(d, 1)}><ChevronRight className="h-3 w-3" /></Button>
                    </div>
                  </Card>
                ))}
                {items.length === 0 && <div className="text-center text-xs text-muted-foreground py-8">Déposer ici</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
