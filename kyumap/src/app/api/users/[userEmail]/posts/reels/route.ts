import Post from "../../../../../../model/Post";
import User from "../../../../../../model/User";
import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    userEmail: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  await dbConnect();
  const { userEmail } = params;
  const cursor = req.nextUrl.searchParams.get("cursor");
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  // userEmail이 이메일 형식에 맞지 않을 경우, 에러 메시지와 함께 응답을 반환합니다.
  if (!emailRegex.test(userEmail)) {
    return NextResponse.json({
      success: false,
      message: "Invalid email format",
      status: 400,
    });
  }

  try {
    const userEmail = params.userEmail;

    // 유저 정보를 가져옵니다.
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return NextResponse.json({
        success: false,
        message: "User not found",
        status: 404,
      });
    }

    let query: { [key: string]: any } = {
      userEmail: userEmail,
      reels: true,
    };

    if (cursor !== undefined) {
      query["postId"] = { $gt: cursor };
    }

    // limit을 설정하여 한 번에 로드할 게시물 수를 제한합니다.
    const posts = await Post.find(query).limit(21).sort({ postId: 1 });
    return NextResponse.json(posts);
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      success: false,
      message: "Failed to fetch data",
      status: 500,
    });
  }
}
