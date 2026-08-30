"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/core/components/ui/input";

import { useChat } from "@ai-sdk/react";
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import MessageList from "./MessageList";

import { DefaultChatTransport, UIMessage } from "ai";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface ChatProps {
  chatId: number;
}

type ChatMessage = UIMessage & {
  chatId: number;
  content: string;
  createdAt: string;
};

const ChatBot = ({ chatId }: ChatProps) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const { data } = await axios.post("/api/get-messages", {
        chatId,
      });
      return data;
    },
  });

  const [input, setInput] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const { messages, setMessages, sendMessage, status } = useChat<ChatMessage>({
    messages: data || [],
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: {
        chatId,
      },
    }),
  });

  useEffect(() => {
    if (data) {
      setMessages(data);
    }
  }, [data, setMessages]);

  const submitHandler = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput("");
  };

  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    if (!messageContainer) return;

    messageContainer.scrollTo({
      top: messageContainer.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  return (
    <div
      className="flex flex-3 border-l-slate-200 overflow-auto"
      id="message_container"
      ref={messageContainerRef}
    >
      <section className="w-full flex flex-col p-1 min-h-screen ">
        <h3 className="text-2xl font-bold sticky top-0 inset-x-0">Chat</h3>

        <MessageList messages={messages} />
        {status === "error" && (
          <div className="w-fit mt-2 p-1 bg-red-200  rounded-md text-red-500">
            An Error occurred
          </div>
        )}

        <form onSubmit={submitHandler}>
          <div className="flex my-4 gap-1">
            <Input
              value={input}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setInput(e.target.value)
              }
              placeholder="Ask any questions..."
            />
            <Button
              type="submit"
              className="bg-blue-600 cursor-pointer hover:opacity-80 hover:bg-blue-600"
            >
              <Send />
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ChatBot;
