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

  console.log(postId, commentId, "post comment");
  const { userSession } = await req.json();
  console.log(userSession, "session");

  try {
    const comment = await Comment.findOne({ _id: commentId });
    console.log(comment, "comment");
    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // 세션의 사용자 이메일과 댓글 작성자의 이메일을 비교합니다.
    if (comment.User.email !== userSession.email) {
      return NextResponse.json(
        { error: "You are not authorized to delete this comment" },
        { status: 403 }
      );
    }

    // 댓글을 삭제합니다.
    await Comment.deleteOne({ _id: commentId });
    await Post.findOneAndUpdate(
      { postId: postId },
      { $inc: { "_count.Comments": -1 } },
      { new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
