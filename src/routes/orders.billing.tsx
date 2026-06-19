import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import { INVOICE_STATUSES, type InvoiceStatus, type Order } from "@/lib/mock-data";
import { Receipt, Send, Eye, Download } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/orders/billing")({
  head: () => ({ meta: [{ title: "Facturation – Foodplus" }] }),
  component: BillingPage,
});

const fmt = (n: number) => `${n.toLocaleString("fr-FR")} MAD`;

function BillingPage() {
  const orders = useStore((s) => s.orders);
  const [dragging, setDragging] = useState<string | null>(null);

  const drop = (st: InvoiceStatus) => {
    if (!dragging) return;
    actions.updateOrder(dragging, { invoiceStatus: st });
    toast.success(`Facture → ${INVOICE_STATUSES.find((x) => x.key === st)!.label}`);
    setDragging(null);
  };

  const totals = INVOICE_STATUSES.map((s) => ({
    ...s,
    items: orders.filter((o) => o.invoiceStatus === s.key),
  }));

  const totalUnpaid = orders.filter((o) => o.invoiceStatus === "pending" || o.invoiceStatus === "late").reduce((s, o) => s + (o.amount - o.paid), 0);
  const totalPaid = orders.filter((o) => o.invoiceStatus === "paid").reduce((s, o) => s + o.amount, 0);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold flex items-center gap-2"><Receipt className="h-6 w-6" />Facturation</h1>
        <p className="text-sm text-muted-foreground">{orders.length} factures · Payé {fmt(totalPaid)} · Impayé {fmt(totalUnpaid)}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-5">
        {totals.map((col) => {
          const sum = col.items.reduce((s, o) => s + o.amount, 0);
          return (
            <div key={col.key} onDragOver={(e) => e.preventDefault()} onDrop={() => drop(col.key)}
              className="rounded-lg border bg-muted/30 p-2 min-h-[400px]">
              <div className="flex items-center justify-between px-1 pb-2">
                <StatusBadge tone={col.tone}>{col.label}</StatusBadge>
                <span className="text-[10px] text-muted-foreground">{col.items.length} · {(sum / 1000).toFixed(0)}K</span>
              </div>
              <div className="space-y-2">
                {col.items.map((o) => <InvoiceCard key={o.id} order={o} onDragStart={() => setDragging(o.id)} onDragEnd={() => setDragging(null)} />)}
                {col.items.length === 0 && <p className="text-center text-[11px] text-muted-foreground py-3">—</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InvoiceCard({ order, onDragStart, onDragEnd }: { order: Order; onDragStart: () => void; onDragEnd: () => void }) {
  const overdue = order.invoiceStatus === "late";
  return (
    <div draggable onDragStart={onDragStart} onDragEnd={onDragEnd}
      className="cursor-grab rounded-md border bg-card p-3 text-sm shadow-sm hover:shadow-md active:cursor-grabbing space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] text-muted-foreground">{order.id}</span>
        <span className={"text-[10px] " + (overdue ? "text-destructive font-medium" : "text-muted-foreground")}>Éch. {order.dueDate}</span>
      </div>
      <p className="font-medium truncate">{order.client}</p>
      <p className="text-base font-semibold">{fmt(order.amount)}</p>
      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Payé {fmt(order.paid)}</span>
        <span>Reste {fmt(order.amount - order.paid)}</span>
      </div>
      <div className="flex gap-1 pt-1">
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toast.info("Facture ouverte")}><Eye className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toast.success("Téléchargée")}><Download className="h-3 w-3" /></Button>
        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => toast.success("Relance envoyée")}><Send className="h-3 w-3" /></Button>
      </div>
    </div>
  );
}
