"use client";
import Link from "next/link";

import { Button } from "@/core/components/ui/button";
import { PlusCircle, Trash2 } from "lucide-react";
import { DrizzleChat } from "@/core/lib/db/schema";
import { cn } from "@/core/lib/utils";
import axios from "axios";
import { useState } from "react";
import { redirect } from "next/navigation";

interface ChatProps {
  chats: DrizzleChat[];
  chatId: number;
  isPro: boolean;
}

const ChatSidebar = ({ chats, chatId, isPro }: ChatProps) => {
  const [loading, setLoading] = useState<boolean>(false);

  const subscriptionHandler = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/stripe");
      window.location.href = data.url;
    } catch (error) {
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  const removeChat = async (id: number) => {
    const { status } = await axios.patch("/api/delete-chat", { id });
    if (status === 201) redirect("/");
  };

  return (
    <section className="flex  flex-1  max-w-xs">
      <div className="w-full flex flex-col p-3 h-screen bg-gray-900 overflow-auto">
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

        <div className="w-full flex flex-col gap-1">
          {chats?.map((item) => (
            <div key={item.id}>
              <p
                className={`
                  flex justify-between gap-2 items-center text-white break-all truncate cursor-pointer
              ${item.id === chatId ? "hover:bg-none" : "transition-all duration-150 rounded-md p-2 hover:bg-zinc-600 "}
            
              ${item.id === chatId ? "bg-blue-700 rounded-md p-2 " : ""}
                `}
              >
                <span
                  onClick={() => {
                    redirect(`/chats/${item.id}`);
                  }}
                >
                  {item.pdfName.substring(0, 15)}
                </span>
                <Button
                  onClick={() => removeChat(item.id)}
                  className="p-2 cursor-pointer"
                >
                  <Trash2 />
                </Button>
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col mt-auto gap-2 text-slate-400 p-3 ">
          <div className="flex gap-2.5">
            <span>Home</span>
            <span>Source</span>
          </div>

          <Button
            className="w-fit bg-slate-800 text-white rounded-md  p-2 cursor-pointer "
            onClick={subscriptionHandler}
            disabled={loading}
          >
            {isPro ? "Manage subscription" : "Upgrade To Pro"}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ChatSidebar;
