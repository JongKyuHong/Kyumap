import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userName: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  // 닉네임으로 유저정보 가져오기
  const user = await User.findOne({ nickname: params.userName });
  return NextResponse.json(user);
}
