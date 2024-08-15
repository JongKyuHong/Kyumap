type Props = {
  queryKey: [_1: string, userEmail: string, _2: string];
  pageParam: number;
};

// 특정 사용자의 릴스를 가져옴
export async function getReels({ queryKey, pageParam }: Props) {
  const [_1, userEmail, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/posts/reels?cursor=${pageParam}`,
    {
      next: {
        tags: ["user", userEmail, "reels"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}
