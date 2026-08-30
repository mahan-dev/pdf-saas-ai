import { db } from "@/core/lib/db";
import { messages } from "@/core/lib/db/schema";
import { UIMessage } from "ai";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));

  const convertedMessages: UIMessage[] = _messages.map((message) => ({
    id: String(message.id),
    role: message.role === "system" ? "assistant" : message.role,

    parts: [
      {
        type: "text",
        text: message.content,
      },
    ],
  }));

  return NextResponse.json(convertedMessages);
};
