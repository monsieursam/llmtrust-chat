import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/db/schema';
import useFetch from './use-fetch';

interface CreateConversationData {
  title: string;
}

interface UpdateConversationData {
  id: string;
  title: string;
}

export function useConversations() {
  const queryClient = useQueryClient();
  const authenticatedFetch = useFetch();

  const fetchConversations = async (): Promise<Conversation[]> => {
    const response = await authenticatedFetch('/api/conversations');

    if (!response.ok) {
      throw new Error('Failed to fetch conversations');
    }

    return response.json();
  };

  const createConversation = async (data: CreateConversationData): Promise<Conversation> => {
    const response = await authenticatedFetch('/api/conversations', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    return response.json();
  };

  const updateConversation = async (data: UpdateConversationData): Promise<Conversation> => {
    const response = await authenticatedFetch(`/api/conversations/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to create conversation');
    }

    return response.json();
  };

  // Query for fetching all conversations
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: fetchConversations,
  });

  // Mutation for creating a new conversation
  const createMutation = useMutation({
    mutationFn: createConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateConversation,
    onSuccess: (newConversation) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return {
    conversations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createConversationData: createMutation.data,
    createConversation: createMutation.mutate,
    updateConversation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
}
