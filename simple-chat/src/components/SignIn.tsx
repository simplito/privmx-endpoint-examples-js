import { Form, useNavigation } from "react-router-dom";
import { Loader } from "lucide-react";

export function SignIn() {
  const navigation = useNavigation();

  return (
    <div className="w-svw h-svh center">
      <div className="paper h-5/6 w-5/6 p-box center gap-8">
        <Form action="/sign-in" method="post" className="flex flex-col gap-8">
          <h1 className="text-4xl text-left">Sign In</h1>
          <div>
            <label htmlFor="privateKey">Private Key</label>
            <input
              className="w-[56ch]"
              type="text"
              name="privateKey"
              id="privateKey"
            />
          </div>
          <button className="group">
            {navigation.state !== "idle" && (
              <Loader className="animate-spin size-4" />
            )}
            Sign In
          </button>
        </Form>
      </div>
    </div>
  );
}
