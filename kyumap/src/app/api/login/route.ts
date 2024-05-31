import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: Request) {
  await dbConnect();
  const reqBody = await req.json();
  console.log(reqBody, "/api/login reqBody");
  const res = await User.findOne({ email: reqBody.email });
  return NextResponse.json(res);
}
