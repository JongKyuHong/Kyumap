import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // 비밀번호 해싱 및 비교를 위한 bcrypt 사용

export async function POST(req: Request) {
  await dbConnect();
  const reqBody = await req.json();
  const { email, password } = reqBody;
  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: "User not found", status: 404 });
  }

  // 비밀번호 검증
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return NextResponse.json({ error: "Incorrect password", status: 401 });
  }

  // 비밀번호가 올바른 경우 사용자 정보 반환
  return NextResponse.json(user);
}
