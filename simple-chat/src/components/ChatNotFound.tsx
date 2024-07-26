import { useRouteError } from "react-router-dom";

export function ChatNotFound() {
  const error = useRouteError();

  console.error(error);

  return (
    <div className="paper text-rose-500 flex-grow flex flex-row gap-2 rounded-lg items-center justify-center">
      <h2 className="text-3xl">Error</h2>
    </div>
  );
}
