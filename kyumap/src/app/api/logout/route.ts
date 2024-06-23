import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // 로그아웃 처리 로직 (예: 세션 삭제)
    // 예시로 세션을 삭제하는 코드를 추가합니다. 실제로 사용하는 세션 관리 방식에 따라 변경하세요.

    // 예: 세션 쿠키를 삭제하는 방법
    let response = NextResponse.next();

    response.cookies.set("Set-Cookie", "session=; Max-Age=0; Path=/");

    // 로그아웃 성공 응답
    return NextResponse.json({ status: 200 });
  } catch (error) {
    // 에러 처리
    return NextResponse.json({
      message: "로그아웃 실패",
      error,
      status: 500,
    });
  }
}
