import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  try {
    await dbConnect();

    // 요청한 사용자의 팔로우 목록을 가져옵니다.
    const currentUser = await User.findOne({ email: params.userEmail });

    if (!currentUser) {
      return NextResponse.json({ error: "User not found", status: 404 });
    }

    const followedUsers = currentUser.Followings.map((user: any) => user.email);

    // 이미 팔로우된 사용자를 제외하고 추천 목록을 가져옵니다.
    // ne : not equal, nin : not in
    const user = await User.find({
      email: { $ne: params.userEmail, $nin: followedUsers },
    })
      .sort({ "_count.Followers": -1 })
      .limit(5);

    return NextResponse.json({ data: user, status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error, status: 500 });
  }
}
