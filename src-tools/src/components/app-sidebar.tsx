import * as React from "react";
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
import { TOOLS } from "@/lib/tools";

const data = {
  navMain: [
    {
      title: "Drony",
      items: TOOLS,
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
    <Sidebar {...props}>
      <SidebarHeader>
        <div className="flex items-center gap-2 md:mt-5">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild className="h-auto">
                <a href="#" onClick={handleMenuClick}>
                  <div className="bg-sidebar-secondary text-sidebar-primary-foreground flex items-center justify-center rounded-lg">
                    <img src={SZKPLogo} className="size-20" alt="SZKP Logo" />
                  </div>
                  <div className="grid flex-1 text-left leading-tight">
                    <span className="truncate font-bold text-lg">Szkoła Partyzantów</span>
                    <span className="truncate font-medium text-lg">Narzędzia</span>
                  </div>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <SidebarTrigger className="md:hidden h-14 w-14 [&_svg]:size-8" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={activeHash === subItem.url} size="lg">
                      <a href={subItem.url} onClick={handleMenuClick}>
                        {subItem.title}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarFooter>
        <a href="https://patronite.pl/szkola_partyzantow">
          <Card>
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
