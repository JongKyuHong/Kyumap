import { NextRequest } from "next/server";
import Post from "@/model/Post";

export async function POST(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  const data = await req.json();
  const postId = Number(params.postId);
  if (isNaN(postId)) {
    throw new Error("postId must be a valid number");
  }
  if (typeof data.user.email !== "string") {
    throw new Error("user.email must be a string");
  }

  try {
    const updatedPost = await Post.findOneAndUpdate(
      { postId: postId },
      {
        $push: { Hearts: { email: data.user.email } },
        $inc: { "_count.Hearts": 1 },
      },
      { new: true }
    );
    console.log("Updated Post:", updatedPost);

    // 성공 시 클라이언트에 보낼 응답
    return new Response(JSON.stringify({ success: true, updatedPost }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    console.error("Error updating post:", err);

    // err 객체를 Error 타입으로 처리
    const error = err as Error;

    // 에러 발생 시 클라이언트에 보낼 응답
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    // 요청 본문에서 데이터 파싱
    const data = await req.json();
    const postId = Number(params.postId);
    if (isNaN(postId)) {
      throw new Error("postId must be a valid number");
    }
    if (typeof data.user.email !== "string") {
      throw new Error("user.email must be a string");
    }

    // findOneAndUpdate를 사용하여 Hearts 배열에서 특정 이메일 제거
    const updatedPost = await Post.findOneAndUpdate(
      { postId: postId }, // 조건
      {
        $pull: { Hearts: { email: data.user.email } },
        $inc: { "_count.Hearts": -1 },
      }, // 수행할 작업
      { new: true } // 업데이트된 문서 반환
    );
    console.log("Updated Post:", updatedPost);

    // 성공 응답
    return new Response(JSON.stringify({ success: true, updatedPost }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (err) {
    // 에러 처리
    console.error("Error updating post:", err);

    const error = err as Error;

    // 에러 응답
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
