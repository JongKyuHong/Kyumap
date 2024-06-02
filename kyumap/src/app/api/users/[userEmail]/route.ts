import { NextRequest, NextResponse } from "next/server";
import User from "../../../../model/User";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";

export async function GET(
  req: NextRequest,
  { params }: { params: { userEmail: string } }
) {
  await dbConnect();
  const email = decodeURIComponent(params.userEmail);
  console.log(email, "?userEmail");
  const userData = await User.findOne({ email: email });
  console.log(userData, "userData");
  return NextResponse.json(userData);
}
