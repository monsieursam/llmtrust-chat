import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { messages, conversations, conversationsUsers } from "@/db/schema";
import { eq } from "drizzle-orm";


export const messageRouter = router({
  getMessages: protectedProcedure
    .input(z.object({
      conversationId: z.string(),
    }))
    .query(async ({ input, ctx }) => {
      const { conversationId } = input;

      // Verify the conversation belongs to the user
      const conversation = await ctx.readDb
        .select()
        .from(conversationsUsers)
        .leftJoin(conversations, eq(conversationsUsers.conversationId, conversationId))
        .where(eq(conversationsUsers.userId, ctx.user?.userId || ''))
        .limit(1);

      if (conversation.length === 0) {
        throw new Error('Conversation not found');
      }

      // Get all messages for the conversation
      const conversationMessages = await ctx.readDb
        .select()
        .from(messages)
        .where(eq(messages.conversationId, conversationId))
        .orderBy(messages.createdAt);

      return conversationMessages;
    }),

  createMessage: protectedProcedure
    .input(z.object({
      content: z.string(),
      conversationId: z.string(),
      role: z.enum(['user', 'assistant', 'system', 'data']),
      llmId: z.string().nullable().optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      const { content, conversationId, role } = input;

      // Verify the conversation belongs to the user
      const conversation = await ctx.readDb
        .select()
        .from(conversationsUsers)
        .leftJoin(conversations, eq(conversationsUsers.conversationId, conversationId))
        .where(eq(conversationsUsers.userId, ctx.user?.userId || ''))
        .limit(1);

      if (conversation.length === 0) {
        throw new Error('Conversation not found');
      }

      // Create a new message
      const [newMessage] = await ctx.db
        .insert(messages)
        .values({
          content,
          conversationId,
          role,
          userId: ctx.user?.userId || '',
        })
        .returning();

      // Update the conversation's lastMessageAt
      await ctx.db
        .update(conversations)
        .set({
          lastMessageAt: new Date(),
        })
        .where(eq(conversations.id, conversationId));

      return newMessage;
    }),
});
