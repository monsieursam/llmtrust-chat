import {
  ClerkProvider,
} from '@clerk/nextjs'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import ChatSidebar from './_components/chat-sidebar'
import "../globals.css";
import { TRPCProviderContainer } from '@/providers/trpc-provider';
import { Header } from './_components/header';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (

    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <TRPCProviderContainer>

              <SidebarProvider>
                <ChatSidebar />
                <SidebarInset>
                  <Header />
                  <main className="flex flex-1">
                    {children}
                  </main>
                  <Toaster />
                </SidebarInset>
              </SidebarProvider>
            </TRPCProviderContainer>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  )
}
