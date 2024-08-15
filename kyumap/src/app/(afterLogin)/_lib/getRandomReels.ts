type Props = {
  pageParam?: number;
};

// 릴스 목록을 가져오는
export async function getRandomReels({ pageParam }: Props) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/reels?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "reels"],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}
