import ChatSidebar from "@/core/components/templates/ChatSidebar";
import PDFViewer from "@/core/components/templates/PDFViewer";
import { DrizzleChat } from "@/core/lib/db/schema";
import ChatBot from "@/core/components/templates/ChatBot";
import { checkSubscription } from "@/core/utils/subscription";

interface ChatProps {
  isChat: DrizzleChat;
  chatsDb: DrizzleChat[];
  chatId: number;
}

const ChatIdPage = async ({ isChat, chatsDb, chatId }: ChatProps) => {
  const isPro = await checkSubscription();

  return (
    <section className="flex max-h-screen ">
      <div className="flex w-full max-h-screen">
        {/* sideBar */}

        <ChatSidebar chats={chatsDb} chatId={chatId} isPro={isPro} />

        {/* PDF Viewer */}

        <PDFViewer pdfUrl={isChat?.pdfUrl || ""} />

        {/* chatBOt */}

        <ChatBot chatId={chatId} />
      </div>
    </section>
  );
};

export default ChatIdPage;
