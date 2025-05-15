import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
  } catch (err) {
    console.error("Database connection failed:", err);
    return NextResponse.json({ error: "Database connection failed" });
  }

  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = 5;

  let query: any = { reels: true };

  // 일찍 생성된 데이터 기준으로 + 영상인 경우
  if (cursor) {
    query.createdAt = { $lt: new Date(cursor) };
  }

  try {
    const posts = await Post.find(query).sort({ createdAt: -1 }).limit(limit);
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
