import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ status: 200 });

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
