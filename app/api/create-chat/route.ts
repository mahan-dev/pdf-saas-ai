import { CreateChatInput } from "@/core/helper/dropHandler";
import { db } from "@/core/lib/db";
import { chats } from "@/core/lib/db/schema";
import { loadSupabaseIntoPinecone } from "@/core/lib/pinecone";
import { getSupabaseUrl } from "@/core/lib/supabaseServer";
import { auth } from "@clerk/nextjs/server";

import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json(
      { status: "Failed", error: "Unauthorize" },
      { status: 401 },
    );
  }

  try {
    const body = await req.json();
    const { id, path, fileName } = body as CreateChatInput;
    console.log("🛬 ~ route.ts:6 -> id: ", id);
    console.log("🔥 ~ route.ts:6 -> path: ", path);
    await loadSupabaseIntoPinecone(path);

    const pdfUrl = getSupabaseUrl(path);
    if (!pdfUrl)
      return NextResponse.json(
        { status: "Failed", error: "Couldn't generate pdfUrl link" },
        { status: 404 },
      );

    const chatsId = await db
      .insert(chats)
      .values({
        fileKey: path,
        pdfName: fileName,
        pdfUrl,
        userId,
      })
      .returning({
        insertId: chats.id,
      });

    return NextResponse.json(
      {
        status: "Success",
        message: "successfully done",
        chat_id: chatsId[0].insertId,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { status: "Failed", error: "server error" },
      { status: 500 },
    );
  }
};
