import { Platform, ServerInfo } from "@simplito/privmx-endpoint-web-sdk";
import env from "./env";

export const context = Platform.context(env.CONTEXT_ID);

export type ChatMessage = {
  info: ServerInfo;
  publicMeta: Record<string, never>;
  privateMeta: Record<string, never>;
  data: {
    content: string;
  };
};
