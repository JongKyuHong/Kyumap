import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "../../../../model/Comment";

type Props = {
  params: {
    rootCommentId: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const rootId = params.rootCommentId;
    const comments = await Comment.find({ threadId: rootId }).sort({
      createdAt: 1,
    });

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json({
      error: "서버 오류가 발생하였습니다.",
      status: 500,
    });
  }
}

