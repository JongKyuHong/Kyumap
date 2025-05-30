import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Post from "../../../../model/Post";

type Props = {
  params: {
    postId: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const postId = params.postId;
    // 게시글 불러오기
    const post = await Post.findOne({ postId: postId });
    return NextResponse.json(post);
  } catch (error) {
    return NextResponse.json({
      error: "서버 오류가 발생하였습니다.",
      status: 500,
    });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const postId = Number(params.postId);
    const userEmail = await req.json();
    // 삭제
    const post = await Post.findOneAndDelete({
      postId: postId,
      userEmail: userEmail,
    });
    if (!post) {
      return NextResponse.json({
        error: "게시글을 찾을 수 없거나 권한이 없습니다.",
        status: 400,
      });
    }

    return NextResponse.json({
      message: "게시글이 삭제되었습니다.",
      status: 200,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      error: "서버 오류가 발생하였습니다.",
      status: 500,
    });
  }
}
