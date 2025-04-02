'use client'

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { ConversationList } from '@/app/chat/_components/conversation-list'
import Link from 'next/link'
import { NavUser } from '@/components/nav-user'
import { StarIcon } from 'lucide-react'

export default function ChatSidebar() {
  return (
    <Sidebar>
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
      </SidebarHeader>
      <SidebarContent>
        <ConversationList />
      </SidebarContent>
      <SidebarFooter className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
