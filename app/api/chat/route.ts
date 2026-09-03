export const runtime = "nodejs";

import {
  streamText,
  convertToModelMessages,
  createUIMessageStreamResponse,
  toUIMessageStream,
  UIMessage,
} from "ai";
import { createGroq } from "@ai-sdk/groq";
import { NextResponse } from "next/server";
import { db } from "@/core/lib/db";
import { chats, messages as _messages } from "@/core/lib/db/schema";
import { eq } from "drizzle-orm";
import { getContext } from "@/core/lib/getContext";

const API_KEY = process.env.GROQ_AI_API_KEY as string;

const groq = createGroq({
  apiKey: API_KEY,
});

export const POST = async (req: Request) => {
  const { messages, chatId } = await req.json();

  const _chats = await db.select().from(chats).where(eq(chats.id, chatId));
  if (_chats.length != 1)
    return NextResponse.json(
      { status: "Failed", error: "Chats were not found" },
      { status: 404 },
    );

  const fileKey = _chats[0].fileKey;

  const lastMessages = messages[messages.length - 1];

  const context = await getContext(
    lastMessages.parts[0].text as string,
    fileKey,
  );

  const instructions = `
  AI assistant is a brand new, powerful, human-like artificial intelligence.
  
  The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.
  
  AI is a well-behaved and well-mannered individual.
  
  AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.
  
  AI assistant is a big fan of Pinecone and Vercel.
  
  START CONTEXT BLOCK
  
  ${context}
  
  END OF CONTEXT BLOCK
  
  AI assistant will take into account any CONTEXT BLOCK that is provided in a conversation.
  
  If the context does not provide the answer to question, the AI assistant will say:
  "I'm sorry, but I don't know the answer to that question".
  
  AI assistant will not apologize for previous responses, but instead will indicate new information was gained.
  
  AI assistant will not invent anything that is not drawn directly from the context.
  `;

  type MixedMessage = UIMessage & {
    role: "user" | "system";
  };

  try {
    const response = streamText({
      model: groq("openai/gpt-oss-120b"),
      temperature: 0.7,
      maxOutputTokens: 300,
      instructions,

      messages: await convertToModelMessages(
        messages.filter((message: MixedMessage) => message.role === "user"),
      ),

      onEnd: async ({ text }) => {
        await db.insert(_messages).values({
          chatId,
          content: lastMessages.parts[0].text,
          role: "user",
        });

        await db.insert(_messages).values({
          chatId,
          content: text,
          role: "system",
        });
      },
    });

    return createUIMessageStreamResponse({
      stream: toUIMessageStream(response),
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json({ status: "Failed" }, { status: 500 });
  }
};
