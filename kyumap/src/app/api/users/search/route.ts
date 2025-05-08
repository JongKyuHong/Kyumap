import dbConnect from "@/app/(afterLogin)/_lib/dbConnect";
import User from "@/model/User";
import { NextRequest, NextResponse } from "next/server";

interface IUserSearchResult {
  email: string;
  nickname: string;
  image: string;
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const searchParams = req.nextUrl.searchParams;
    const query = searchParams.get("query");

    if (!query || typeof query !== "string" || query.length < 1) {
      console.log("유효하지 않은 검색어:", query);

      return NextResponse.json(
        { message: "유효한 검색어가 필요합니다." },
        { status: 400 }
      );
    }

    const users = await User.find({
      $or: [
        // nickname 또는 email 중 하나라도 일치하는 경우
        { nickname: { $regex: query, $options: "i" } }, // regex: 정규 표현식 검색, options: 'i' (case-insensitive)
        { email: { $regex: query, $options: "i" } },
      ],
    })
      // 검색 결과가 너무 많을 수 있으니 5개 제한
      .limit(5)
      // 필요한 필드만 선택해서 가져오기
      .select("_id nickname email image");

    const searchResults: IUserSearchResult[] = users.map(
      (user: IUserSearchResult) => ({
        email: user.email,
        nickname: user.nickname,
        image: user.image,
      })
    );

    return NextResponse.json(searchResults);
  } catch (error) {
    console.error("사용자 검색 중 서버 오류 발생:", error);
    return NextResponse.json(
      { message: "사용자 검색 중 서버 오류가 발생하였습니다." },
      { status: 500 }
    );
  }
}
