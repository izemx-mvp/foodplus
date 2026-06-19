import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/components/StatusBadge";
import { useStore, actions } from "@/lib/store";
import type { SocialPlatform, PostTone, PostIdea, SocialPost } from "@/lib/mock-data";
import { Sparkles, Plus, Calendar, Send, Trash2, Image as ImageIcon, X, Instagram, Facebook, Linkedin } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/marketing")({
  head: () => ({ meta: [{ title: "Marketing IA – Foodplus" }] }),
  component: MarketingPage,
});

const PLATFORMS: { key: SocialPlatform; label: string; color: string }[] = [
  { key: "instagram", label: "Instagram", color: "bg-pink-500" },
  { key: "facebook", label: "Facebook", color: "bg-blue-600" },
  { key: "linkedin", label: "LinkedIn", color: "bg-sky-700" },
  { key: "tiktok", label: "TikTok", color: "bg-black" },
  { key: "x", label: "X", color: "bg-neutral-800" },
];
const TONES: PostTone[] = ["Professionnel", "Convivial", "Premium", "Inspirant", "Humoristique"];

function platformIcon(p: SocialPlatform) {
  if (p === "instagram") return <Instagram className="h-3 w-3" />;
  if (p === "facebook") return <Facebook className="h-3 w-3" />;
  if (p === "linkedin") return <Linkedin className="h-3 w-3" />;
  return <span className="text-[10px] font-bold uppercase">{p[0]}</span>;
}

function MarketingPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold">Marketing IA</h1>
        <p className="text-sm text-muted-foreground">Configuration, idées de posts générés par IA, et planification multi-réseaux.</p>
      </div>

      <Tabs defaultValue="config">
        <TabsList>
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="ideas">Idées</TabsTrigger>
          <TabsTrigger value="calendar">Calendrier</TabsTrigger>
        </TabsList>
        <TabsContent value="config" className="mt-4"><ConfigTab /></TabsContent>
        <TabsContent value="ideas" className="mt-4"><IdeasTab /></TabsContent>
        <TabsContent value="calendar" className="mt-4"><CalendarTab /></TabsContent>
      </Tabs>
    </div>
  );
}

function ConfigTab() {
  const config = useStore((s) => s.marketing);
  const [website, setWebsite] = useState(config.website);
  const [logo, setLogo] = useState(config.logo);
  const [description, setDescription] = useState(config.description);
  const [tone, setTone] = useState<PostTone>(config.tone);
  const [frequency, setFrequency] = useState(config.frequency);

  const save = () => {
    actions.updateMarketingConfig({ website, logo, description, tone, frequency });
    toast.success("Configuration enregistrée");
  };

  return (
    <Card>
      <CardHeader><CardTitle className="text-base">Paramètres de marque</CardTitle></CardHeader>
      <CardContent className="space-y-4 max-w-2xl">
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Site web</label>
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://foodplus.ma" />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Logo (URL)</label>
          <Input value={logo} onChange={(e) => setLogo(e.target.value)} placeholder="https://…/logo.png" />
          {logo && <img src={logo} alt="logo" className="h-12 mt-2 rounded border" onError={(e) => (e.currentTarget.style.display = "none")} />}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-medium">Description de Foodplus</label>
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={5} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Tonalité par défaut</label>
            <Select value={tone} onValueChange={(v) => setTone(v as PostTone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Fréquence auto-génération</label>
            <Select value={frequency} onValueChange={(v) => setFrequency(v as typeof frequency)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="3xweek">3× par semaine</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
                <SelectItem value="monthly">Mensuel</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button onClick={save}>Enregistrer</Button>
      </CardContent>
    </Card>
  );
}

const ideaTemplates: Omit<PostIdea, "id">[] = [
  { title: "Top 3 produits du mois", hook: "Découvrez nos best-sellers de juin chez les chefs marocains.", suggestedPlatforms: ["instagram", "facebook"], tone: "Convivial" },
  { title: "Interview client - Hôtel Hyatt", hook: "Comment Foodplus accompagne les palaces marocains.", suggestedPlatforms: ["linkedin"], tone: "Professionnel" },
  { title: "Recette express - Tagliatelles aux épices", hook: "Une recette en 15 min avec nos épices premium.", suggestedPlatforms: ["instagram", "tiktok"], tone: "Inspirant" },
  { title: "Visite d'usine - sourcing local", hook: "Voyage dans nos partenariats producteurs locaux.", suggestedPlatforms: ["instagram", "linkedin"], tone: "Premium" },
  { title: "Astuce du chef - conserver les épices", hook: "3 erreurs à éviter pour garder vos épices fraîches.", suggestedPlatforms: ["facebook", "instagram"], tone: "Convivial" },
];

function IdeasTab() {
  const ideas = useStore((s) => s.ideas);
  const [planning, setPlanning] = useState<PostIdea | null>(null);

  const generate = () => {
    const picks = [...ideaTemplates].sort(() => Math.random() - 0.5).slice(0, 3).map((t, i) => ({
      ...t,
      id: `I-${Date.now()}-${i}`,
    }));
    actions.addIdeas(picks);
    toast.success("3 nouvelles idées générées par IA");
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm text-muted-foreground">{ideas.length} idées prêtes à être planifiées</p>
        <Button onClick={generate}><Sparkles className="h-4 w-4" />Générer plus d'idées</Button>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {ideas.map((i) => (
          <Card key={i.id}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-medium">{i.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{i.hook}</p>
                </div>
                <Button size="icon" variant="ghost" onClick={() => { actions.removeIdea(i.id); toast.success("Idée supprimée"); }}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1">
                <Badge variant="secondary">{i.tone}</Badge>
                {i.suggestedPlatforms.map((p) => (
                  <Badge key={p} variant="outline" className="gap-1">{platformIcon(p)}{p}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => setPlanning(i)}><Calendar className="h-3.5 w-3.5" />Planifier</Button>
                <Button size="sm" onClick={() => {
                  actions.addPost({
                    id: `P-${Date.now()}`,
                    platforms: i.suggestedPlatforms,
                    title: i.title,
                    content: i.hook,
                    hashtags: ["#Foodplus", "#Maroc"],
                    date: new Date().toISOString().slice(0, 10),
                    status: "published",
                    images: ["Visuel généré pour " + i.title],
                    tone: i.tone,
                  });
                  actions.removeIdea(i.id);
                  toast.success("Post publié");
                }}><Send className="h-3.5 w-3.5" />Publier</Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {ideas.length === 0 && <p className="text-sm text-muted-foreground col-span-2 py-10 text-center">Aucune idée. Cliquez sur "Générer plus d'idées".</p>}
      </div>

      <PlanDialog idea={planning} onClose={() => setPlanning(null)} />
    </div>
  );
}

function PlanDialog({ idea, onClose }: { idea: PostIdea | null; onClose: () => void }) {
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(idea?.suggestedPlatforms || []);

  const togglePlat = (p: SocialPlatform) => setPlatforms((cur) => cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]);

  return (
    <Dialog open={!!idea} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {idea && (
          <>
            <DialogHeader>
              <DialogTitle>Planifier · {idea.title}</DialogTitle>
              <DialogDescription>{idea.hook}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Date de publication</label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium">Plateformes</label>
                <div className="flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button key={p.key} onClick={() => togglePlat(p.key)}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${platforms.includes(p.key) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}>
                      {platformIcon(p.key)}{p.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={() => {
                if (!platforms.length) return toast.error("Sélectionnez au moins une plateforme");
                actions.addPost({
                  id: `P-${Date.now()}`,
                  platforms,
                  title: idea.title,
                  content: idea.hook,
                  hashtags: ["#Foodplus"],
                  date,
                  status: "scheduled",
                  images: ["Visuel pour " + idea.title],
                  tone: idea.tone,
                });
                actions.removeIdea(idea.id);
                toast.success("Post planifié");
                onClose();
              }}><Calendar className="h-4 w-4" />Planifier</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function CalendarTab() {
  const posts = useStore((s) => s.posts);
  const [calView, setCalView] = useState<"grid" | "agenda">("grid");
  const [creating, setCreating] = useState(false);
  const [selected, setSelected] = useState<SocialPost | null>(null);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <Tabs value={calView} onValueChange={(v) => setCalView(v as "grid" | "agenda")}>
          <TabsList>
            <TabsTrigger value="grid">Grille</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={() => setCreating(true)}><Plus className="h-4 w-4" />Générer un post</Button>
      </div>

      {calView === "grid" ? <CalendarGrid posts={posts} onSelect={setSelected} /> : <AgendaList posts={posts} onSelect={setSelected} />}

      <CreatePostDialog open={creating} onClose={() => setCreating(false)} />
      <PostDialog post={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

function CalendarGrid({ posts, onSelect }: { posts: SocialPost[]; onSelect: (p: SocialPost) => void }) {
  const today = new Date();
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const year = cursor.getFullYear(), month = cursor.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const byDay = useMemo(() => {
    const m: Record<string, SocialPost[]> = {};
    posts.forEach((p) => { (m[p.date] ||= []).push(p); });
    return m;
  }, [posts]);

  const cells: (number | null)[] = [];
  const offset = (firstDay + 6) % 7;
  for (let i = 0; i < offset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="font-medium capitalize">{cursor.toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}</div>
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
                  {items.slice(0, 2).map((p) => (
                    <button key={p.id} onClick={() => onSelect(p)} className="block w-full truncate rounded bg-primary/10 px-1 text-[10px] text-left text-primary hover:bg-primary/20">
                      {p.title}
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

function AgendaList({ posts, onSelect }: { posts: SocialPost[]; onSelect: (p: SocialPost) => void }) {
  const sorted = [...posts].sort((a, b) => a.date.localeCompare(b.date));
  return (
    <Card>
      <CardContent className="p-0 divide-y">
        {sorted.map((p) => (
          <button key={p.id} onClick={() => onSelect(p)} className="w-full text-left px-4 py-3 hover:bg-muted/40 flex items-center gap-3">
            <div className="text-xs text-muted-foreground w-24">{p.date}</div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{p.title}</p>
              <p className="text-xs text-muted-foreground truncate">{p.content}</p>
            </div>
            <div className="flex gap-1">{p.platforms.map((pl) => <Badge key={pl} variant="outline" className="gap-1">{platformIcon(pl)}</Badge>)}</div>
            <StatusBadge tone={p.status === "published" ? "success" : p.status === "scheduled" ? "info" : p.status === "failed" ? "destructive" : "muted"}>
              {p.status === "published" ? "Publié" : p.status === "scheduled" ? "Planifié" : p.status === "failed" ? "Échec" : "Brouillon"}
            </StatusBadge>
          </button>
        ))}
        {sorted.length === 0 && <p className="px-4 py-10 text-center text-sm text-muted-foreground">Aucun post.</p>}
      </CardContent>
    </Card>
  );
}

function CreatePostDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const cfg = useStore((s) => s.marketing);
  const [imageCount, setImageCount] = useState(1);
  const [images, setImages] = useState<string[]>([""]);
  const [tone, setTone] = useState<PostTone>(cfg.tone);
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(["instagram"]);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  const setCount = (n: number) => {
    const v = Math.max(0, Math.min(10, n));
    setImageCount(v);
    setImages((cur) => {
      const next = [...cur];
      while (next.length < v) next.push("");
      next.length = v;
      return next;
    });
  };

  const togglePlat = (p: SocialPlatform) => setPlatforms((cur) => cur.includes(p) ? cur.filter((x) => x !== p) : [...cur, p]);

  const submit = () => {
    if (!title) return toast.error("Titre requis");
    if (!platforms.length) return toast.error("Sélectionnez au moins une plateforme");
    actions.addPost({
      id: `P-${Date.now()}`,
      platforms,
      title,
      content: description,
      hashtags: ["#Foodplus"],
      date,
      status: "scheduled",
      images: images.filter(Boolean),
      tone,
    });
    toast.success("Post créé et planifié");
    setTitle(""); setDescription(""); setImages([""]); setImageCount(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" />Générer un post</DialogTitle>
          <DialogDescription>Décrivez l'idée du post et les visuels souhaités.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Titre du post</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex : Nouveau partenariat avec…" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Idée / description du post</label>
            <Textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Décrivez l'angle, le message clé…" />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Tonalité</label>
              <Select value={tone} onValueChange={(v) => setTone(v as PostTone)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{TONES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium">Date</label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Nombre d'images</label>
            <Input type="number" min={0} max={10} value={imageCount} onChange={(e) => setCount(Number(e.target.value))} className="w-24" />
          </div>
          {images.map((img, i) => (
            <div key={i} className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1"><ImageIcon className="h-3 w-3" />Description image {i + 1}</label>
              <Input value={img} onChange={(e) => setImages((cur) => cur.map((v, j) => j === i ? e.target.value : v))} placeholder="Ex : Bouteille d'huile sur table en bois" />
            </div>
          ))}
          <div className="space-y-1.5">
            <label className="text-xs font-medium">Publier sur</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <button key={p.key} onClick={() => togglePlat(p.key)}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition ${platforms.includes(p.key) ? "bg-primary text-primary-foreground border-primary" : "bg-card hover:bg-muted"}`}>
                  {platformIcon(p.key)}{p.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <Button onClick={submit}><Calendar className="h-4 w-4" />Créer & planifier</Button>
            <Button variant="outline" onClick={onClose}>Annuler</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function PostDialog({ post, onClose }: { post: SocialPost | null; onClose: () => void }) {
  return (
    <Dialog open={!!post} onOpenChange={(o) => !o && onClose()}>
      <DialogContent>
        {post && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{post.title}</span>
                <Button size="icon" variant="ghost" onClick={onClose}><X className="h-4 w-4" /></Button>
              </DialogTitle>
              <DialogDescription>{post.date} · {post.tone}</DialogDescription>
            </DialogHeader>
            <div className="space-y-3 text-sm">
              <p>{post.content}</p>
              <div className="flex flex-wrap gap-1">
                {post.hashtags.map((h) => <Badge key={h} variant="secondary">{h}</Badge>)}
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Plateformes</p>
                <div className="flex gap-1">{post.platforms.map((p) => <Badge key={p} variant="outline" className="gap-1">{platformIcon(p)}{p}</Badge>)}</div>
              </div>
              {post.images.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Visuels</p>
                  <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground">
                    {post.images.map((img, i) => <li key={i}>{img}</li>)}
                  </ul>
                </div>
              )}
              <div className="flex gap-2">
                {post.status !== "published" && (
                  <Button onClick={() => { actions.updatePost(post.id, { status: "published" }); toast.success("Post publié"); onClose(); }}>
                    <Send className="h-4 w-4" />Publier maintenant
                  </Button>
                )}
                <Button variant="outline" onClick={() => { actions.removePost(post.id); toast.success("Post supprimé"); onClose(); }}>
                  <Trash2 className="h-4 w-4" />Supprimer
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
