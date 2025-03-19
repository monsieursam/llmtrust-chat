import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from '@/components/ui/sidebar'
import { QueryProvider } from '@/providers/query-provider'
import { ConversationList } from '@/app/chat/_components/conversation-list'
import { getConversations } from '@/actions/conversations'
import Link from 'next/link'
import { StarIcon } from 'lucide-react'
import fetchApi from '@/lib/fetch'
import { useConversations } from '@/hooks/use-conversations'
import { Suspense } from 'react'
import { NavUser } from '@/components/nav-user'
import { auth, currentUser } from '@clerk/nextjs/server'

export default async function ChatSidebar() {
  const user = await currentUser();

  if (!user) {
    return <div>Please sign in to view your conversations</div>;
  }
  const conversations = getConversations()

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
        <Suspense fallback={<div>loadddiiiinnng</div>}>
          <ConversationList conversations={conversations} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter className="h-16 border-b border-sidebar-border">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  )
}
