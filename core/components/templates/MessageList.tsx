import { UIMessage } from "ai";

interface MessageProps {
  messages: UIMessage[];
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
            {item.parts
              .filter((type) => type.type === "text")
              .map((text) => (
                <span key={item.id}>{text.text}</span>
              ))}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
