import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, res: Response) => {
  try {
    const body = await req.json();
    const { id, path } = body;

    return NextResponse.json(
      { status: "Success", message: "sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { status: "Failed", error: "server error" },
      { status: 500 },
    );
  }
};
