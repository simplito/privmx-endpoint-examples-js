import { Form, useNavigation } from "react-router-dom";
import env from "../env";
import { Asterisk, Loader } from "lucide-react";
import { useCurrentUser } from "../logic/useCurrentUser";

export function ChatCreate() {
  const navigation = useNavigation();

  const user = useCurrentUser();

  return (
    <div className="center flex-grow w-full">
      <div className="paper p-box-lg min-w-1/3">
        <h1 className="text-2xl -mt-1 mb-box-lg">New Chat</h1>
        <Form action="/new-chat" method="post">
          <div className="mb-4">
            <label className="flex gap-0.5 relative" htmlFor="name">
              Name
              <span className="relative inline-flex rounded-full  text-rose-400">
                <Asterisk size={14} />
              </span>
            </label>
            <input
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
            Create Chat
          </button>
        </Form>
      </div>
    </div>
  );
}
