import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    postId: string;
  };
};

export async function POST(req: NextRequest, { params }: Props) {
  try {
    const postId = params.postId;
    const userData = await req.json();
    // 유저의 저장됨 항목에 추가
    const user = await User.findOneAndUpdate(
      { email: userData.user.email },
      {
        $push: { Saved: { id: postId } },
      },
      { new: true }
    );

    if (user) {
      return NextResponse.json({ data: user, status: 200 });
    } else {
      return NextResponse.json({ status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ data: error, status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Props) {
  await dbConnect();
  const postId = params.postId;
  const userData = await req.json();

  try {
    // 저장됨 항목에서 삭제
    const user = await User.findOneAndUpdate(
      { email: userData.user.email },
      { $pull: { Saved: { id: postId } } }, // $pull 연산자를 사용하여 postId 제거
      { new: true } // 업데이트 후의 문서를 반환하도록 설정
    );

    if (user) {
      return NextResponse.json({ data: user, status: 200 });
    } else {
      return NextResponse.json({ status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ data: error, status: 500 });
  }
}
