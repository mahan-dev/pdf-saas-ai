import { db } from "@/core/lib/db";
import { chats } from "@/core/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  const { id } = await req.json();
  try {
    const { userId } = await auth();
    console.log("🎸 ~ route.ts:10 -> userId: ", userId);

    if (!userId)
      return NextResponse.json(
        { status: "Error", error: "User not found" },
        { status: 404 },
      );

    const res = await db
      .delete(chats)
      .where(and(eq(chats.id, id), eq(chats.userId, userId)));

    console.log("🎵 ~ route.ts:19 -> res: ", res);

    return NextResponse.json(
      { status: "Success", message: "Chat is deleted" },
      { status: 201 },
    );
  } catch (error) {
    console.log("error", error);
    return NextResponse.json(
      { status: "Failed", error: "error" },
      { status: 500 },
    );
  }
};
