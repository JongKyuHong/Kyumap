import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import aws from "aws-sdk";
import User from "@/model/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const reqBody = await req.formData();
    const image = reqBody.get("image") as File;

    const data = {
      email: reqBody.get("id"),
      nickname: reqBody.get("name"),
      password: reqBody.get("password"),
      image: reqBody.get("imageUrl"),
    };
    console.log(data, "api users data");
    const newUser = await User.create(data);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error); // 오류 로깅
    return NextResponse.json({ error: "An error occurred" }, { status: 500 }); // 서버 오류 응답
  }
}
