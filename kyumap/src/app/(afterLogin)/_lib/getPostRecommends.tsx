// 초기 pageParam은 0, 그 후에는 마지막 게시글의 postId가 된다.
type Props = { pageParam?: string };

// 추천 게시물 목록을 불러옴
export async function getPostRecommends({ pageParam }: Props) {
  // 커서로 pageParam을 넘김
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "recommends"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data;
}
