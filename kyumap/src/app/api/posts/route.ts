import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";
import User from "@/model/User";
import { NextResponse, NextRequest } from "next/server";
import getNextSequenceValue from "@/model/getNextSequenceValue";

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

  try {
    const posts = await Post.find(query).sort({ postId: 1 }).limit(limit);
    return NextResponse.json(posts);
  } catch (err: any) {
    return NextResponse.json({ error: err.message });
  }
}

export async function POST(req: NextRequest) {
  console.log("Received POST request");
  try {
    await dbConnect();
    console.log("Database connected");
  } catch (err) {
    console.error("Database connection failed:", err);
    return NextResponse.json({ error: "Database connection failed" });
  }

  let reqBody;
  try {
    reqBody = await req.formData();
    console.log("Request body parsed");
  } catch (err) {
    console.error("Failed to parse request body:", err);
    return NextResponse.json({ error: "Failed to parse request body" });
  }

  const userEmail = reqBody.get("userEmail");
  const userImage = reqBody.get("userImage");
  const userName = reqBody.get("userName");
  const content = reqBody.get("content");
  const lat = reqBody.get("lat");
  const lng = reqBody.get("lng");
  const isHideInfo = reqBody.get("isHideInfo") === "true";
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

  let postId;
  try {
    postId = await getNextSequenceValue("postId");
    console.log(`Generated postId: ${postId}`);
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
    position: {
      lat: lat,
      lng: lng,
    },
    _count: {
      Hearts: 0,
      Comments: 0,
    },
    hashTag: [],
  };

  try {
    await User.findOneAndUpdate(
      { email: userEmail },
      { $inc: { "_count.posts": 1 } },
      { new: true }
    );
    const post = await Post.create(data);
    console.log(`Post created with postId: ${post.postId}`);
    return NextResponse.json(post);
  } catch (err: any) {
    console.error("Failed to create post:", err);
    return NextResponse.json({ error: err.message });
  }
}
