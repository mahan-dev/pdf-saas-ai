import React from "react";
import ChatSidebar from "@/core/components/templates/ChatSidebar";
import PDFViewer from "@/core/components/templates/PDFViewer";
import { DrizzleChat } from "@/core/lib/db/schema";

interface ChatProps {
  isChat: DrizzleChat;
  chatsDb: DrizzleChat[];
  chatId: number;
}

const ChatIdPage = ({ isChat, chatsDb, chatId }: ChatProps) => {
  return (
    <section className="flex max-h-screen ">
      <div className="flex w-full max-h-screen">
        {/* sideBar */}

        <ChatSidebar chats={chatsDb} chatId={chatId} />

        {/* PDF Viewer */}

        <PDFViewer pdfUrl={isChat?.pdfUrl || ""} />

        {/* chatBOt */}
        <div className="flex flex-3 p-3  border-l-slate-200 overflow-auto">
          <div>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Dicta
            praesentium impedit cum sequi suscipit recusandae eveniet.
            Reprehenderit consectetur non maiores doloribus iste inventore,
            ratione fuga nemo cumque blanditiis qui atque?
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChatIdPage;
