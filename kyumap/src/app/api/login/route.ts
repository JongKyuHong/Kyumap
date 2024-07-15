import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const reqBody = await req.json();
  const res = await User.findOne({ email: reqBody.email });

  if (!res) {
    return NextResponse.json({ error: "User not found", status: 404 });
  }

  return NextResponse.json(res);
}
