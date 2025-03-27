import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/db/schema';
import useFetch from './use-fetch';

interface SaveMessageData {
  content: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  aiAssistantId?: string | null;
}

// Function to fetch messages for a conversation


// Function to save a new message


export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();
  const authenticatedFetch = useFetch();

  const fetchMessages = async (conversationId: string): Promise<Message[]> => {
    const response = await authenticatedFetch(`/api/conversations/${conversationId}/messages`);

    if (!response.ok) {
      throw new Error('Failed to fetch messages');
    }

    return response.json();
  };

  const saveMessage = async (data: SaveMessageData): Promise<Message> => {
    const response = await authenticatedFetch(`/api/conversations/${conversationId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to save message');
    }

    return response.json();
  };

  // Query for fetching messages for a specific conversation
  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId, // Only run the query if we have a conversationId
  });

  // Mutation for saving a new message
  const createMessage = useMutation({
    mutationFn: saveMessage,
    onSuccess: (newMessage) => {
      // Invalidate the messages query to refetch
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      // Also invalidate the conversations query as the last message timestamp will change
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return {
    messages: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    saveMessage: createMessage.mutate,
    isSaving: createMessage.isPending,
  };
}
