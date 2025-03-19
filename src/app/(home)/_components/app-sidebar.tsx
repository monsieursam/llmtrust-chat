'use client'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import { StarIcon, BoxIcon, AppWindowIcon, InfoIcon, MessageSquareIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { SearchForm } from "./search-form"

export function AppSidebar() {
  const pathname = usePathname();
  const items = [
    {
      label: "Models",
      href: "/models",
      icon: <BoxIcon className="size-4" />
    },
    {
      label: "AI Apps",
      href: "/aiapps",
      icon: <AppWindowIcon className="size-4" />
    },
    {
      label: "Docs",
      href: "/docs",
      icon: <InfoIcon className="size-4" />,
      badge: "Beta"
    },
    {
      label: "Chat",
      href: "/chat",
      icon: <MessageSquareIcon className="size-4" />,
    },
  ]


  return (
    <Sidebar variant="floating">
      <SidebarHeader className="">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <StarIcon className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">LLMTrust</span>
                  <span className="text-xs">AI Model Intelligence Hub</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          {items.map((item) => (
            <SidebarMenuButton
              asChild
              key={item.href}
              className={pathname === item.href ? "bg-sidebar-accent text-sidebar-accent-foreground" : ""}
            >
              <Link href={item.href} className="flex items-center gap-2">
                {item.icon}
                {item.label}
                {item.badge && (
                  <Badge variant={'outline'} >
                    {item.badge}
                  </Badge>
                )}
              </Link>
            </SidebarMenuButton>
          ))}
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
