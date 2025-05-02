
type Props = {
  queryKey: [_1: string, rootCommentId: string];
};

export async function getReplys({ queryKey }: Props) {
  const [_1, rootCommentId] = queryKey;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/reply/${rootCommentId}`,
    {
      next: {
        tags: ["reply", rootCommentId],
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const data = await res.json();
  return data;
}
