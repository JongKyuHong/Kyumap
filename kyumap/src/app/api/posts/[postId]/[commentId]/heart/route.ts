import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/model/Comment";
import { ObjectId } from "mongodb";

type Props = {
  params: {
    postId: string;
    commentId: string;
  };
};

export async function POST(req: NextRequest, { params }: Props) {
  await dbConnect();
  const { userSession } = await req.json();
  const { email } = userSession;
  const cid = new ObjectId(params.commentId);
  const comment = await Comment.findOneAndUpdate(
    { _id: cid },
    {
      $addToSet: { Hearts: { email: email } }, // 사용자의 이메일을 Hearts 배열에 추가합니다.
      $inc: { "_count.Hearts": 1 }, // Hearts 수를 1 증가시킵니다.
    },
    { new: true } // 업데이트된 문서를 반환합니다.
  );
  if (!comment) {
    return NextResponse.json({ message: "Comment not found" }, { status: 404 });
  }

  return NextResponse.json(comment);
}

export async function DELETE(req: NextRequest, { params }: Props) {
  await dbConnect();

  // 예를 들어, req.body에서 사용자의 이메일을 받아옵니다. 실제 사용 시 적절한 인증 방법을 통해 사용자 이메일을 확인해야 합니다.
  const { userSession } = await req.json();
  const { email } = userSession;
  const cid = new ObjectId(params.commentId);

  // $pull을 사용하여 Hearts 배열에서 해당 이메일을 제거하고, $inc를 사용하여 _count.Hearts 값을 -1로 조정합니다.
  const comment = await Comment.findOneAndUpdate(
    { _id: cid },
    {
      $pull: { Hearts: { email: email } },
      $inc: { "_count.Hearts": -1 },
    },
    { new: true } // 업데이트된 문서를 반환하도록 설정합니다.
  );

  if (!comment) {
    return NextResponse.json({ error: "댓글을 찾을 수 없습니다." });
  }

  return NextResponse.json(comment);
}
