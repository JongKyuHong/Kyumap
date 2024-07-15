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
  const user = await User.findOne({ nickname: params.userName });
  return NextResponse.json(user);
}
