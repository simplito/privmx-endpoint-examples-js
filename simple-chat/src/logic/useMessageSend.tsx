import { context } from "../lib";
import { useCallback } from "react";

export function useMessageSend(chatId: string) {
  const sendMessage = useCallback(
    async (message: string) => {
      if (!chatId) {
        console.error("loader error", "chatID not found", {
          chat: chatId,
        });
        throw Error("Chat not found");
      }
      await context.thread(chatId).sendMessage({
        data: { content: message },
        privateMeta: {},
        publicMeta: {},
      });
      return { ok: true };
    },
    [chatId]
  );

  return { sendMessage };
}
