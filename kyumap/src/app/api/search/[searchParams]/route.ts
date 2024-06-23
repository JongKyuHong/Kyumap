import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

type Props = {
  params: {
    searchParams: string;
  };
};

export async function GET(req: NextRequest, { params }: Props) {
  const searchParams = params.searchParams;

  if (!searchParams) {
    return NextResponse.json({ error: "검색어를 입력하세요" }, { status: 400 });
  }
  try {
    const users = await User.find({
      $or: [
        { nickname: { $regex: searchParams, $options: "i" } },
        { "Info.intro": { $regex: searchParams, $options: "i" } },
      ],
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "데이터를 가져오는 데 실패했습니다." },
      { status: 500 }
    );
  }
}
