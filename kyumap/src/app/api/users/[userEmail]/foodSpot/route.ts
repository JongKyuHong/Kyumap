import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import Post from "@/model/Post";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  // 주소 정보 있는 게시글 가져옴
  const data = await Post.find({
    userEmail: params.userEmail,
    "position.lat": { $ne: "" },
    "position.lng": { $ne: "" },
  });

  return NextResponse.json({ data: data, status: 200 });
}
