// 게시글 데이터를 가져옴
export const getPost = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [_1, postId] = queryKey; // queryKey에서 postId 추출
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`,
    {
      next: {
        tags: ["posts", postId], // 캐시를 위한 태그
      },
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  return data;
};
