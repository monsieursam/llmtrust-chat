import { db } from "@/db";
import { apiKeys } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { createHash, randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

function generateSecureToken() {
  // Generate 32 random bytes and convert to a hex string
  const randomString = randomBytes(32).toString('hex');

  // Create a hash of the random string for additional security
  const hash = createHash('sha256').update(randomString).digest('hex');

  // Return a prefix followed by the first 32 characters of the hash
  return `llmt_${hash.substring(0, 32)}`;
}

export async function GET(req: NextRequest) {
  try {
    const user = await auth();

    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const response = await db.query.apiKeys.findMany(
      {
        where: (apiKeys, { eq }) => eq(apiKeys.userId, user.userId),
      }
    );

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await auth();
    if (!user?.userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const apiKeyString = generateSecureToken();

    const response = await db.insert(apiKeys).values({
      key: apiKeyString,
      userId: user.userId,
    }).returning();

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }
}
