import { DrizzleMessages } from "@/core/lib/db/schema";
import { UIMessage } from "ai";


type MyUiMessages = UIMessage & {
  content: string;
};

interface MessageProps {
  messages: MyUiMessages[]
}

const MessageList = ({ messages }: MessageProps) => {
  console.log(messages);

  return (
    <div className="flex flex-col gap-2">
      {messages.map((item) => (
        <div className="w-full" key={item.id}>
          <p
            className={`w-fit flex p-2 rounded-md  ${item.role === "assistant" && " border ring-0"} ${item.role === "user" && "flex text-white bg-blue-600 justify-self-end"}`}
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
