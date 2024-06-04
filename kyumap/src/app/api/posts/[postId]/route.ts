import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../model/Post";

type Props = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  const postId = params.postId;
  //   const postId = req.nextUrl.searchParams.get("postId");
  console.log(postId, "/api/posts/[postId] postId");
  const post = await Post.findOne({ postId: postId });
  console.log(post, "/api 결과 post");
  return NextResponse.json(post);
}
