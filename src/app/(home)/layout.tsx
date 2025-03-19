import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner"
import { ClerkProvider } from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react"

import "../globals.css";
import { ThemeProvider } from "./_components/theme-provider";
import { Header } from "./_components/header";
import { Footer } from "./_components/footer";
import { AppSidebar } from "./_components/app-sidebar";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLMTrust - AI Model Intelligence Platform",
  description: "Discover, evaluate, and integrate AI models and applications with trusted reviews, technical documentation, and implementation guides.",
  keywords: "LLM, AI models, language models, AI reviews, model comparison, AI applications, model integration, API documentation, artificial intelligence",
  authors: [{ name: "LLMTrust" }],
  openGraph: {
    title: "LLMTrust - AI Model Intelligence Platform",
    description: "Discover, evaluate, and integrate AI models and applications with trusted reviews, technical documentation, and implementation guides.",
    type: "website",
    locale: "en_US",
    siteName: "LLMTrust"
  },
  twitter: {
    card: "summary_large_image",
    title: "LLMTrust - AI Model Intelligence Platform",
    description: "Your trusted platform for AI model reviews, application discovery, and seamless integration.",
    creator: "@llmtrust"
  },
  robots: {
    index: true,
    follow: true
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://llmtrust.com")
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
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

            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <Header />
                <main className="flex flex-1 max-w-100">
                  {children}
                </main>
                <Toaster />
                <Footer />
              </SidebarInset>
            </SidebarProvider>
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    </ClerkProvider>
  );
}
