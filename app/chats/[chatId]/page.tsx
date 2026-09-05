import { db } from "@/core/lib/db";
import { chats } from "@/core/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import ChatIdPage from "@/core/components/templates/ChatIdPage";

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatPage = async ({ params }: PageProps) => {
  const { chatId } = await params;
 

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const chatsDb = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!chatsDb) {
    return redirect("/");
  }

  const isChat = chatsDb.find((chat) => chat.id === chatId);
  if (!isChat) {
    return redirect("/");
  }

  return (
    <ChatIdPage isChat={isChat} chatsDb={chatsDb} chatId={chatId} />
  );
};

export default ChatPage;
