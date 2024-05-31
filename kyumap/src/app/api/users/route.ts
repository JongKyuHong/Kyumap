import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import aws from "aws-sdk";
import User from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  const reqBody = await req.formData();
  const image = reqBody.get("image") as File;

  const data = {
    email: reqBody.get("id"),
    nickname: reqBody.get("name"),
    password: reqBody.get("password"),
    image: reqBody.get("imageUrl"),
  };
  const newUser = await User.create(data);
  return NextResponse.json(newUser);
}
