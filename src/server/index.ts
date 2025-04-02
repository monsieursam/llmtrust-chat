import { conversationRouter } from "./routers/conversations";
import { messageRouter } from "./routers/messages";
import { creditsRouter } from "./routers/credits";
import { apiKeysRouter } from "./routers/apikeys";
import { router } from "./trpc";

export const appRouter = router({
  conversation: conversationRouter,
  message: messageRouter,
  credits: creditsRouter,
  apiKeys: apiKeysRouter,
});

export type AppRouter = typeof appRouter;
