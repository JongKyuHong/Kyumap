import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import aws from "aws-sdk";
import User from "@/model/User";
import bcrypt from "bcryptjs"; // bcrypt를 사용하여 비밀번호 해싱

export async function POST(req: Request) {
  try {
    await dbConnect();
    const reqBody = await req.formData();

    const email = reqBody.get("id") as string;
    const nickname = reqBody.get("name") as string;
    const password = reqBody.get("password") as string;
    const imageUrl = reqBody.get("imageUrl") as string;

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    const data = {
      email,
      nickname,
      password: hashedPassword, // 해싱된 비밀번호 저장
      image: imageUrl,
    };

    const newUser = await User.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error); // 오류 로깅
    return NextResponse.json({ error: "An error occurred" }, { status: 500 }); // 서버 오류 응답
  }
}
