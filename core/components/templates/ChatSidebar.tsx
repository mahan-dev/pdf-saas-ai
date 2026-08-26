import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { DrizzleChat } from "@/core/lib/db/schema";

interface ChatProps {
  chats: DrizzleChat[];
  chatId: number;
}

const ChatSidebar = ({ chats, chatId }: ChatProps) => {
  return (
    <section className="flex flex-1  max-w-xs">
      <div className="w-full p-3 h-screen bg-gray-900 overflow-auto">
        <Link className="w-full inline-block mb-3" href="/">
          <Button className="w-full border border-dashed  border-white">
            New Chat
            <PlusCircle className="w-4 h-4" />
          </Button>
        </Link>

        <div className="flex flex-col">
          {chats?.map((item) => (
            <Link href={"/"} key={item.id}>
              <p className="text-red-500 break-all truncate ">{item.pdfName}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ChatSidebar;
