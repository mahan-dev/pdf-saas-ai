import { db } from "@/core/lib/db";
import { messages } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (req: Request) => {
  const { chatId } = await req.json();
  console.log("server side is running");
  const _messages = await db
    .select()
    .from(messages)
    .where(eq(messages.chatId, chatId));

  console.log(_messages, "messages arrived");

  return NextResponse.json(_messages);
};
