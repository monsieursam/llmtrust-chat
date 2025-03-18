'use server';

import { db } from '@/db';
import { conversations, messages } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { asc, eq } from 'drizzle-orm';
import { revalidateTag } from 'next/cache';

export async function getMessages(conversationId: string) {
  const conversationMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(asc(messages.createdAt));

  return conversationMessages;
}

export async function getMessage(id: string) {
  const user = await getCurrentUser();

  const message = await db
    .select()
    .from(messages)
    .where(eq(messages.id, id))
    .limit(1);

  return message[0];
}

export async function createMessage({
  content,
  role,
  conversationId,
}: {
  content: string;
  role: 'user' | 'assistant' | 'system' | 'data';
  conversationId: string;
  aiAssistantId?: string;
}) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not found');
  }

  const [message] = await db
    .insert(messages)
    .values({
      content,
      role,
      userId: user?.id,
      conversationId,
    })
    .returning();

  // Update the conversation's lastMessageAt
  await db
    .update(conversations)
    .set({
      lastMessageAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, conversationId));

  revalidateTag(`conversations/${conversationId}`)

  return message;
}

export async function updateMessage(id: string, content: string) {
  const user = await getCurrentUser();

  const [message] = await db
    .update(messages)
    .set({
      content,
      updatedAt: new Date(),
    })
    .where(eq(messages.id, id))
    .returning();

  return message;
}

export async function deleteMessage(id: string) {
  const user = await getCurrentUser();

  await db
    .delete(messages)
    .where(eq(messages.id, id));

  return true;
}
