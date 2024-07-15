import { NextRequest, NextResponse } from "next/server";
import User from "../../../../model/User";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  const email = decodeURIComponent(params.userEmail);
  const userData = await User.findOne({ email: email });
  return NextResponse.json(userData);
}
