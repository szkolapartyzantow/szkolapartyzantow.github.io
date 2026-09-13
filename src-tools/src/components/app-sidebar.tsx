import * as React from "react";
import { History, Mail } from "lucide-react";
import SZKPLogo from "@/assets/SZKP_logo_sigint.svg";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarFooter,
  useSidebar,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Card, CardContent } from "./ui/card";
import patroniteLogo from "../assets/patronite-logo-SVG-02.svg";
import { DRONE_TOOLS, SHOOTING_TOOLS } from "@/lib/tools";

const data = {
  navMain: [
    {
      title: "Drony",
      items: DRONE_TOOLS,
    },
    {
      title: "Strzelectwo",
      items: SHOOTING_TOOLS,
    },
  ],
};

import { useHash } from "@/hooks/use-hash";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeHash = useHash();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleMenuClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar {...props} className="border-sidebar-border/70">
      <SidebarHeader className="border-sidebar-border/60 border-b px-4 pb-5 pt-4">
        <div className="flex items-center gap-2 md:mt-2">
          <SidebarTrigger className="h-9 w-9 text-sidebar-foreground/80 md:hidden [&_svg]:size-6" />
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                size="lg"
                asChild
                className="h-auto rounded-none px-0 py-2 hover:bg-transparent active:bg-transparent active:text-sidebar-foreground data-[active=true]:bg-transparent"
              >
                <a href="#" onClick={handleMenuClick} className="group/brand">
                  <div className="bg-background/25 flex size-16 shrink-0 items-center justify-center">
                    <img
                      src={SZKPLogo}
                      className="size-13 transition-transform duration-200 group-hover/brand:scale-105"
                      alt="SZKP Logo"
                    />
                  </div>
                  <div className="grid flex-1 gap-1 text-left leading-tight">
                    <span className="group-hover/brand:text-primary truncate text-lg font-bold tracking-normal">
                      Szkoła Partyzantów
                    </span>
                    <span className="text-sidebar-foreground/65 truncate text-[0.8rem] font-semibold uppercase tracking-[0.14em]">
                      Narzędzia
                    </span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </SidebarHeader>
      <SidebarContent className="gap-5 px-3 py-5">
        {data.navMain.map((item) => {
          return (
            <SidebarGroup key={item.title} className="p-0">
              <SidebarGroupLabel className="text-sidebar-foreground/55 mb-2 h-auto rounded-none px-1 text-[0.72rem] font-bold uppercase tracking-[0.18em]">
                {item.title}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="gap-1.5">
                  {item.items.map((subItem) => {
                    const isActive = activeHash === subItem.url;

                    return (
                      <SidebarMenuItem key={subItem.title}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          size="lg"
                          className="hover:bg-sidebar-accent/60 data-[active=true]:bg-primary data-[active=true]:text-primary-foreground h-11 rounded-none border border-transparent px-3 font-semibold transition-colors data-[active=true]:border-primary data-[active=true]:shadow-sm"
                        >
                          <a
                            href={subItem.url}
                            onClick={handleMenuClick}
                            title={subItem.description}
                          >
                            <span className="truncate">{subItem.title}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border/60 gap-3 border-t p-4">
        <a
          href="#kontakt"
          className="hover:bg-sidebar-accent flex h-10 items-center gap-3 px-3 text-sm font-semibold transition-colors hover:text-sidebar-accent-foreground"
          onClick={handleMenuClick}
        >
          <Mail className="size-4 opacity-70" />
          <span>Kontakt</span>
        </a>
        <a
          href="#lista-zmian"
          className="hover:bg-sidebar-accent flex h-10 items-center gap-3 px-3 text-sm font-semibold transition-colors hover:text-sidebar-accent-foreground"
          onClick={handleMenuClick}
        >
          <History className="size-4 opacity-70" />
          <span>Lista zmian</span>
        </a>
        <a href="https://patronite.pl/szkola_partyzantow" className="block">
          <Card className="hover:bg-muted/50">
            <CardContent>
              <div className="flex flex-col items-center justify-center">
                <span className="mb-2 font-bold text-muted-foreground">Wspieraj nas na:</span>
                <img src={patroniteLogo} alt="Patronite" className="h-10 w-auto" />
              </div>
            </CardContent>
          </Card>
        </a>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
