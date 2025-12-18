import * as React from "react"
import SZKPLogo from "@/assets/SZKP_logo_sigint.svg"
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
} from "@/components/ui/sidebar"
import { Card, CardContent } from "./ui/card"
import patroniteLogo from "../assets/patronite-logo-SVG-02.svg"

const data = {
  navMain: [
    {
      title: "Drony",
      items: [
        {
          title: "Kalkulator LOS Anteny",
          url: "#kalkulator-los",
        },
        {
          title: "Generator ustawień VTX",
          url: "#generator-ustawien-vtx",
        },
      ],
    },
  ],
}

import { useHash } from "@/hooks/use-hash";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const activeHash = useHash()

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild className="h-auto">
              <a href="#">
                <div className="bg-sidebar-secondary text-sidebar-primary-foreground flex items-center justify-center rounded-lg">
                  <img src={SZKPLogo} className="size-20" alt="SZKP Logo" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Szkoła Partyzantów</span>
                  <span className="truncate text-xs">Narzędzia</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton asChild isActive={activeHash === subItem.url}>
                      <a href={subItem.url}>{subItem.title}</a>
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
                <img src={patroniteLogo} alt="Patronite" className="h-10 w-auto" />
              </div>
            </CardContent>
          </Card>
        </a>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
