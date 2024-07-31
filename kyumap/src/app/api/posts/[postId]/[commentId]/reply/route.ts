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

  const userName = data.User.name;
  const userEmail = data.User.email;
  const userImage = data.User.image;
  const commentid = new ObjectId(params.commentId);
  const comment = await Comment.findOneAndUpdate(
    { _id: commentid },
    {
      $addToSet: {
        reply: {
          userName: userName,
          userEmail: userEmail,
          userImage: userImage,
          content: data.comment,
        },
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
