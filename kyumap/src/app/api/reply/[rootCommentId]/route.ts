import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "../../../../model/Comment";
import { ObjectId } from "mongodb";

type Props = {
  params: {
    rootCommentId: string;
  };
};

// rootId가 threadId인 모든 댓글 정보를 가져온다.
export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const rootId = new ObjectId(params.rootCommentId);
    const comments = await Comment.find({
      threadId: rootId,
      _id: { $ne: rootId },
    }).sort({
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
