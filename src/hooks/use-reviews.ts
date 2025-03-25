import type { ReviewType } from '@/app/api/reviews/types';
import type { Review } from '@/db/schema';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

interface Props {
  type: ReviewType;
  typeId: string;
}

export function useReviews({ type, typeId }: Props) {
  return useQuery<Review[]>({
    queryKey: [`/api/${type}/${typeId}/reviews`],
    queryFn: async () => {
      const response = await axios.get(`/api/${type}/${typeId}/reviews`);

      return response.data;
    },
  });
}

interface MutationProps extends Props {
  reviewId: string;
}

export function useDeleteReview({ type, typeId, reviewId }: MutationProps) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await axios.delete(`/api/${type}/${typeId}/reviews/${reviewId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}/${typeId}/reviews`] });
    },
  });
}

export function useCreateReview({ type, typeId }: Props) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: Partial<Review> }) => {
      const response = await axios.post(`/api/${type}/${typeId}/reviews`, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}/${typeId}/reviews`] });
    },
  });
}

export function useUpdateReview({ type, typeId }: Props) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ data }: { data: Partial<Review> }) => {
      const response = await axios.patch(`/api/${type}/${typeId}/reviews`, data);

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/${type}/${typeId}/reviews`] });
    },
  });
}
