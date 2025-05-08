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
  try {
    await dbConnect();
    const postId = params.postId;
    // 댓글 받아오기
    const allComments = await Comment.find({
      postId: postId,
      $expr: {
        $eq: ["$_id", "$threadId"],
      },
    });
    return NextResponse.json(allComments);
  } catch (error) {
    console.error(error);

    // 오류 발생 시 에러 응답 반환
    return NextResponse.json(
      { message: "댓글 목록을 불러오는데 실패하였습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();
    const postId = params.postId;
    const data = await req.json();

    const IsThreadId = data.threadId;

    // 댓글 데이터 구성
    const inputData = {
      postId: postId,
      userNickname: data.User.name,
      userEmail: data.User.email,
      content: data.comment,
      threadId: data.threadId,
    };
    // 댓글 생성
    const comment = await Comment.create(inputData);

    let updatedComment = comment;

    if (!IsThreadId) {
      const result = await Comment.findOneAndUpdate(
        { _id: comment._id }, // 생성된 댓글 (최상위)의 _id를 찾아서
        { threadId: comment._id }, // threadId 필드를 자신의 _id 값으로 업데이트
        { new: true } // 업데이트된 문서를 반환받기 위해 new: true 옵션 사용
      );

      if (result) {
        updatedComment = result; // 업데이트 성공 시 updatedComment 변수를 업데이트된 문서로 교체
      } else {
        console.error(`Failed to update threadId for comment ${comment._id}`);
      }
    } else {
      const res = await Comment.findOneAndUpdate(
        {
          _id: IsThreadId,
        },
        {
          $inc: {
            "_count.Comments": 1,
          },
        }
      );
    }

    // post에 _count늘려주기
    const post = await Post.findOneAndUpdate(
      { postId: postId },
      { $inc: { "_count.Comments": 1 } },
      { new: true }
    );

    if (!post) {
      console.error(
        `Post with postId ${postId} not found for comment count update.`
      );
    }

    return NextResponse.json({ comment: updatedComment, post });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      status: 500,
    });
  }
}
