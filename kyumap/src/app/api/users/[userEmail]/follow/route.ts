import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function POST(req: NextRequest, { params }: Props) {
  const userEmail = await req.json();
  const decodeEmail = decodeURIComponent(userEmail);
  // params.userEmail의 팔로우 목록에 decodeEmail이 없으면 추가
  const targetUserUpdate = await User.findOneAndUpdate(
    { email: params.userEmail, "Followers.email": { $ne: decodeEmail } }, // followers 배열에 decodeEmail이 없는 경우에만 업데이트합니다.
    {
      $addToSet: { Followers: { email: decodeEmail } }, // followers 배열에 decodeEmail을 추가합니다.
      $inc: { "_count.Followers": 1 },
    },
    { new: true } // 업데이트된 문서를 반환합니다.
  );

  // decodeEmail의 팔로잉 목록에 params.userEmail을 추가
  const sourceUserUpdate = await User.findOneAndUpdate(
    { email: decodeEmail, "Followings.email": { $ne: params.userEmail } }, // following 배열에 params.userEmail이 없는 경우에만 업데이트합니다.
    {
      $addToSet: { Followings: { email: params.userEmail } }, // following 배열에 params.userEmail을 추가합니다.
      $inc: { "_count.Followings": 1 },
    },
    { new: true } // 업데이트된 문서를 반환합니다.
  );

  console.log({ targetUserUpdate, sourceUserUpdate }, "userData update");
  return NextResponse.json({
    targetUser: targetUserUpdate,
    sourceUser: sourceUserUpdate,
  });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { userEmail: string } }
) {
  const userEmail = await req.json();
  const decodeEmail = decodeURIComponent(userEmail);

  // params.userEmail 사용자의 팔로워 목록에서 decodeEmail을 제거하고 followers 수를 1 감소
  const targetUserUpdate = await User.findOneAndUpdate(
    { email: params.userEmail },
    {
      $pull: { Followers: { email: decodeEmail } },
      $inc: { "_count.Followers": -1 },
    },
    { new: true }
  );

  // decodeEmail 사용자의 팔로잉 목록에서 params.userEmail을 제거하고 following 수를 1 감소
  const sourceUserUpdate = await User.findOneAndUpdate(
    { email: decodeEmail },
    {
      $pull: { Followings: { email: params.userEmail } },
      $inc: { "_count.Followings": -1 },
    },
    { new: true }
  );

  console.log({ targetUserUpdate, sourceUserUpdate }, "userData delete");
  return NextResponse.json({
    targetUser: targetUserUpdate,
    sourceUser: sourceUserUpdate,
  });
}
