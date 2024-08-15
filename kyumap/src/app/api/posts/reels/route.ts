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

  // 초기 커서는 0, 그 다음은 가장 마지막 postId
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = 5;

  let query = {};

  // postId보다 큰 데이터를 한번에 5개 추려서 가져옴
  if (cursor) {
    query = { postId: { $gt: Number(cursor) }, reels: true };
  }

  try {
    const posts = await Post.find(query).sort({ postId: 1 }).limit(limit);
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}
