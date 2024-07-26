import { RouteObject, redirect } from "react-router-dom";
import { context } from "../lib";
import { Platform, UserWithPubKey } from "@simplito/privmx-endpoint-web-sdk";
import env from "../env";

export const sendMessageAction: RouteObject["action"] = async ({
  params,
  request,
}) => {
  const chatId = params.chatID as string;
  if (!chatId) {
    console.error("loader error", "chatID not found", {
      chat: params.chatID,
    });

    throw Error("Chat not found");
  }
  const formData = await request.formData();
  const entries = Object.fromEntries(formData) as { message: string };

  await context.thread(chatId).sendMessage({
    data: { content: entries.message },
    privateMeta: {},
    publicMeta: {},
  });
  return { ok: true };
};

export const editChatAction: RouteObject["action"] = async ({
  request,
  params,
}) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();
  const currentVersion = parseInt(
    formData.get("currentVersion")?.toString() || "1"
  );

  const chatId = params.chatID;

  if (!name || !currentVersion) {
    throw new Error("Invalid params");
  }

  if (!chatId) {
    console.error("chat not found", chatId);
    throw new Error("Chat not found");
  }

  const users = Array.from(formData.entries())
    .filter(([key]) => key === "users")
    .map(([, value]) => env.USERS.find((x) => x.userId === value))
    .filter((x) => x !== undefined) as UserWithPubKey[];

  await context.thread(chatId).update({
    version: currentVersion,
    managers: users,
    title: name,
    users,
  });
  return redirect(`/${chatId}`);
};

export const createThreadAction: RouteObject["action"] = async ({
  request,
}) => {
  const formData = await request.formData();
  const name = formData.get("name")?.toString();

  if (!name) {
    return { error: "Name required" };
  }

  const users = Array.from(formData.entries())
    .filter(([key]) => key === "users")
    .map(([, value]) => env.USERS.find((x) => x.userId === value))
    .filter((x) => x !== undefined) as UserWithPubKey[];

  const newThread = await context.threads.new({
    users: users,
    managers: users,
    name: name,
  });

  return redirect(`/${newThread}`);
};

export const signInAction: RouteObject["action"] = async ({ request }) => {
  const formData = await request.formData();
  const entries = Object.fromEntries(formData) as {
    userId: string;
    privateKey: string;
  };

  const connection = await Platform.connect({
    platformUrl: env.API_URL,
    privKey: entries.privateKey || env.PRIVATE_KEY,
    solutionId: env.SOLUTION_ID,
  });

  connection.startEventLoop({ dispatchDecodedMessageEvent: true });
  await connection.channel("thread2");
  return redirect("/");
};
