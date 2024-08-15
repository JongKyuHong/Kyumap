import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data = await req.json();

    const updateFields: any = {
      "Info.intro": data.intro,
      "Info.website": data.website,
      "Info.gender": data.gender,
    };

    if (data.profileImageUrl) {
      updateFields["image"] = data.profileImageUrl;
    }
    // 사용자 소개 업데이트
    const user = await User.findOneAndUpdate(
      { email: data.email },
      updateFields,
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ data: user, status: 200 });
  } catch (error) {
    return NextResponse.json({ data: error, status: 500 });
  }
}
