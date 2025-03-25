import { NextResponse } from 'next/server';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { aiApps, aiAppsLlms, llms, type AiApp, type LLM } from '@/db/schema';

export type AiAppWithLLM = AiApp & { llms: LLM[] };

export async function GET() {
  try {
    const data = await db
      .select({
        aiApp: aiApps,
        llm: llms
      })
      .from(aiApps)
      .leftJoin(aiAppsLlms, eq(aiApps.id, aiAppsLlms.aiAppId))
      .leftJoin(llms, eq(aiAppsLlms.llmId, llms.id));

    // Group LLMs under their AI Apps
    const aiAppsWithLlms = data.reduce((acc, { aiApp, llm }) => {
      const existing = acc.find(a => a.id === aiApp.id);

      if (existing) {
        if (llm) existing.llms.push(llm);
      } else {
        acc.push({
          ...aiApp,
          llms: llm ? [llm] : []
        });
      }

      return acc;
    }, [] as AiAppWithLLM[]);

    return NextResponse.json(aiAppsWithLlms);
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
    const [newLLM] = await db.insert(aiApps)
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
