import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SidebarProvider } from '@/components/ui/sidebar'
import { QueryProvider } from '@/providers/query-provider'

import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";
import { TRCPProvider } from '@/providers/trpc-provider';

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
          <TRCPProvider>
            <SidebarProvider>
              <ChatSidebar />
              <div className='w-full'>
                {children}
              </div>
            </SidebarProvider>
          </TRCPProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
