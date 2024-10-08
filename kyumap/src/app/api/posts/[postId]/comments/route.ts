import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Comment from "@/model/Comment";
import Post from "@/model/Post";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  const postId = params.postId;
  // 댓글 받아오기
  const allComments = await Comment.find({ postId: postId });
  return NextResponse.json(allComments);
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const postId = params.postId;
    const data = await req.json();

    // 댓글 데이터 구성
    const inputData = {
      postId: postId,
      userNickname: data.User.name,
      userEmail: data.User.email,
      content: data.comment,
    };
    // 댓글 생성
    const comment = await Comment.create(inputData);

    // post에 _count늘려주기
    const post = await Post.findOneAndUpdate(
      { postId: postId },
      { $inc: { "_count.Comments": 1 } },
      { new: true }
    );

    return NextResponse.json({ comment, post });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      status: 500,
    });
  }
}
