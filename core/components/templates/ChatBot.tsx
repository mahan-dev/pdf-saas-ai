"use client";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/core/components/ui/input";

import { useChat } from "@ai-sdk/react";
import { Send, X } from "lucide-react";
import { Button } from "../ui/button";
import MessageList from "./MessageList";
import { BotMessageSquare } from "lucide-react";

import { DefaultChatTransport, UIMessage } from "ai";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import styles from "@/core/components/templates/styles/chatBot/route.module.css";
import { cn } from "@/core/lib/utils";

interface ChatProps {
  chatId: number;
}

type ChatMessage = UIMessage & {
  chatId: number;
  content: string;
  createdAt: string;
};

const ChatBot = ({ chatId }: ChatProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const [input, setInput] = useState("");
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const botIconRef = useRef<HTMLDivElement>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["chat", chatId],
    queryFn: async () => {
      const { data } = await axios.post("/api/get-messages", {
        chatId,
      });
      return data;
    },
  });

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

  useEffect(() => {
    if (!isOpen) return;

    const clickHandler = (event: MouseEvent) => {
      const messageRef = messageContainerRef.current;
      const botRef = botIconRef.current;

      if (
        messageRef &&
        !messageRef.contains(event.target as Node) &&
        botRef &&
        !botRef.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", clickHandler);
    return () => removeEventListener("mousedown", clickHandler);
  }, [isOpen, setIsOpen]);

  return (
    <section className="flex-3 max-w-sm max-lg:flex-0">
      <div
        className="flex bg-white absolute top-2 right-2 p-2 border rounded-md shadow-md   lg:hidden"
        onClick={() => setIsOpen((prev) => !prev)}
        ref={botIconRef}
      >
        <BotMessageSquare />
      </div>

      {isOpen && <div className="fixed inset-0 bg-black/30"></div>}
      <div
        className={cn(
          styles.chat,

          isOpen
            ? "fixed inset-y-0 right-0 z-20 translate-x-0 "
            : "fixed inset-y-0 right-0 z-20 translate-x-full",

          "transition-transform duration-200",
          "lg:static lg:z-auto lg:w-auto lg:translate-x-0",
        )}
        id="message_container"
        ref={messageContainerRef}
      >
        <X
          className="w-8 h-8 text-black-300 p-1 absolute  top-3  right-6 z-20   border rounded-md cursor-pointer lg:hidden "
          onClick={() => setIsOpen((prev) => !prev)}
        />
        <section className="w-full  flex-col p-1 min-h-screen  ">
          <h3 className="text-2xl p-2 rounded-md font-bold sticky top-0 inset-x-0 backdrop-blur-2xl">
            Chat
          </h3>

          <MessageList messages={messages} isLoading={isLoading} />
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
    </section>
  );
};

export default ChatBot;
