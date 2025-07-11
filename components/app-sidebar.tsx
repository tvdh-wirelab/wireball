"use client"

import { Home, Package, DollarSign, Settings, Users } from "lucide-react"
import Link from "next/link"
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
  SidebarSeparator,
  SidebarFooter,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const mainNavigation = [
  {
    title: "Dashboard",
    url: "#",
    icon: Home,
  },
  {
    title: "Products",
    url: "#",
    icon: Package,
  },
  {
    title: "Estimator",
    url: "/", // This is the current page
    icon: DollarSign,
  },
  {
    title: "Clients",
    url: "#",
    icon: Users,
  },
]

const settingsNavigation = [
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-xl">
          <span className="text-primary">WireBall</span>
        </Link>
      </SidebarHeader>
      
      
    </Sidebar>
  )
}
