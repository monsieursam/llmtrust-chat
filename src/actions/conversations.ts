'use server';

import { db } from '@/db';
import { conversations } from '@/db/schema';
import fetchApi from '@/lib/fetch';
import { auth, currentUser } from '@clerk/nextjs/server';
import axios from 'axios';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export async function getConversations() {
  const response = await fetchApi('/api/conversations');

  return response.json();
}

export async function getConversation(id: string) {
  return fetchApi(`/api/conversations/${id}`);
}

export async function createConversation() {
  // const response = await fetchApi('/api/conversations', {
  //   method: 'POST',
  //   body: JSON.stringify({
  //     title: 'New Conversation',
  //   }),
  // });

  revalidateTag('conversations');

  return 'response.json()';
}

export async function updateConversation(id: string, title: string) {
  const user = await currentUser();

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
  const user = await currentUser();
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
