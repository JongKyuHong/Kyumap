import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    const user = await User.findOneAndUpdate(
      { email: data.email },
      {
        "Info.intro": data.intro,
        "Info.website": data.website,
        "Info.gender": data.gender,
      },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}