import Comment from "@/model/Comment";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";

type Props = {
  params: {
    postId: string;
    commentId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Props) {
  await dbConnect();
  const postId = params.postId;
  const commentId = new ObjectId(params.commentId);

  const { userSession } = await req.json();

  try {
    const comment = await Comment.findOne({ _id: commentId });
    const reply = await Comment.findOne({ "reply._id": commentId });
    if (!comment && !reply) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    if (comment) {
      // 댓글삭제
      if (comment.userEmail !== userSession.email) {
        return NextResponse.json(
          { error: "댓글을 삭제할 권한이 없습니다." },
          { status: 403 }
        );
      }
      await Comment.deleteOne({ _id: commentId });
      await Post.findOneAndUpdate(
        { postId: postId },
        { $inc: { "_count.Comments": -1 } },
        { new: true }
      );
    } else if (reply) {
      // 답글삭제
      if (reply.userEmail !== userSession.email) {
        return NextResponse.json(
          { error: "답글을 삭제할 권한이 없습니다." },
          { status: 403 }
        );
      }

      await Comment.updateOne(
        { "reply._id": commentId },
        {
          $pull: { reply: { _id: commentId } },
          $inc: { "_count.Comments": -1 },
        }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
