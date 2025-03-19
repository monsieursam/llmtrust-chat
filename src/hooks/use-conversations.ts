import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { Conversation } from '@/db/schema';
import { useAuth } from '@clerk/nextjs';
import type { UseAuthReturn } from '@clerk/types';

interface CreateConversationData {
  title: string;
}

interface UpdateConversationData {
  id: string;
  title: string;
}

// Function to fetch all conversations
const fetchConversations = async (user: UseAuthReturn): Promise<Conversation[]> => {
  const token = await user.getToken();

  const response = await fetch('/api/conversations', { headers: { 'Authorization': `Bearer ${token}` } });

  if (!response.ok) {
    throw new Error('Failed to fetch conversations');
  }

  return response.json();
};

// Function to create a new conversation
const createConversation = async (data: CreateConversationData, user: UseAuthReturn): Promise<Conversation> => {
  const token = await user.getToken();
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
};

const updateConversation = async (data: UpdateConversationData): Promise<Conversation> => {
  const response = await fetch('/api/conversations', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create conversation');
  }

  return response.json();
};

interface CreateConversationProps {
  title: string;
}

export function useConversations() {
  const queryClient = useQueryClient();
  const user = useAuth()

  // Query for fetching all conversations
  const query = useQuery({
    queryKey: ['conversations'],
    queryFn: () => fetchConversations(user),
  });

  // Mutation for creating a new conversation
  const createMutation = useMutation({
    mutationFn: ({ title }: CreateConversationProps) => createConversation({ title }, user),
    onSuccess: (newConversation) => {
      // Optimistically update the conversations list
      queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
        return oldData ? [newConversation, ...oldData] : [newConversation];
      });

      // Invalidate the conversations query to refetch
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateConversation,
    onSuccess: (newConversation) => {
      // Optimistically update the conversations list
      queryClient.setQueryData<Conversation[]>(['conversations'], (oldData) => {
        if (!oldData) return [newConversation];
        const index = oldData.findIndex((conversation) => conversation.id === newConversation.id);
        if (index === -1) return [newConversation, ...oldData];
        return [...oldData.slice(0, index), newConversation, ...oldData.slice(index + 1)];
      });

      // Invalidate the conversations query to refetch
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });

  return {
    conversations: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    createConversation: createMutation.mutate,
    updateConversation: updateMutation.mutate,
    isUpdating: updateMutation.isPending,
    isCreating: createMutation.isPending,
  };
}
