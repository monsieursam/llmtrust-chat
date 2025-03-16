import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Message } from '@/db/schema';

interface SaveMessageData {
  content: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  aiAssistantId?: string | null;
}

// Function to fetch messages for a conversation
const fetchMessages = async (conversationId: string): Promise<Message[]> => {
  const response = await fetch(`/api/messages?conversationId=${conversationId}`);

  if (!response.ok) {
    throw new Error('Failed to fetch messages');
  }

  return response.json();
};

// Function to save a new message
const saveMessage = async (data: SaveMessageData): Promise<Message> => {
  const response = await fetch('/api/messages', {
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

export function useMessages(conversationId: string) {
  const queryClient = useQueryClient();

  // Query for fetching messages for a specific conversation
  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchMessages(conversationId),
    enabled: !!conversationId, // Only run the query if we have a conversationId
  });

  // Mutation for saving a new message
  const saveMutation = useMutation({
    mutationFn: saveMessage,
    onSuccess: (newMessage) => {
      // Optimistically update the messages list
      queryClient.setQueryData<Message[]>(['messages', conversationId], (oldData) => {
        return oldData ? [...oldData, newMessage] : [newMessage];
      });

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
    saveMessage: saveMutation.mutate,
    isSaving: saveMutation.isPending,
  };
}
