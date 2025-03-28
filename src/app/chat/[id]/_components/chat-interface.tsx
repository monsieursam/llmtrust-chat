'use client'

import { getAnswer } from '@/actions/ai';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useChat } from '@ai-sdk/react';
import { useParams } from 'next/navigation';
import { Send, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { LLM, Message } from '@/db/schema';
import { useMessages } from '@/hooks/use-messages';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { useConversations } from '@/hooks/use-conversations';

interface Props {
  llms: LLM[];
}

export default function ChatInterface({ llms }: Props) {
  const { id } = useParams();
  const { messages: messageData, saveMessage } = useMessages(id as string);
  const { updateConversation } = useConversations();
  const [selectedLLM, setSelectedLLM] = useState<LLM | null>(llms.length > 0 ? llms[0] : null);

  const { messages, input, handleInputChange, handleSubmit, setInput } = useChat({
    initialMessages: messageData.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
    })),
    body: {
      provider: selectedLLM?.provider || 'openai',
      stream: true,
      model: selectedLLM?.slug || 'gpt-3.5-turbo',
    },
    onFinish(message, options) {
      saveMessage({
        role: message.role,
        content: message.content || '',
        conversationId: id as string,
        llmId: selectedLLM?.id || '',
      })
    },
  });


  const handleSendMessage = async (e:
    React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    handleSubmit();
    saveMessage({
      role: 'user',
      content: input,
      conversationId: id as string,
      llmId: selectedLLM?.id || '',
    })

    if (messages.length === 0) {
      const { text } = await getAnswer({
        provider: selectedLLM?.provider || 'openai',
        model: selectedLLM?.slug || 'gpt-3.5-turbo',
        system: 'Generate title with less than 5 words base on the user message',
        messages: [
          {
            role: 'user',
            content: input,
          },
        ],
      });
      updateConversation({
        id: id as string,
        title: text,
      })
    }

    setInput('');
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-6">
          {messages.map(message => (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4 text-sm',
                message.role === 'user' ? 'justify-end' : 'justify-start'
              )}
            >
              <div
                className={cn(
                  'rounded-lg px-4 py-2 max-w-[85%] whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : ''
                )}
              >
                {message.parts.map(part => {
                  switch (part.type) {
                    case 'text':
                      return <div key={`${message.id}-${part.text}`}>{part.text}</div>;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-4 w-full">
        <div className="flex items-center mb-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                {selectedLLM ? (
                  <>
                    <span>{selectedLLM.name}</span>
                    <Badge variant="secondary" className="ml-1">{selectedLLM.provider}</Badge>
                  </>
                ) : (
                  <span>Select LLM</span>
                )}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {llms.map((llm) => (
                <DropdownMenuItem key={llm.id} onClick={() => setSelectedLLM(llm)}>
                  <div className="flex items-center gap-2">
                    <span>{llm.name}</span>
                    <Badge variant="secondary">{llm.provider}</Badge>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <Input
            value={input}
            placeholder={`Message ${selectedLLM?.name || 'AI'}...`}
            onChange={handleInputChange}
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
