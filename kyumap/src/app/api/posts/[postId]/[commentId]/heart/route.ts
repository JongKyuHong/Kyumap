import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/model/Comment";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";

type Props = {
  params: {
    postId: string;
    commentId: string;
  };
};

export async function POST(req: NextRequest, { params }: Props) {
  await dbConnect();
  const session = await auth();
  const email = session?.user?.email;

  const cid = new ObjectId(params.commentId);
  const comment = await Comment.findOneAndUpdate(
    { _id: cid },
    {
      $addToSet: { Hearts: { email: email } }, // 사용자의 이메일을 Hearts 배열에 추가합니다.
      $inc: { "_count.Hearts": 1 }, // Hearts 수를 1 증가시킵니다.
    },
    { new: true }
  );
  if (!comment) {
    return NextResponse.json({ message: "Comment not found", status: 404 });
  }

  return NextResponse.json(comment);
}

export async function DELETE(req: NextRequest, { params }: Props) {
  await dbConnect();

  const session = await auth();
  const email = session?.user?.email;
  const cid = new ObjectId(params.commentId);

  const comment = await Comment.findOneAndUpdate(
    { _id: cid },
    {
      $pull: { Hearts: { email: email } },
      $inc: { "_count.Hearts": -1 },
    },
    { new: true }
  );

  if (!comment) {
    return NextResponse.json({ error: "댓글을 찾을 수 없습니다." });
  }

  return NextResponse.json(comment);
}
