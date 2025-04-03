import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";
import { TRPCProviderContainer } from '@/providers/trpc-provider';
import { Header } from './_components/header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '../(home)/_components/theme-provider';

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
          <ThemeProvider>
            <TRPCProviderContainer>
              <SidebarProvider>
                <ChatSidebar />
                <SidebarInset>
                  <Header />
                  <main className="flex flex-1 w-full">
                    {children}
                  </main>
                  <Toaster />
                </SidebarInset>
              </SidebarProvider>
            </TRPCProviderContainer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
