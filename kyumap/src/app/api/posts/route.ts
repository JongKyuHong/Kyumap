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
  const isHideInfo = reqBody.get("isHideInfo") === "true"; // 문자열로 받은 값 다시 boolean으로 변환
  const isHideComments = reqBody.get("isHideComments") === "true";
  const reels = reqBody.get("reels") === "true";

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

  const altTextsString = reqBody.get("altTexts");

  let altTexts = [];
  if (altTextsString) {
    altTexts = JSON.parse(altTextsString as string);
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
      altTexts: altTexts,
      Hearts: [],
      Comments: [],
      hideLikesAndViews: isHideInfo,
      hideComments: isHideComments,
      reels: reels,
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
