import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SidebarProvider } from '@/components/ui/sidebar'

import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";
import { TRPCProvider } from '@/providers/trpc-provider';

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
          <TRPCProvider>
            <SidebarProvider>
              <ChatSidebar />
              <div className='w-full'>
                {children}
              </div>
            </SidebarProvider>
          </TRPCProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
