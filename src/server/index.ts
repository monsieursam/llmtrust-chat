import { conversationRouter } from "./routers/conversations";
import { messageRouter } from "./routers/messages";
import { router } from "./trpc";

export const appRouter = router({
  conversation: conversationRouter,
  message: messageRouter,
});

export type AppRouter = typeof appRouter;
