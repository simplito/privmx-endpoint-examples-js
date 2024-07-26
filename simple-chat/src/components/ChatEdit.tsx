import { Form, useNavigation } from "react-router-dom";
import env from "../env";
import { Asterisk, Loader } from "lucide-react";
import { useCurrentUser } from "../logic/useCurrentUser";
import { useChatPathLoaderData } from "../App";

export function ChatEdit() {
  const navigation = useNavigation();

  const user = useCurrentUser();
  const chat = useChatPathLoaderData();

  return (
    <div className="center flex-grow w-full">
      <div className="paper p-box-lg min-w-1/3">
        <h1 className="text-2xl -mt-1 mb-box-lg">Edit Chat</h1>
        <Form method="patch">
          <input type="hidden" name="currentVersion" value={chat.version} />
          <div className="mb-4">
            <label className="flex gap-0.5 relative" htmlFor="name">
              New Name
              <span className="relative inline-flex rounded-full  text-rose-400">
                <Asterisk size={14} />
              </span>
            </label>
            <input
              defaultValue={chat.data.title}
              required
              type="text"
              name="name"
              id="name"
              className="min-w-[40ch]   "
            />
          </div>
          <div className="mb-box-lg">
            <p className="label">Members</p>
            <div className="flex flex-col gap-2">
              {env.USERS.map((x) => {
                if (x.userId === user.userId) {
                  return (
                    <input
                      key={x.pubKey}
                      type="checkbox"
                      name="users"
                      value={x.userId}
                      id={x.userId}
                      defaultChecked={true}
                      hidden
                    />
                  );
                }
                return (
                  <label
                    htmlFor={x.userId}
                    key={x.pubKey}
                    className=" checkbox-card group px-2 py-1.5 border border-neutral-400 rounded "
                  >
                    <input
                      type="checkbox"
                      name="users"
                      value={x.userId}
                      id={x.userId}
                      defaultChecked={
                        chat.users.findIndex(
                          (chatUser) => chatUser === x.userId
                        ) !== -1
                      }
                    />
                    <span>{x.userId}</span>
                  </label>
                );
              })}
            </div>{" "}
          </div>
          <button className="group">
            {navigation.state !== "idle" && (
              <Loader className="animate-spin size-4" />
            )}
            Edit Chat
          </button>
        </Form>
      </div>
    </div>
  );
}
