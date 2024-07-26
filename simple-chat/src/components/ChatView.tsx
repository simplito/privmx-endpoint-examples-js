import { Outlet, useNavigate } from "react-router-dom";
import { context } from "../lib";
import * as Menubar from "@radix-ui/react-menubar";
import { MessageCircle, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useChatPathLoaderData } from "../App";

export function ChatView() {
  const chat = useChatPathLoaderData();

  const chatId = chat.threadId || "";
  const navigate = useNavigate();
  const [deleteDialog, setDeleteDialog] = useState<boolean>(false);
  return (
    <>
      <div className="paper p-box group flex-initial flex-shrink-0">
        <MessageCircle size={20} />
        <h2 className="text-xl flex-grow">{chat.data.title}</h2>
        <div className="group gap-1">
          {chat.users.map((user) => (
            <div
              key={user}
              className="border border-neutral-300 size-8 rounded-full center text-sm"
            >
              {user[0]}
            </div>
          ))}
        </div>
        <div>
          <Menubar.Root className=" p-2 rounded-md">
            <Menubar.Menu>
              <Menubar.Trigger className="p-2 outline-none select-none">
                <EllipsisVertical size={16} />
              </Menubar.Trigger>
              <Menubar.Portal>
                <Menubar.Content
                  className="bg-neutral-50 min-w-28 shadow rounded-md p-1.5 mt-2 [animation-duration:_400ms] [animation-timing-function:_cubic-bezier(0.16,_1,_0.3,_1)] will-change-[transform,opacity]"
                  align="end"
                >
                  {deleteDialog ? (
                    <div className="p-2 flex flex-col gap-2">
                      <p>Are you sure about that</p>
                      <div className="group">
                        <button
                          onClick={async () => {
                            context.thread(chatId).delete();
                            navigate("/");
                          }}
                        >
                          Delete
                        </button>
                        <button>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Menubar.Item
                        onClick={() => navigate(`/${chatId}/edit`)}
                        className="group text-sm px-3 py-1.5 rounded relative select-none data-[highlighted]:text-opacity-90 data-[highlighted]:bg-neutral-200"
                      >
                        Edit
                      </Menubar.Item>
                      <Menubar.Item
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setDeleteDialog(true);
                        }}
                        className="group text-sm px-3 py-1.5 rounded relative select-none data-[highlighted]:text-rose-800/90 data-[highlighted]:bg-rose-200"
                      >
                        Delete
                      </Menubar.Item>
                    </>
                  )}
                </Menubar.Content>
              </Menubar.Portal>
            </Menubar.Menu>
          </Menubar.Root>
        </div>
      </div>
      <Outlet />
    </>
  );
}
