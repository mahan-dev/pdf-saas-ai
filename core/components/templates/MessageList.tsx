import { UIMessage } from "ai";
import { Loader2 } from "lucide-react";

type MyUiMessages = UIMessage & {
  content: string;
};

interface MessageProps {
  messages: MyUiMessages[];
  isLoading: boolean;
}

const MessageList = ({ messages, isLoading }: MessageProps) => {
  if (isLoading)
    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin">
        <Loader2 />
      </div>
    );

  return (
    <div className="flex flex-col gap-2">
      {messages.map((item) => (
        <div className="w-full" key={item.id}>
          <p
            className={`w-fit border  flex p-2 rounded-md  ${item.role === "system" && " border ring-0"} ${item.role === "user" && "flex text-white bg-blue-600 justify-self-end"}`}
          >
            {item.parts &&
              item.parts
                .filter((type) => type.type === "text")
                .map((text) => <span key={item.id}>{text.text}</span>)}

            {item.content}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
