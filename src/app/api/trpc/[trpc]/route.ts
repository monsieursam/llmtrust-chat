import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { db, readDb } from "@/db";
import { auth } from "@clerk/nextjs/server";

const handler = async (req: Request) => {
  const user = await auth();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      user,
      db,
      readDb
    })
  });
}

export { handler as GET, handler as POST };
