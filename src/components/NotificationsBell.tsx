import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function NotificationsBell() {
  const orders = useStore((s) => s.orders);
  const today = "2026-06-19";
  const advBlocked = orders.filter((o) => o.stage === "adv");
  const lateInvoices = orders.filter((o) => o.invoiceStatus === "late");
  const lateDeliveries = orders.filter((o) => o.status === "delayed");
  const closedToday = orders.filter((o) => o.currentStep === "cloture" && o.date === today);
  const total = advBlocked.length + lateInvoices.length + lateDeliveries.length;

  const groups = [
    { tone: "destructive", label: `${advBlocked.length} commandes bloquées en ADV`, items: advBlocked.slice(0, 3) },
    { tone: "warning", label: `${lateInvoices.length} factures en retard`, items: lateInvoices.slice(0, 3) },
    { tone: "destructive", label: `${lateDeliveries.length} livraisons en retard`, items: lateDeliveries.slice(0, 3) },
    { tone: "success", label: `${closedToday.length} commandes clôturées aujourd'hui`, items: closedToday.slice(0, 3) },
  ] as const;

  const TONE_CLS: Record<string, string> = {
    destructive: "border-destructive/40 bg-destructive/5 text-destructive",
    warning: "border-warning/40 bg-warning/10 text-warning-foreground",
    success: "border-success/40 bg-success/10 text-success",
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          {total > 0 && <span className="absolute right-1 top-1 min-w-[14px] h-[14px] px-1 rounded-full bg-destructive text-[9px] text-destructive-foreground font-bold grid place-items-center">{total}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="px-3 py-2 border-b">
          <p className="text-sm font-semibold">Centre de notifications</p>
          <p className="text-[11px] text-muted-foreground">Synthèse opérationnelle temps réel</p>
        </div>
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-2">
          {groups.map((g, i) => (
            <div key={i} className={"rounded-md border px-2.5 py-2 text-xs " + TONE_CLS[g.tone]}>
              <p className="font-medium">{g.label}</p>
              {g.items.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-[11px] opacity-90">
                  {g.items.map((o) => <li key={o.id}>· {o.id} — {o.client}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
        <div className="border-t p-2">
          <Link to="/orders" className="block text-center text-xs font-medium text-primary hover:underline py-1">Ouvrir les commandes</Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}
