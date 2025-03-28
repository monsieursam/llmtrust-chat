import { getAnswer } from '@/actions/ai';
import { openai } from '@ai-sdk/openai';
import { streamText, generateText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const allProviders = {
  openai: openai,
};

export async function POST(req: Request) {
  const { messages, system, provider, model, stream } = await req.json();
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

    return NextResponse.json(result);
  }

  const result = streamText({
    model: currentProvider(model),
    messages,
    system,
    onFinish: async (completion) => {
      console.log('Finished streaming', completion.usage.completionTokens);
      console.log('Finished streaming', completion.usage.promptTokens);
      console.log('Finished streaming', completion.usage.totalTokens);
    }
  },

  );

  return result.toDataStreamResponse();
}
