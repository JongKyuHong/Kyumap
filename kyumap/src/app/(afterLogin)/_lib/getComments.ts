import { QueryFunction } from "@tanstack/query-core";
import { IComment } from "@/model/Comment";

// postId에 맞는 게시글의 코멘트들을 가져옴
export const getComments: QueryFunction<
  IComment[],
  [_1: string, postId: string, _3: string]
> = async ({ queryKey }) => {
  // queryKey에서 postId 값을 추출
  const [_1, postId, _2] = queryKey;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/comments`,
    {
      next: {
        tags: ["posts", postId, "comments"], // 캐시를 위한 태그
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();

  return data;
};
