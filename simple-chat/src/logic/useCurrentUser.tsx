import { Platform } from "@simplito/privmx-endpoint-web-sdk";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const userContext = createContext<{ userId: string }>({ userId: "" });

export const useCurrentUser = () => useContext(userContext);

export function CurrentUserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ userId: string }>({ userId: "" });

  useEffect(() => {
    const connection = Platform.connection();
    connection.getContexts().then((ctx) => {
      setUser({ userId: ctx.contexts[0].userId });
    });
  }, []);

  return <userContext.Provider value={user}>{children}</userContext.Provider>;
}
