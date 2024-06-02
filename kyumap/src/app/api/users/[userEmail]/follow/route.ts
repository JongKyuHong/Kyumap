import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function POST(req: NextRequest, { params }: Props) {
  const userEmail = await req.json();
  const decodedEmail = decodeURIComponent(userEmail);
  console.log(decodedEmail, params.userEmail, "api안에서 ㅋ노솔");
  // params.userEmail의 팔로우 목록에 decodedEmail이 없으면 추가
  const targetUserUpdate = await User.findOneAndUpdate(
    { email: params.userEmail, "Followers.email": { $ne: decodedEmail } }, // followers 배열에 decodedEmail이 없는 경우에만 업데이트합니다.
    {
      $addToSet: { Followers: { email: decodedEmail } }, // followers 배열에 decodedEmail을 추가합니다.
      $inc: { "_count.Followers": 1 },
    },
    { new: true } // 업데이트된 문서를 반환합니다.
  );

  // decodedEmail의 팔로잉 목록에 params.userEmail을 추가
  const sourceUserUpdate = await User.findOneAndUpdate(
    { email: decodedEmail, "Followings.email": { $ne: params.userEmail } }, // following 배열에 params.userEmail이 없는 경우에만 업데이트합니다.
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
  const decodedEmail = decodeURIComponent(userEmail);
  console.log(decodedEmail, params.userEmail, "email");

  // params.userEmail 사용자의 팔로워 목록에서 decodedEmail을 제거하고 followers 수를 1 감소
  const targetUserUpdate = await User.findOneAndUpdate(
    { email: params.userEmail },
    {
      $pull: { Followers: { email: decodedEmail } },
      $inc: { "_count.Followers": -1 },
    },
    { new: true }
  );

  // decodedEmail 사용자의 팔로잉 목록에서 params.userEmail을 제거하고 following 수를 1 감소
  const sourceUserUpdate = await User.findOneAndUpdate(
    { email: decodedEmail },
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
