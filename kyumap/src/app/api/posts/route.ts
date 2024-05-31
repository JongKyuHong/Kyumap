import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";
import { NextResponse, NextRequest } from "next/server";
import getNextSequenceValue from "@/model/getNextSequenceValue";
import Redis from "ioredis";

const redis = new Redis();

export async function GET(
  req: NextRequest,
  { params }: { params: { pageParam: Number } }
) {
  await dbConnect();
  // console.log(req.nextUrl.searchParams.get("cursor"), "/api/posts/getparams");
  const cursor = req.nextUrl.searchParams.get("cursor");
  const limit = 5;

  let query = {};

  if (cursor) {
    query = { postId: { $gt: Number(cursor) } };
  }

  // console.log(cursor, query, "/api/posts/route.ts");
  try {
    const posts = await Post.find(query).sort({ postId: 1 }).limit(limit);
    // const posts = await Post.find({});
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
  } catch (err) {
    console.error("Database connection failed:", err);
    return NextResponse.json({ error: "Database connection failed" });
  }
  let reqBody;
  try {
    reqBody = await req.formData();
  } catch (err) {
    console.error("Failed to parse request body:", err);
    return NextResponse.json({ error: "Failed to parse request body" });
  }
  // console.log(reqBody, "api/posts/routes의 reqBody");
  const userEmail = reqBody.get("userEmail");
  const userImage = reqBody.get("userImage");
  const userName = reqBody.get("userName");
  const content = reqBody.get("content");

  let images = [];
  const imagesString = reqBody.get("images");
  if (imagesString) {
    try {
      images = JSON.parse(imagesString as string);
    } catch (err) {
      console.error("Failed to parse images JSON:", err);
      return NextResponse.json({ error: "Failed to parse images JSON" });
    }
  }

  const lockKey = "postIdLock";
  const lockTimeout = 3000; // 3 seconds

  try {
    const lock = await redis.set(lockKey, "locked", "PX", lockTimeout, "NX");
    if (!lock) {
      return NextResponse.json({ error: "Failed to acquire lock" });
    }

    let postId;
    try {
      postId = await getNextSequenceValue("postId");
    } catch (err) {
      console.error("Failed to get next sequence value:", err);
      return NextResponse.json({ error: "Failed to get next sequence value" });
    }

    const data = {
      postId: postId,
      User: {
        email: userEmail,
        image: userImage,
        nickname: userName,
      },
      content: content,
      Images: images,
      Hearts: [],
      Comments: [],
      _count: {
        Hearts: 0,
        Comments: 0,
      },
      hashTag: [],
    };

    const posts = await Post.create(data);
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  } finally {
    await redis.del(lockKey);
  }
}
