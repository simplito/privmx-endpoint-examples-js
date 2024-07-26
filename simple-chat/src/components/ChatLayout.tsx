import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { Platform } from "@simplito/privmx-endpoint-web-sdk";
import { useCurrentUser } from "../logic/useCurrentUser";
import { LogOut, Plus } from "lucide-react";
import { useChatList } from "../logic/useChatList";

export function ChatLayout() {
  const chatsList = useChatList();
  const { chatID } = useParams();

  const user = useCurrentUser();
  const navigate = useNavigate();

  async function logOut() {
    const connection = Platform.connection();
    await connection.disconnect();
    navigate("/sign-in");
  }

  if (chatsList.status === "loading") {
    return <div>loading</div>;
  }

  if (chatsList.status === "error") {
    return <div>error</div>;
  }

  return (
    <div className="flex flex-row h-screen gap-4 md:gap-8 p-4 md:p-8">
      <div className="flex flex-col gap-4 md:gap-8 flex-initial flex-shrink-0 w-52 md:w-96 ">
        <div className="paper p-box flex-grow flex flex-col min-h-0">
          <h3 className="mb-2 text-neutral-500 font-normal">Chat Rooms</h3>
          <div className="flex flex-col gap-2 overflow-y-auto min-h-0">
            {chatsList.chats.map((chat) => (
              <Link
                key={chat.threadId}
                className={`w-full bg-neutral-100 px-4 py-2 rounded-md cursor-pointer transition-all ease-in duration-400  hover:bg-neutral-200 ${
                  chatID === chat.threadId && "bg-neutral-200"
                }`}
                to={`/${chat.threadId}`}
              >
                <p>{chat.data.title}</p>
              </Link>
            ))}
          </div>
        </div>
        <div>
          <Link to="/new-chat">
            <button className="group rounded-lg p-7 text-lg">
              <Plus />
              New Chat
            </button>
          </Link>
        </div>
        <div className="paper p-box group flex-initial ">
          <div className="bg-neutral-300 size-6 rounded-full"></div>
          {user.userId ? (
            <p className="text-md">{user.userId}</p>
          ) : (
            <div className="h-4 w-[20ch] animate-pulse bg-neutral-200" />
          )}
          <div
            onClick={logOut}
            className="ml-auto p-2 cursor-pointer hover:bg-neutral-200 rounded-lg"
          >
            <LogOut size={16} />
          </div>
        </div>
      </div>
      <div className=" flex flex-col gap-4 md:gap-8 flex-grow rounded-lg">
        <Outlet />
      </div>
    </div>
  );
}
