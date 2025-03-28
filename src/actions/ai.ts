'use server';

import { generateText, streamText, type CoreMessage, type LanguageModelV1 } from 'ai';
import { openai } from '@ai-sdk/openai';

interface PromptProps {
  prompt?: string;
  system?: string;
  messages?: CoreMessage[];
  provider: string;
  model: string;
}

const allProviders = {
  openai: openai,
};

export async function getAnswer({ prompt, system, messages, provider, model }: PromptProps) {
  const currentProvider = allProviders[provider];

  const { text, finishReason, usage } = await generateText({
    model: currentProvider(model),
    prompt,
    messages,
    system,
  });

  return { text, finishReason, usage };
}
