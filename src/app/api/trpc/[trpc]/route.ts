import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/server";
import { auth } from "@clerk/nextjs/server";

export const config = { runtime: 'edge' };

const handler = async (req: Request) => {
  const user = await auth();

  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({
      user
    })
  });
}

export { handler as GET, handler as POST };
