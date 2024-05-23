import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import User from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  const reqBody = await req.formData();
  // console.log(reqBody, "reqbody");
  console.log(reqBody.get("image"), "reqbodyImg");
  // console.log(reqBody.get("image")!.name, "reqbodyImg2");
  const image = reqBody.get("image") as File;
  const data = {
    id: reqBody.get("id"),
    nickname: reqBody.get("name"),
    password: reqBody.get("password"),
    image: {
      size: image.size,
      Imgtype: image.type,
      name: image.name,
      lastModified: image.lastModified,
    },
  };
  const newUser = await User.create(data);
  return NextResponse.json(newUser);
}
