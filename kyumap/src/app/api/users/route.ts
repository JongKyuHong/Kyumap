import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";
import aws from "aws-sdk";
import User from "@/model/User";

export async function POST(req: Request) {
  await dbConnect();
  const reqBody = await req.formData();
  const image = reqBody.get("image") as File;

  // aws.config.update({
  //   accessKeyId: process.env.ACCESS_KEY_ID,
  //   secretAccessKey: process.env.SECRET_ACCESS_KEY,
  //   region: "ap-northeast-2",
  //   signatureVersion: "v4",
  // });

  // const s3 = new aws.S3();
  // const url = await s3.createPresignedPost({
  //   Bucket: process.env.BUCKET_NAME,
  //   Fields: { key: image.name },
  //   Expires: 60,
  //   Conditions: [["content-length-range", 0, 1048576]],
  // });

  const data = {
    id: reqBody.get("id"),
    nickname: reqBody.get("name"),
    password: reqBody.get("password"),
    image: reqBody.get("imageUrl"),
  };
  const newUser = await User.create(data);
  return NextResponse.json(newUser);
}
