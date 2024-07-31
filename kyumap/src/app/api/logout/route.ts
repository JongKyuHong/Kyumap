import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ status: 200 });

    // 세션 쿠키를 삭제
    response.cookies.set("session", "", { maxAge: 0, path: "/" });

    // 로그아웃 성공 응답
    return response;
  } catch (error) {
    // 에러 처리
    return NextResponse.json({
      message: "로그아웃 실패",
      error: error instanceof Error ? error.message : String(error),
      status: 500,
    });
  }
}
