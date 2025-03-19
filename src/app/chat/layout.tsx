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
import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";
import { QueryClient } from '@tanstack/react-query'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={'antialiased min-h-screen flex flex-col'}
        >
          <QueryProvider>
            <SidebarProvider>
              <ChatSidebar />
              <div className='w-full'>
                {children}
              </div>
            </SidebarProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
