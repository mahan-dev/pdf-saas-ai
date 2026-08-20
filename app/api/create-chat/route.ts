import { loadS3IntoPinecone } from "@/core/lib/pinecone";
import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export const POST = async (req: NextRequest) => {
  try {
    const body = await req.json();
    const { id, path } = body;
    console.log("🛬 ~ route.ts:6 -> id: ", id);
    console.log("🔥 ~ route.ts:6 -> path: ", path);

    const pages = await loadS3IntoPinecone(path);

    return NextResponse.json({ pages }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { status: "Failed", error: "server error" },
      { status: 500 },
    );
  }
};
