import { Link, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard, Users, KanbanSquare, Megaphone, Package, Mail, Workflow, Plug, Sparkles,
} from "lucide-react";
import {
  Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Leads & Prospection", url: "/leads", icon: Users },
  { title: "CRM Pipeline", url: "/crm", icon: KanbanSquare },
  { title: "Marketing IA", url: "/marketing", icon: Megaphone },
  { title: "Commandes", url: "/orders", icon: Package },
  { title: "Emails", url: "/emails", icon: Mail },
  { title: "Workflow", url: "/workflow", icon: Workflow },
  { title: "Intégrations", url: "/integrations", icon: Plug },
];

export function AppSidebar() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b">
        <div className="flex items-center gap-2 px-2 py-2">
          <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-success to-primary text-white shadow-sm">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-sm font-semibold">Foodplus</span>
            <span className="text-[10px] text-muted-foreground">Groupe LRUCH · Sales OS</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Plateforme</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t">
        <div className="flex items-center gap-2 px-2 py-2 group-data-[collapsible=icon]:hidden">
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary text-xs font-semibold">YE</div>
          <div className="flex flex-col text-xs leading-tight">
            <span className="font-medium">Younes El Idrissi</span>
            <span className="text-muted-foreground">Sales Manager</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
