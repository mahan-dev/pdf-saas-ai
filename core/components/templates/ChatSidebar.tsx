import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import { PlusCircle } from "lucide-react";
import { DrizzleChat } from "@/core/lib/db/schema";

interface ChatProps {
  chats: DrizzleChat[];
  chatId: string;
}

const ChatSidebar = ({ chats, chatId }: ChatProps) => {
  return (
    <div className="w-full p-2 h-screen bg-gray-900">
      <Link href="/">
        <Button className="w-full border border-dashed  border-white">
          New Chat
          <PlusCircle className="w-4 h-4" />
        </Button>
      </Link>

      <div className="flex ">
        {chats?.map((item) => (
          <Link href={"/"} key={item.id}>
            {item.fileKey}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;
