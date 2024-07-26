import { Platform } from "@simplito/privmx-endpoint-web-sdk";
import { ChatMessage, context } from "../lib";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 60;

export function useChatMessages(chatID: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<
    "loading" | "fetching" | "error" | "idle"
  >("loading");
  const [error, setError] = useState<null | string>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  useEffect(() => {
    setMessages([]);
    setHasMoreMessages(false);
    setCurrentPage(0);
  }, [chatID]);

  const loadMessages = useCallback(async () => {
    setStatus("loading");
    try {
      const messageList = await context
        .thread(chatID)
        .getMessages(0, { sort: "desc", pageSize: PAGE_SIZE });

      const chatMessages = messageList.messages.reverse() as ChatMessage[];

      setHasMoreMessages(messageList.messagesTotal > PAGE_SIZE);

      setMessages(chatMessages);
      setStatus("idle");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setStatus("error");
    }
  }, [chatID]);

  const loadNextPage = useCallback(async () => {
    if (!hasMoreMessages) return;

    setStatus("fetching");
    const nextPage = currentPage + 1;

    const messageList = await context
      .thread(chatID)
      .getMessages(nextPage, { sort: "desc", pageSize: PAGE_SIZE });

    setHasMoreMessages(messageList.messagesTotal > PAGE_SIZE * (nextPage + 1));

    const chatMessages = messageList.messages.reverse() as ChatMessage[];

    setMessages((currentMessages) => [...chatMessages, ...currentMessages]);
    setCurrentPage(nextPage);
  }, [currentPage, chatID, hasMoreMessages]);

  const subscribedForMessages = useRef<boolean>(false);

  const subscribeForMessages = useCallback(async () => {
    if (subscribedForMessages.current) return;

    const connection = Platform.connection();
    const channel = await connection.channel(`thread2/${chatID}/messages`);
    channel.on({
      event: "decodedNewMessage",
      callback(payload) {
        setMessages((currentMessages) => {
          const newMessages = payload.data as ChatMessage;

          const message: ChatMessage = {
            info: newMessages.info,
            data: newMessages.data,
            privateMeta: {},
            publicMeta: {},
          };

          return [...currentMessages, message];
        });
      },
    });

    subscribedForMessages.current = true;
  }, [chatID]);

  useEffect(() => {
    loadMessages();
    subscribeForMessages();
  }, [loadMessages, subscribeForMessages, chatID]);

  if (status === "error") {
    return { status: "error", error } as const;
  } else if (status === "loading") {
    return { status: "loading", messages: [], loadNextPage } as const;
  } else {
    return { status: "idle", messages, loadNextPage } as const;
  }
}
