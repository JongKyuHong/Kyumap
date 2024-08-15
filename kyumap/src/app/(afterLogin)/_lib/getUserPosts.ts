// pageParam은 초기에는 0, 후에는 페이지의 마지막 psotId
type Props = {
  queryKey: [_1: string, userEmail: string, _2: string];
  pageParam: number;
};

// 유저의 게시글을 불러옴
export async function getUserPosts({ queryKey, pageParam }: Props) {
  const [_1, userEmail, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/posts?cursor=${pageParam}`,
    {
      next: {
        tags: ["user", userEmail, "posts"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}
