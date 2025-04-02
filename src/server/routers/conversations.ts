import { protectedProcedure, router } from "../trpc";
import { z } from "zod";
import { db, readDb } from "@/db";
import { conversations, conversationsUsers } from "@/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";

export const conversationRouter = router({
  getAllConversations: protectedProcedure
    .query(async ({ ctx }) => {
      try {
        const userConversations = await readDb
          .select({
            id: conversations.id,
            title: conversations.title,
            lastMessageAt: conversations.lastMessageAt,
            createdAt: conversations.createdAt,
            updatedAt: conversations.updatedAt
          })
          .from(conversationsUsers)
          .leftJoin(conversations, eq(conversationsUsers.conversationId, conversations.id))
          .where(eq(conversationsUsers.userId, ctx.user?.userId || ''))
          .orderBy(desc(conversations.lastMessageAt));

        return userConversations;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch conversations'
        });
      }
    }),
  updateConversation: protectedProcedure
    .input(z.object({ id: z.string(), title: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const { id, title } = input;

        if (!title) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Title is required'
          });
        }

        const [updatedConversation] = await db
          .update(conversations)
          .set({ title })
          .where(eq(conversations.id, id))
          .returning();

        return updatedConversation;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update conversation'
        });
      }
    }),

  createConversation: protectedProcedure
    .input(z.object({ title: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { title } = input;

        if (!title) {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Title is required'
          });
        }

        // Create a new conversation
        const newConversation = await db.transaction(async (tx) => {
          // Prepare the userId once to avoid repeated access
          const userId = ctx.user?.userId || '';

          const [conversation] = await tx
            .insert(conversations)
            .values({
              title,
              lastMessageAt: new Date(),
            })
            .returning();

          await tx
            .insert(conversationsUsers)
            .values({
              userId,
              conversationId: conversation.id,
            });

          return conversation;
        });

        return newConversation;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create conversation'
        });
      }
    }),
});
