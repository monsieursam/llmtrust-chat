'use server'

import { db } from '@/db';
import { conversations } from '@/db/schema';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { eq, desc } from 'drizzle-orm';
import { NextResponse } from 'next/server';

// GET /api/conversations - Get all conversations for the current user
export async function GET(req: Request) {
  try {
    // Get the current user
    const user = await auth();

    if (!user?.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all conversations for the user
    const userConversations = await db
      .select()
      .from(conversations)
      .where(eq(conversations.userId, user.userId))
      .orderBy(desc(conversations.lastMessageAt));

    return NextResponse.json(userConversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

// POST /api/conversations - Create a new conversation
export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title } = await req.json();

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    // Create a new conversation
    const [newConversation] = await db
      .insert(conversations)
      .values({
        title,
        userId: userId,
        lastMessageAt: new Date(),
      })
      .returning();

    return NextResponse.json(newConversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json(
      { error: 'Failed to create conversation' },
      { status: 500 }
    );
  }
}
