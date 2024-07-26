import {
  RouterProvider,
  createBrowserRouter,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";
import { ChatEmpty, ChatLayout } from "./components";
import { CurrentUserProvider } from "./logic/useCurrentUser";
import { Platform } from "@simplito/privmx-endpoint-web-sdk";
import { ChatEdit } from "./components/ChatEdit";
import { ChatNotFound } from "./components/ChatNotFound";
import { Chat } from "./components/Chat";
import { ChatView } from "./components/ChatView";
import { ChatCreate } from "./components/ChatCreate";
import { SignIn } from "./components/SignIn";
import {
  createThreadAction,
  editChatAction,
  sendMessageAction,
  signInAction,
} from "./logic/actions";
import { chatPathLoader } from "./logic/loaders";

export function useChatPathLoaderData() {
  const loaderData = useRouteLoaderData("chat");
  const chat = loaderData as Awaited<ReturnType<typeof chatPathLoader>>;
  return chat;
}

const router = createBrowserRouter([
  {
    path: "/",
    loader() {
      if (Platform.status() === "disconnected") {
        return redirect("/sign-in");
      } else {
        return null;
      }
    },
    element: (
      <CurrentUserProvider>
        <ChatLayout />
      </CurrentUserProvider>
    ),
    children: [
      { path: "/", element: <ChatEmpty /> },
      {
        path: ":chatID",
        id: "chat",
        element: <ChatView />,
        children: [
          { index: true, element: <Chat /> },
          {
            path: "edit",
            action: editChatAction,
            element: <ChatEdit />,
          },
        ],
        action: sendMessageAction,
        loader: chatPathLoader,
        errorElement: <ChatNotFound />,
      },
      {
        path: "new-chat",
        action: createThreadAction,
        element: <ChatCreate />,
      },
    ],
  },
  {
    path: "/sign-in",
    action: signInAction,
    element: <SignIn />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
