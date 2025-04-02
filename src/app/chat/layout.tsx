import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SidebarProvider } from '@/components/ui/sidebar'

import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";
import { TRPCProviderContainer } from '@/providers/trpc-provider';

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
          <TRPCProviderContainer>
            <SidebarProvider>
              <ChatSidebar />
              <div className='w-full'>
                {children}
              </div>
            </SidebarProvider>
          </TRPCProviderContainer>
        </body>
      </html>
    </ClerkProvider>
  )
}
