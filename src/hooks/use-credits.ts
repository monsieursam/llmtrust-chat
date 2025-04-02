import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/providers/trpc-provider";

export function useCredits() {
  const trpc = useTRPC();

  const conversationQuery = trpc.credits.getBalance.queryOptions();

  return useQuery(conversationQuery);
}
