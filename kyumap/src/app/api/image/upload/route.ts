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
  //   console.log(req, "reqreqreqreq");
  //   console.log(req.nextUrl.searchParams.get("file"), "223232");
  const s3 = new aws.S3();

  const lst: any[] = [];
  for (const [key, value] of data) {
    const url = await s3.createPresignedPost({
      // 비동기 작업을 기다림
      Bucket: process.env.BUCKET_NAME,
      Fields: { key: value },
      Expires: 60, // seconds
      Conditions: [
        ["content-length-range", 0, 1048576 * 50], // 파일용량 50MB 까지 제한
      ],
    });

    // let filename = url.fields.key.name;
    // lst.push(url.url + "/" + filename);
    lst.push(url);
  }

  return NextResponse.json(lst, { status: 200 });
}

export async function GET(req: NextRequest, res: NextResponse) {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
    signatureVersion: "v4",
  });
  //   console.log(req, "reqreqreqreq");
  //   console.log(req.nextUrl.searchParams.get("file"), "223232");
  const s3 = new aws.S3();
  const url = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: { key: req.nextUrl.searchParams.get("file") },
    Expires: 60, // seconds
    Conditions: [
      ["content-length-range", 0, 1048576 * 50], //파일용량 50MB 까지 제한
    ],
  });
  //   console.log(url, "urlrulrularul");
  return NextResponse.json(url, { status: 200 });
}
