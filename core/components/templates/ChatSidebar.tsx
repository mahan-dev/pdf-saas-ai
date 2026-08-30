"use client";
import Link from "next/link";

import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { DrizzleChat } from "@/core/lib/db/schema";
import { cn } from "@/core/lib/utils";

interface ChatProps {
  chats: DrizzleChat[];
  chatId: number;
}

const ChatSidebar = ({ chats, chatId }: ChatProps) => {
  return (
    <section className="flex flex-1  max-w-xs">
      <div className="w-full p-3 h-screen bg-gray-900 overflow-auto">
        <Link className="w-full inline-block mb-3" href="/">
          <Button
            className={cn(
              "w-full py-5 border border-dashed  border-white  cursor-pointer",
            )}
          >
            New Chat
            <PlusCircle className="w-4 h-4" />
          </Button>
        </Link>

        <div className="flex flex-col gap-1">
          {chats?.map((item) => (
            <Link href={`/chat/${item.id}`} key={item.id}>
              <p
                className={`
              text-white break-all truncate 
              ${item.id === chatId ? "hover:bg-none" : "transition-all duration-150 rounded-md p-2 hover:bg-zinc-600 "}
            
              ${item.id === chatId ? "bg-blue-700 rounded-md p-2 " : ""}
                `}
              >
                {item.pdfName}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex gap-2.5 text-slate-400 p-3 absolute bottom-0 left-0">
          <span>Home</span>
          <span>Source</span>
        </div>
      </div>
    </section>
  );
};

export default ChatSidebar;
