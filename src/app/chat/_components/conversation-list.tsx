'use client';

import { useRouter } from 'next/navigation';
import { Loader, PlusIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
// import { createConversation, getConversations } from '@/app/actions/conversations';
import { useFormStatus } from 'react-dom';
import { useConversations } from '@/hooks/use-conversations';
// import { createConversation } from '@/actions/conversations';
import type { Conversation } from '@/db/schema';

export function ConversationList() {
  const router = useRouter();
  const { createConversation, isCreating, conversations } = useConversations();

  const handleSubmit = async () => {
    const conversation = await createConversation({ title: 'New Conversation' });

    if (conversation && 'id' in conversation) {
      router.push(`/chat/${conversation.id}`)
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-2">
        <form action={handleSubmit}>
          <Button
            className="w-full"
            variant="outline"
          >
            {
              isCreating ?
                <Loader className="mr-2 h-4 w-4 animate-spin" /> : <div className='flex items-center'>
                  <PlusIcon className="mr-2 h-4 w-4" />
                  New Conversation
                </div>
            }
          </Button>
        </form>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <ul className="space-y-2">
          {conversations?.map((conversation) => (
            <li key={conversation.id}>
              <Button
                variant="ghost"
                className="w-full justify-start truncate"
                onClick={() => router.push(`/chat/${conversation.id}`)}
              >
                {conversation.title}
              </Button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
