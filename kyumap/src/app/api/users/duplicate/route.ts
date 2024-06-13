import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";

export async function POST(req: NextRequest) {
  await dbConnect();
  const data = await req.json();
  const email = data.email;
  const nickname = data.nickname;

  const emailExists = await User.findOne({ email: email });
  if (emailExists) {
    return NextResponse.json({ message: "already_use_email" }, { status: 400 });
  }

  // 닉네임 중복 확인
  const nicknameExists = await User.findOne({ nickname: nickname });
  if (nicknameExists) {
    return NextResponse.json(
      { message: "already_use_nickname" },
      { status: 400 }
    );
  }
  return NextResponse.json({ status: 200 });
}
