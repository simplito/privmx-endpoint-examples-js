import { Platform, ThreadInfo } from "@simplito/privmx-endpoint-web-sdk";
import { context } from "../lib";
import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 60;

export function useChatList() {
  const [chats, setChats] = useState<ThreadInfo[]>([]);
  const [status, setStatus] = useState<
    "loading" | "fetching" | "error" | "idle"
  >("loading");
  const [error, setError] = useState<null | string>(null);

  const [currentPage, setCurrentPage] = useState(0);

  const [hasMoreChats, setHasMoreChats] = useState(true);

  const loadChats = useCallback(async () => {
    setStatus("loading");
    try {
      const threadsList = await context.threads.list();

      setHasMoreChats(threadsList.threadsTotal > PAGE_SIZE);
      setChats(threadsList.threads);

      setStatus("idle");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
      setStatus("error");
    }
  }, []);

  const loadNextPage = useCallback(async () => {
    if (!hasMoreChats) return;

    setStatus("fetching");
    const nextPage = currentPage + 1;

    const chatsList = await context.threads.list(nextPage);

    setHasMoreChats(chatsList.threadsTotal > PAGE_SIZE * (nextPage + 1));

    setChats((currentMessages) => [...currentMessages, ...chatsList.threads]);
    setCurrentPage(nextPage);
  }, [currentPage, hasMoreChats]);

  const subscribedForChats = useRef<boolean>(false);

  const subscribeForChats = useCallback(async () => {
    if (subscribedForChats.current) return;

    const connection = Platform.connection();
    const channel = await connection.channel(`thread2`);
    channel
      .on({
        event: "thread2Deleted",
        callback(payload) {
          setChats((current) =>
            current.filter((chat) => chat.threadId !== payload.data.threadId)
          );
        },
      })
      .on({
        event: "thread2Created",
        callback(payload) {
          setChats((current) => [...current, payload.data]);
        },
      })
      .on({
        event: "thread2Updated",
        callback(payload) {
          console.log(payload);
          setChats((current) =>
            current.map((currentChat) => {
              if (currentChat.threadId === payload.data.threadId) {
                return payload.data;
              } else {
                return currentChat;
              }
            })
          );
        },
      });

    subscribedForChats.current = true;
  }, []);

  useEffect(() => {
    loadChats();
    subscribeForChats();
  }, [loadChats, subscribeForChats]);

  if (status === "error") {
    return { status: "error", error } as const;
  } else if (status === "loading") {
    return { status: "loading", chats: [], loadNextPage } as const;
  } else {
    return { status: "idle", chats: chats, loadNextPage } as const;
  }
}
