import aws from "aws-sdk";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const data = await req.formData();
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
    signatureVersion: "v4",
  });

  const s3 = new aws.S3();

  const lst: any[] = [];
  for (const [key, value] of data) {
    const url = s3.createPresignedPost({
      // 비동기 작업을 기다림
      Bucket: process.env.BUCKET_NAME,
      Fields: { key: value },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 1048576 * 50], // 파일용량 50MB 까지 제한
      ],
    });
    lst.push(url);
  }

  return NextResponse.json({ data: lst, status: 200 });
}

export async function GET(req: NextRequest, res: NextResponse) {
  // 사진등록해서 url받아내는
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
    signatureVersion: "v4",
  });
  const s3 = new aws.S3();
  const filename = req.nextUrl.searchParams.get("file");
  console.log(filename, "filename api");
  const type = req.nextUrl.searchParams.get("type");
  if (!filename || !type) {
    return NextResponse.json({ error: "Invalid file or type", status: 400 });
  }

  // const decodeFileName = decodeURIComponent(filename);

  const contentType = type === "image" ? "image/*" : "video/*";

  const url = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: { key: `${type}/${filename}`, "Content-Type": contentType },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576 * 50], //파일용량 50MB 까지 제한
      ["starts-with", "$Content-Type", type + "/"],
    ],
  });

  return NextResponse.json(url);
}
