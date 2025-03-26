'use client'

import { SignInButton, useAuth } from "@clerk/nextjs";

import { BrainCircuitIcon, CheckCircle2Icon, MessageSquareIcon, ShieldCheckIcon, TrendingUpIcon, Wallet } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyGenerator } from "./api-key-generator";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WalletButtonContainer } from "./wallet-button";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function QuickStart() {
  const queryClient = new QueryClient();
  const { isSignedIn } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <section className="py-8 sm:py-12 md:py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 md:mb-12">Quick Integration Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
            {/* Sign In with Clerk */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  {isSignedIn ? (
                    <CheckCircle2Icon className="w-6 h-6 text-primary" />
                  ) : (
                    <ShieldCheckIcon className="w-6 h-6 text-primary" />
                  )}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">1. {isSignedIn ? 'Authentication Complete' : 'Sign In to Get Started'}</h3>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center">
                {isSignedIn ? (
                  <>
                    <p className="mb-4 text-muted-foreground">You're successfully signed in! You can now proceed to generate an API key.</p>
                    <div className="flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-md">
                      <CheckCircle2Icon className="w-4 h-4 mr-2" />
                      <span>Authentication successful</span>
                    </div>
                  </>
                ) : (
                  <>
                    <p className="mb-4 text-muted-foreground">Authentication is required before accessing our API services</p>
                    <SignInButton />
                  </>
                )}
              </div>
            </div>

            {/* Generate API Key */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <MessageSquareIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">2. Generate an API Key</h3>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center">
                <ApiKeyGenerator />
              </div>
            </div>

            {/* Top Up Account */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">3. Top Up Your Account</h3>
              </div>
              <div className="flex flex-col items-center justify-center p-3 sm:p-4 md:p-6 text-center">
                <p className="mb-4 text-muted-foreground">Add credits to your account to start using our API services</p>
                <WalletButtonContainer />
              </div>
            </div>

            {/* Advanced Features */}
            <div className="backdrop-blur-sm bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 rounded-xl p-3 sm:p-4 border border-primary/10">
              <div className="flex items-center gap-2 mb-2 sm:mb-4">
                <div className="bg-primary/10 p-2 rounded-lg">
                  <BrainCircuitIcon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold">4. Make your first request</h3>
              </div>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="w-full justify-start">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript" className="bg-black/80 rounded-lg p-2 sm:p-3 md:p-4 overflow-auto">
                  <pre className="text-xs sm:text-sm text-white">
                    <code>{`const axios = require('axios');

const response = await axios.post('${process.env.NEXT_PUBLIC_API_URL}/api/ai/gpt-4o',
  { messages: [
    { role: 'user', content: 'Hello, how are you?' }
  ] },
  { headers: { 'Authorization': 'Bearer your_api_key' } }
);`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="python" className="bg-black/80 rounded-lg p-2 sm:p-3 md:p-4 overflow-auto">
                  <pre className="text-xs sm:text-sm text-white">
                    <code>{`import requests

response = requests.post(
    '${process.env.NEXT_PUBLIC_API_URL}/api/ai/gpt-4o',
    json={
        'messages': [
            {'role': 'user', 'content': 'Hello, how are you?'}
        ]
    },
    headers={'Authorization': 'Bearer your_api_key'}
)`}</code>
                  </pre>
                </TabsContent>
                <TabsContent value="curl" className="bg-black/80 rounded-lg p-2 sm:p-3 md:p-4 overflow-auto">
                  <pre className="text-xs sm:text-sm text-white">
                    <code>{`curl -X POST '${process.env.NEXT_PUBLIC_API_URL}/api/ai/completions' \
  -H 'Authorization: Bearer your_api_key' \
  -H 'Content-Type: application/json' \
  -d '{
    "model": "gpt-4o",
    "messages": [
      {"role": "user", "content": "Hello, how are you?"}
    ]
  }'`}</code>
                  </pre>
                </TabsContent>
              </Tabs>
            </div>
          </div>
          <div className="flex justify-center gap-4 mt-8">
            <Link href="/docs">
              <Button variant="default">View Documentation</Button>
            </Link>
            <Link href="/models">
              <Button variant="outline">Explore Models</Button>
            </Link>
          </div>
        </div>
      </section>
    </QueryClientProvider>
  );
}
