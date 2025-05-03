import Comment from "@/model/Comment";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";
import { auth } from "@/auth";

type Props = {
  params: {
    postId: string;
    commentId: string;
  };
};

export async function DELETE(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const postId = params.postId;
    const commentId = new ObjectId(params.commentId);
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "로그인이 필요합니다." },
        { status: 401 }
      );
    }

    const commentToDelete = await Comment.findById(commentId);

    if (!commentToDelete) {
      return NextResponse.json(
        { error: "삭제할 댓글을 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    if (commentToDelete.userEmail !== session.user.email) {
      return NextResponse.json(
        { error: "댓글을 삭제할 권한이 없습니다." },
        { status: 403 }
      );
    }

    // 가장 위에 있는 댓글, 즉 답글이 있는 댓글이라면
    const isTopLevelComment =
      commentToDelete.threadId?.toString() === commentToDelete._id.toString();

    let deletedCount = 0;

    if (isTopLevelComment) {
      const deleteResult = await Comment.deleteMany({
        threadId: commentToDelete._id,
      });

      deletedCount = deleteResult.deletedCount;
    } else {
      const deleteResult = await Comment.deleteOne({ _id: commentId });
      deletedCount = deleteResult.deletedCount;

      await Comment.findOneAndUpdate(
        { _id: commentToDelete.threadId },
        { $inc: { "_count.Comments": -1 } },
        { new: true }
      );
    }

    const post = await Post.findOneAndUpdate(
      {
        postId: commentToDelete.postId,
      },
      { $inc: { "_count.Comments": -deletedCount } }
    );

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error", status: 500 });
  }
}
