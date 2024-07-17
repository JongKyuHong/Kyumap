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
  const data = await Post.find({
    "User.email": params.userEmail,
    "position.lat": { $ne: "" },
    "position.lng": { $ne: "" },
  });

  return NextResponse.json({ data: data, status: 200 });
}
