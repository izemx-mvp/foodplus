import { cn } from "@/lib/utils";

type Tone = "success" | "warning" | "destructive" | "info" | "instagram" | "linkedin" | "muted";

const toneClasses: Record<Tone, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/20 text-warning-foreground border-warning/40",
  destructive: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-info/15 text-info border-info/30",
  instagram: "bg-instagram/15 text-instagram border-instagram/30",
  linkedin: "bg-linkedin/15 text-linkedin border-linkedin/30",
  muted: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ tone, children, className }: { tone: Tone; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium", toneClasses[tone], className)}>
      <span className={cn("h-1.5 w-1.5 rounded-full", {
        "bg-success": tone === "success",
        "bg-warning-foreground": tone === "warning",
        "bg-destructive": tone === "destructive",
        "bg-info": tone === "info",
        "bg-instagram": tone === "instagram",
        "bg-linkedin": tone === "linkedin",
        "bg-muted-foreground": tone === "muted",
      })} />
      {children}
    </span>
  );
}
