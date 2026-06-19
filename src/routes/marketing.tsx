import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/StatusBadge";
import { BrandLogo } from "@/components/BrandLogo";
import { useStore, actions } from "@/lib/store";
import type { SocialPlatform, PostStatus, SocialPost } from "@/lib/mock-data";
import { Sparkles, CalendarDays, Wand2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/marketing")({
  head: () => ({ meta: [{ title: "Marketing IA – Foodplus" }] }),
  component: MarketingPage,
});

const statusTone = (s: PostStatus) => s === "published" ? "success" : s === "scheduled" ? "info" : s === "failed" ? "destructive" : "warning";
const statusLabel = (s: PostStatus) => ({ published: "Publié", scheduled: "Programmé", failed: "Échec", draft: "Brouillon" }[s]);
const platformBrand = (p: SocialPlatform) => p;
const platformTone = (p: SocialPlatform) => p === "facebook" ? "info" : p === "instagram" ? "instagram" : "linkedin";

function MarketingPage() {
  const posts = useStore((s) => s.posts);
  const [genOpen, setGenOpen] = useState(false);
  const [platform, setPlatform] = useState<SocialPlatform>("instagram");
  const [prompt, setPrompt] = useState("Promo huile d'argan bio");
  const [generated, setGenerated] = useState<SocialPost | null>(null);

  const generate = () => {
    const templates: Record<SocialPlatform, string> = {
      instagram: `✨ ${prompt} ✨\n\nDécouvrez l'excellence Foodplus — qualité premium, sourcing local, prix exclusifs pour les pros 🌿\n📍 Livraison dans tout le Maroc`,
      facebook: `${prompt}\n\nFoodplus accompagne les professionnels marocains depuis plus de 20 ans. Profitez de notre expertise et de notre catalogue de 1500+ références.\n\n👉 Demandez votre devis personnalisé.`,
      linkedin: `${prompt} — par Foodplus (Groupe LRUCH).\n\nNotre engagement : qualité, traçabilité, et accompagnement sur-mesure des acteurs B2B de l'agroalimentaire au Maroc.\n\n#B2B #FoodIndustry #Maroc`,
    };
    const hashtags = platform === "instagram" ? ["#FoodplusMaroc", "#MadeInMorocco", "#BioMA", "#Premium"]
      : platform === "facebook" ? ["#Foodplus", "#Pro", "#Maroc"]
      : ["#FoodIndustry", "#B2B", "#LRUCH", "#Maroc"];
    setGenerated({
      id: `P-${Date.now()}`, platform, title: prompt, content: templates[platform],
      hashtags, date: new Date().toISOString().slice(0,10), status: "draft",
    });
  };

  const autoFill = () => {
    const ideas = ["Recette signature du chef", "Témoignage client", "Nouveauté catalogue", "Coulisses entrepôt", "Conseil pro de la semaine"];
    const plats: SocialPlatform[] = ["instagram", "facebook", "linkedin"];
    for (let i = 0; i < 5; i++) {
      actions.addPost({
        id: `P-${Date.now()}-${i}`,
        platform: plats[i % 3],
        title: ideas[i],
        content: `Contenu IA — ${ideas[i]}`,
        hashtags: ["#Foodplus", "#IA"],
        date: new Date(Date.now() + (i + 1) * 86400000).toISOString().slice(0,10),
        status: "scheduled",
      });
    }
    toast.success("Semaine auto-remplie", { description: "5 posts IA programmés sur 7 jours" });
  };

  // simple 7-day grid
  const today = new Date();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today); d.setDate(today.getDate() + i - 1);
    return d.toISOString().slice(0,10);
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Marketing IA & Community Management</h1>
          <p className="text-sm text-muted-foreground">Calendrier éditorial multi-réseaux · IA Foodplus v2</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={autoFill}><Wand2 className="h-4 w-4" /> Auto-remplir semaine</Button>
          <Button variant="outline" onClick={() => toast.success("Campagne simulée envoyée", { description: "Reach estimé : 12.4K · Engagement : 8.2%" })}>Simuler campagne</Button>
          <Button onClick={() => { setGenerated(null); setGenOpen(true); }}><Sparkles className="h-4 w-4" /> Générer post IA</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base"><CalendarDays className="h-4 w-4 text-primary" /> Calendrier éditorial — 7 jours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 min-w-[700px]">
            {days.map((day) => {
              const dayPosts = posts.filter((p) => p.date === day);
              const d = new Date(day);
              const isToday = day === today.toISOString().slice(0,10);
              return (
                <div key={day} className={`rounded-lg border bg-card p-2 min-h-[180px] ${isToday ? "border-primary" : ""}`}>
                  <div className="mb-2 text-xs">
                    <div className="font-medium">{d.toLocaleDateString("fr-FR", { weekday: "short" })}</div>
                    <div className="text-muted-foreground">{d.getDate()}/{d.getMonth() + 1}</div>
                  </div>
                  <div className="space-y-1.5">
                    {dayPosts.map((p) => (
                      <div key={p.id} className="rounded border bg-background p-1.5 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <BrandLogo brand={platformBrand(p.platform)} className="h-3 w-3" />
                          <StatusBadge tone={statusTone(p.status)} className="text-[9px] px-1 py-0">{statusLabel(p.status)}</StatusBadge>
                        </div>
                        <div className="mt-1 truncate font-medium">{p.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.slice(0, 9).map((p) => (
          <Card key={p.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BrandLogo brand={platformBrand(p.platform)} className="h-5 w-5" />
                  <StatusBadge tone={platformTone(p.platform)}>{p.platform}</StatusBadge>
                </div>
                <StatusBadge tone={statusTone(p.status)}>{statusLabel(p.status)}</StatusBadge>
              </div>
              <div>
                <div className="font-medium text-sm">{p.title}</div>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-3">{p.content}</p>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.hashtags.map((h) => <span key={h} className="text-[10px] text-primary">{h}</span>)}
              </div>
              <div className="flex gap-2 pt-1 border-t">
                {p.status !== "published" && (
                  <Button size="sm" variant="outline" onClick={() => { actions.updatePost(p.id, { status: "scheduled" }); toast.success("Post programmé"); }}>Programmer</Button>
                )}
                <Button size="sm" onClick={() => { actions.updatePost(p.id, { status: "published" }); toast.success("Post publié", { description: `Sur ${p.platform}` }); }}>Publier</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={genOpen} onOpenChange={setGenOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-linkedin" /> Générer un post avec l'IA</DialogTitle>
          </DialogHeader>
          {!generated ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Plateforme</label>
                <div className="mt-1 flex gap-2">
                  {(["instagram","facebook","linkedin"] as SocialPlatform[]).map((p) => (
                    <button key={p} onClick={() => setPlatform(p)} className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${platform === p ? "border-primary bg-primary/5" : ""}`}>
                      <BrandLogo brand={p} className="h-4 w-4" /> {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Sujet / brief</label>
                <Input value={prompt} onChange={(e) => setPrompt(e.target.value)} />
              </div>
              <Button onClick={generate}><Sparkles className="h-4 w-4" /> Générer</Button>
            </div>
          ) : (
            <div className="space-y-3">
              <Textarea value={generated.content} onChange={(e) => setGenerated({ ...generated, content: e.target.value })} rows={8} />
              <div className="flex flex-wrap gap-1">
                {generated.hashtags.map((h) => <span key={h} className="text-xs text-primary">{h}</span>)}
              </div>
              <div className="rounded-md bg-muted p-3 text-xs">
                <p className="font-medium">🎨 Description visuelle IA</p>
                <p className="text-muted-foreground mt-1">Photo en lumière naturelle, produit en gros plan sur fond minéral marocain (zellige beige), tons chauds, ambiance premium artisanale.</p>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => { actions.addPost(generated); toast.success("Post ajouté au calendrier"); setGenOpen(false); }}>Ajouter au calendrier</Button>
                <Button variant="outline" onClick={() => { actions.addPost({ ...generated, status: "published" }); toast.success("Publié immédiatement"); setGenOpen(false); }}>Publier maintenant</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
