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

  let query = {};

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
