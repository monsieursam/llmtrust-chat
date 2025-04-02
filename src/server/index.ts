import { conversationRouter } from "./routers/conversations";
import { router } from "./trpc";

export const appRouter = router({
  conversation: conversationRouter,
});

export type AppRouter = typeof appRouter;
