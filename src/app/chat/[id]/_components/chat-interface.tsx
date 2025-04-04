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
import { useQueryClient } from '@tanstack/react-query';
import { Textarea } from '@/components/ui/textarea';
import { MarkdownRenderer } from '@/components/markdown-renderer';

interface Props {
  llms: LLM[];
}

export default function ChatInterface({ llms }: Props) {
  const { id } = useParams();
  const { messages: messageData, invalidateMessageQuery } = useMessages(id as string);
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
      conversationId: id as string,
      model: selectedLLM?.slug || 'gpt-3.5-turbo',
    },
    onFinish: async () => {
      invalidateMessageQuery();
    }
  })
    ;


  const handleSendMessage = async (e:
    React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    handleSubmit();
    setInput('');

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
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-2">  {/* Added pb-2 to create some space at the bottom */}
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
                  'rounded-lg px-4 py-2 whitespace-pre-wrap',
                  message.role === 'user'
                    ? 'bg-primary text-primary-foreground'
                    : ''
                )}
              >
                {message.parts.map(part => {
                  switch (part.type) {
                    case 'text':
                      return <MarkdownRenderer key={`${message.id}-${part.text}`} content={part.text} className="prose prose-sm dark:prose-invert max-w-none" />;
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t p-2 sm:p-4 w-full sticky bottom-0 bg-background z-10">  {/* Reduced padding on small screens */}
        <form onSubmit={handleSendMessage} className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto flex items-center gap-2 mb-2 sm:mb-0">
                {selectedLLM ? (
                  <>
                    <span className="truncate max-w-[100px]">{selectedLLM.name}</span>
                    <Badge variant="secondary" className="ml-1 whitespace-nowrap">{selectedLLM.provider}</Badge>
                  </>
                ) : (
                  <span>Select LLM</span>
                )}
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
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
          <div className="flex w-full gap-2 items-center">
            <Textarea
              value={input}
              placeholder={`Message ${selectedLLM?.name || 'AI'}...`}
              onChange={handleInputChange}
              className="flex-1 min-h-[40px] max-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                  setInput('');
                }
              }}
            />
            <Button type="submit" size="icon" className="flex-shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
