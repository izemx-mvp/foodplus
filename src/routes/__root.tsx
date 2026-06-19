import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Toaster } from "@/components/ui/sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Bell, Search, User, LogOut } from "lucide-react";
import { toast } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">Page introuvable.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Retour au dashboard</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Une erreur est survenue</h1>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Réessayer</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Foodplus – Sales Automation OS" },
      { name: "description", content: "Plateforme SaaS d'automatisation commerciale pour Foodplus (Groupe LRUCH)." },
      { property: "og:title", content: "Foodplus – Sales Automation OS" },
      { name: "twitter:title", content: "Foodplus – Sales Automation OS" },
      { property: "og:description", content: "Plateforme SaaS d'automatisation commerciale pour Foodplus (Groupe LRUCH)." },
      { name: "twitter:description", content: "Plateforme SaaS d'automatisation commerciale pour Foodplus (Groupe LRUCH)." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3680115d-c902-494c-bbc2-fb6aa11e1a11/id-preview-56b21f3d--4120afca-86ec-4463-91af-6b56af1107a6.lovable.app-1781882571310.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/3680115d-c902-494c-bbc2-fb6aa11e1a11/id-preview-56b21f3d--4120afca-86ec-4463-91af-6b56af1107a6.lovable.app-1781882571310.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-background">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur">
              <SidebarTrigger />
              <div className="relative hidden md:flex flex-1 max-w-md">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <input placeholder="Rechercher leads, commandes, emails…" className="w-full rounded-md border bg-muted/40 pl-8 pr-3 py-1.5 text-sm outline-none focus:border-primary" />
              </div>
              <div className="flex-1 md:hidden" />
              <div className="ml-auto flex items-center gap-1">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="h-4 w-4" />
                  <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 rounded-full pl-1 pr-2 py-1 hover:bg-muted">
                      <div className="grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary text-[11px] font-semibold">YE</div>
                      <span className="hidden sm:flex flex-col text-left leading-tight">
                        <span className="text-xs font-medium">Younes El Idrissi</span>
                        <span className="text-[10px] text-muted-foreground">Sales Manager</span>
                      </span>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => toast.info("Profil bientôt disponible")}>
                      <User className="h-4 w-4" /> Profil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => toast.success("Déconnexion…")}>
                      <LogOut className="h-4 w-4" /> Déconnexion
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            <main className="flex-1 p-4 md:p-6 min-w-0">
              <Outlet />
            </main>
          </div>
        </div>
        <Toaster richColors position="top-right" />
      </SidebarProvider>
    </QueryClientProvider>
  );
}
