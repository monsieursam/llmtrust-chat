import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SidebarProvider } from '@/components/ui/sidebar'
import { QueryProvider } from '@/providers/query-provider'

import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";

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
