
import { SidebarProvider, Sidebar as ShadcnSidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarTrigger } from "@/components/ui/sidebar";
import { Home, Calendar, Search, Users, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const menuItems = [
  {
    title: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    title: "My Rooms",
    path: "/my-rooms",
    icon: Calendar,
  },
  {
    title: "Explore",
    path: "/explore",
    icon: Search,
  },
  {
    title: "Friends",
    path: "/friends",
    icon: Users,
  },
];

export function SidebarWrapper({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <div className="p-4 border-b flex justify-between items-center">
            <SidebarTrigger />
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </Button>
              <div className="h-8 w-8 rounded-full bg-roomloop-purple text-white flex items-center justify-center">
                U
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

function AppSidebar() {
  return (
    <ShadcnSidebar>
      <SidebarHeader className="flex items-center px-4 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-roomloop-purple text-white flex items-center justify-center font-bold">R</div>
          <span className="font-bold text-lg">RoomLoop</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Actions</SidebarGroupLabel>
          <SidebarGroupContent>
            <Link to="/create-room">
              <Button className="w-full gap-2">
                <Plus className="h-4 w-4" />
                Create Room
              </Button>
            </Link>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-4 py-3 border-t">
        <div className="text-xs text-muted-foreground">
          RoomLoop &copy; {new Date().getFullYear()}
        </div>
      </SidebarFooter>
    </ShadcnSidebar>
  );
}
