type Props = {
  queryKey: [_1: string, userEmail: string, _2: string];
  pageParam: number;
};

// 유저의 '저장됨' 으로 저장한 게시글 가져옴
export async function getUserSavedPosts({ queryKey, pageParam }: Props) {
  const [_1, userEmail, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/posts/saved?cursor=${pageParam}`,
    {
      next: {
        tags: ["user", userEmail, "saveposts"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}
