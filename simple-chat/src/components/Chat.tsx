import { useParams } from "react-router-dom";
import { Send } from "lucide-react";
import { FormEventHandler, useCallback, useEffect, useRef } from "react";
import { useMessageSend } from "../logic/useMessageSend";
import { useChatMessages } from "../logic/useChatMessages";
import { ChatMessage } from "../lib";

export function Chat() {
  const params = useParams();

  const chatId = params.chatID || "";

  const { sendMessage } = useMessageSend(chatId);

  const messageInput = useRef<HTMLInputElement>(null);
  const onSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    const isInputEmpty = messageInput.current?.value.trim() === "";
    if (messageInput.current && !isInputEmpty) {
      await sendMessage(messageInput.current?.value);
      messageInput.current.value = "";
    }
  };

  return (
    <>
      <div className="paper min-h-0 p-box flex-grow flex flex-col gap-2 ">
        <MessageView key={chatId} chatId={chatId} />

        <form
          onSubmit={onSubmit}
          className="flex flex-row gap-2 flex-initial w-full"
        >
          <input
            ref={messageInput}
            type="text"
            placeholder="Send new message..."
            name="message"
            className="w-full"
          />
          <button type="submit" className="size-8 p-0 center">
            <Send size={16} />
          </button>
        </form>
      </div>
    </>
  );
}

function MessageView({ chatId }: { chatId: string }) {
  const messageList = useChatMessages(chatId);

  if (messageList.status === "error") {
    return (
      <div className="flex-grow">
        <h1>Error</h1>
      </div>
    );
  }

  if (messageList.status === "loading") {
    return (
      <div className="flex-grow flex flex-col gap-4">
        <div className="w-full h-8 rounded bg-neutral-300"></div>
        <div className="w-full h-8 rounded bg-neutral-300"></div>
        <div className="w-full h-8 rounded bg-neutral-300"></div>
        <div className="w-full h-8 rounded bg-neutral-300"></div>
        <div className="w-full h-8 rounded bg-neutral-300"></div>
        <div className="w-full h-8 rounded bg-neutral-300"></div>
        <div className="w-full h-8 rounded bg-neutral-300"></div>
      </div>
    );
  }

  return (
    <MessageList
      messages={messageList.messages}
      onScrollToTop={messageList.loadNextPage}
    />
  );
}

function MessageList({
  messages,
  onScrollToTop,
}: {
  onScrollToTop: () => Promise<void>;
  messages: ChatMessage[];
}) {
  const listContainer = useRef<HTMLDivElement>(null);

  // const [isScrolledToBottom, setIsScrolledToBottom] = useState(true);
  const isScrolledToBottom = useRef(true);

  const previousListHeight = useRef<number>(
    listContainer.current?.scrollHeight || 0
  );
  const loadedNewPage = useRef<boolean>(false);

  useEffect(() => {
    previousListHeight.current = listContainer.current?.scrollHeight || 0;
  }, []);

  useEffect(() => {
    if (listContainer.current && loadedNewPage.current) {
      console.log("messages changed scrolling keeping scroll");
      console.log("previous", previousListHeight.current);
      console.log("new", listContainer.current?.scrollHeight);
      listContainer.current.scrollTop =
        listContainer.current?.scrollHeight - previousListHeight.current;

      previousListHeight.current = listContainer.current?.scrollHeight;
      loadedNewPage.current = false;
    }
  }, [messages.length]);

  const scrollToBottom = useCallback(() => {
    if (listContainer.current) {
      console.log("scrolling to bottom");
      listContainer.current.lastElementChild?.scrollIntoView({ block: "end" });
    }
  }, []);

  useEffect(() => {
    if (isScrolledToBottom.current) {
      console.log("scrolled to bottom");
      scrollToBottom();
    }
  }, [scrollToBottom, messages.length]);

  return (
    <>
      <div
        ref={listContainer}
        onScrollCapture={async (e) => {
          isScrolledToBottom.current =
            e.currentTarget.scrollTop +
              e.currentTarget.getBoundingClientRect().height >=
            e.currentTarget.scrollHeight - 20;

          if (e.currentTarget.scrollTop === 0) {
            await onScrollToTop();
            loadedNewPage.current = true;
          }
        }}
        className="flex-grow min-h-0 overflow-y-auto"
      >
        {messages.map((x) => (
          <div key={x.info.messageId} className="group items-start gap-3">
            <p>{x.info.author}</p>
            <p className="text-neutral-500 flex-grow">{x.data.content}</p>
            <span className=" flex-shrink-0">
              {new Date(x.info.createDate).toLocaleTimeString()}
            </span>
          </div>
        ))}
      </div>
    </>
  );
}
