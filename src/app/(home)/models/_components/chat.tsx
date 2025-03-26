import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import type { LLM } from "@/db/schema";
import { useChat } from '@ai-sdk/react';

interface Props {
  llm: LLM;
}

export function Chat({ llm }: Props) {
  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    body: {
      provider: llm.provider,
      stream: true,
      model: llm.slug,
    },
  });
  const { isSignedIn, isLoaded } = useAuth();

  if (isLoaded && !isSignedIn) {
    return (
      <Card className="p-6">
        <div className="flex flex-col items-center justify-center h-[500px] text-center">
          <h3 className="text-xl font-semibold mb-4">Sign in to chat with {llm.name}</h3>
          <p className="text-muted-foreground mb-6">You need to be signed in to use the chat feature with this model.</p>
          <SignInButton>
            <Button>Sign In</Button>
          </SignInButton>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-col h-[500px]">
        {/* Notice */}
        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md p-3 mb-4 text-sm text-amber-800 dark:text-amber-200">
          <strong>Note:</strong> We do not save or store any data sent through this chat interface. All conversations are ephemeral and will be lost when you close this page.
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.content}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
                  }`}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        {/* Input & Send Button */}
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Type your message..."
          />
          <Button onClick={handleSubmit}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
