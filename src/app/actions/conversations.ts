'use server';

import { db } from '@/db';
import { conversations } from '@/db/schema';
import { getCurrentUser } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getConversations() {
  const user = await getCurrentUser();

  if (!user) {
    return []
  }

  const userConversations = await db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, user?.id))
    .orderBy(desc(conversations.lastMessageAt));

  return userConversations;
}

export async function getConversation(id: string) {
  const user = await getCurrentUser();

  if (!user) {
    return [];
  }

  const conversation = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id))
    .limit(1);

  return conversation[0];
}

export async function createConversation() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not found');
  }

  const [conversation] = await db
    .insert(conversations)
    .values({
      title: 'New conversation',
      userId: user?.id || '',
    })
    .returning();

  revalidateTag(`${user.id}/conversations`);

  return conversation;
}

export async function updateConversation(id: string, title: string) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('User not found');
  }

  const [conversation] = await db
    .update(conversations)
    .set({
      title,
      updatedAt: new Date(),
    })
    .where(eq(conversations.id, id))
    .returning();

  revalidateTag('conversations');

  return conversation;
}

export async function deleteConversation(id: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('User not found');
  }

  await db
    .delete(conversations)
    .$dynamic()
    .where(eq(conversations.id, id))
    .where(eq(conversations.userId, user.id));

  revalidateTag('conversations');

  return true;
}
