import ChatSidebar from "@/core/components/templates/ChatSidebar";
import PDFViewer from "@/core/components/templates/PDFViewer";
import { db } from "@/core/lib/db";
import { chats } from "@/core/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

interface PageProps {
  params: Promise<{
    chatId: string;
  }>;
}

const ChatIdPage = async ({ params }: PageProps) => {
  const { chatId } = await params;
  if (isNaN(+chatId)) {
    redirect("/");
    // throw new Error("param is not allowed");
  }

  const { userId } = await auth();
  if (!userId) {
    return redirect("/sign-in");
  }

  const chatsDb = await db.select().from(chats).where(eq(chats.userId, userId));
  if (!chatsDb) {
    return redirect("/");
  }

  const isChat = chatsDb.find((chat) => chat.id === +chatId);
  if (!isChat) {
    return redirect("/");
  }

  return (
    <section className="flex max-h-screen overflow-scroll">
      <div className="flex w-full max-h-screen overflow-scroll">
        {/* sideBar */}

        <div className="flex flex-1 max-w-xs">
          <ChatSidebar chats={chatsDb} chatId={chatId} />
        </div>

        {/* PDF Viewer */}
        <div className="flex max-h-screen p-4 overflow-scroll flex-5 ">
          <PDFViewer pdfUrl={isChat?.pdfUrl || ""} />
        </div>

        {/* chatBOt */}
        <div className="flex flex-3  border-l-slate-200">
          <div>something as div</div>
        </div>
      </div>
    </section>
  );
};

export default ChatIdPage;
