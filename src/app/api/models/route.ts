import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { aiApps, aiAppsLlms, llms, type AiApp, type LLM } from '@/db/schema';

export type LLMWithAiApps = LLM & { aiApps: AiApp[] };

export async function GET() {
  try {
    const data = await db
      .select({
        llm: llms,
        aiApp: aiApps,
      })
      .from(llms)
      .leftJoin(aiAppsLlms, eq(llms.id, aiAppsLlms.aiAppId))
      .leftJoin(aiApps, eq(aiAppsLlms.llmId, aiApps.id));

    // Group LLMs under their AI Apps
    const llmWithAiApps = data.reduce((acc, { aiApp, llm }) => {
      const existing = acc.find(a => a.id === llm.id);

      if (existing) {
        if (aiApp) existing.aiApps.push(aiApp);
      } else {
        acc.push({
          ...llm,
          aiApps: aiApp ? [aiApp] : []
        });
      }

      return acc;
    }, [] as LLMWithAiApps[]);

    return NextResponse.json(llmWithAiApps);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const [newLLM] = await db.insert(llms)
      .values({
        ...body,
      })
      .returning();

    return NextResponse.json(newLLM);
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
