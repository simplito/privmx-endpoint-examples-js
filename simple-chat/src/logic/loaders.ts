import { Params } from "react-router-dom";
import { context } from "../lib";

export const chatPathLoader = async ({ params }: { params: Params }) => {
  if (!params.chatID) {
    console.error("loader error", "chatID not found", {
      chat: params.chatID,
    });

    throw Error("Chat not found");
  }
  const chat = await context.thread(params.chatID).info();

  if (!chat) {
    console.error("loader error", "thread not found", { chat });
    throw Error("Chat not found");
  }

  return chat;
};
