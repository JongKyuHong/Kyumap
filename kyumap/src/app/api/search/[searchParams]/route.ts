import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    searchParams: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  const searchParams = params.searchParams; // 검색어 가져옴

  if (!searchParams) {
    return NextResponse.json({ error: "검색어를 입력하세요" }, { status: 400 });
  }
  try {
    // 검색어를 포함하는 유저를 가져옴
    const users = await User.find({
      $or: [
        // 대소문자 구분없이 $options:"i"
        // 닉네임 검색 또는 자기 소개 검색
        { nickname: { $regex: searchParams, $options: "i" } },
        { "Info.intro": { $regex: searchParams, $options: "i" } },
      ],
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error: "데이터를 가져오는 데 실패했습니다.",
      status: 500,
    });
  }
}
