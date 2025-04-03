import { getAnswer } from '@/actions/ai';
import { deductCredits, getUserCreditBalance } from '@/actions/credits';
import { db } from '@/db';
import { messages as messageTable } from '@/db/schema';
import { openai } from '@ai-sdk/openai';
import { auth } from '@clerk/nextjs/server';
import { streamText, generateText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const allProviders = {
  openai: openai,
};

export async function POST(req: Request) {
  const { messages, system, provider, model, stream, conversationId } = await req.json();
  const user = await auth();

  if (!user?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Check if user has enough credits
  const { success, balance } = await getUserCreditBalance(user.userId);

  if (!success || balance <= 0) {
    return NextResponse.json({ error: 'Insufficient credits' }, { status: 403 });
  }


  const currentProvider = allProviders[provider as keyof typeof allProviders];

  if (!currentProvider) {
    return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
  }



  if (!stream) {
    const result = await getAnswer({
      provider,
      model,
      messages,
      system,
    });

    // Deduct credits based on token usage
    if (result.usage) {
      await db.insert(messageTable).values({
        userId: user.userId,
        conversationId,
        content: result.text,
        role: 'assistant',
      })
      await deductCredits({
        userId: user.userId,
        llmSlug: model, // Using model ID
        promptTokens: result.usage.promptTokens || 0,
        completionTokens: result.usage.completionTokens || 0,
      });
    }

    return NextResponse.json(result);
  }

  const result = streamText({
    model: currentProvider(model),
    messages,
    system,
    onFinish: async (completion) => {
      await db.insert(messageTable).values({
        conversationId,
        content: messages[messages.length - 1].content,
        role: 'user',
      });
      await db.insert(messageTable).values({
        conversationId,
        content: completion.text,
        role: 'assistant',
      });
      if (completion.usage) {
        await deductCredits({
          userId: user.userId,
          llmSlug: model, // Using model ID
          promptTokens: completion.usage.promptTokens || 0,
          completionTokens: completion.usage.completionTokens || 0,
        });
      }
    }
  },

  );

  return result.toDataStreamResponse();
}
