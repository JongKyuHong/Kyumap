import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Comment from "@/model/Comment";

type Props = {
  params: {
    postId: string;
    commentId: string;
  };
};

export async function POST(req: NextRequest, { params }: Props) {
  await dbConnect();
  const data = await req.json();
  console.log("태그했을때 데이터 : ", data);
  const user = {
    nickname: data.User.name,
    email: data.User.email,
    image: data.User.image,
  };
  const commentid = new ObjectId(params.commentId);
  const comment = await Comment.findOneAndUpdate(
    { _id: commentid },
    {
      $addToSet: {
        reply: { User: user, content: data.comment },
      },
      $inc: { "_count.Comments": 1 },
    },
    { new: true }
  );

  if (!comment) {
    return NextResponse.json({ error: "댓글을 찾을 수 없습니다." });
  }

  return NextResponse.json(comment);
}
