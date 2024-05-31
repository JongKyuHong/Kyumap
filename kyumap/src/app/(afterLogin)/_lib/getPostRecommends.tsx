type Props = { pageParam?: number };

export async function getPostRecommends({ pageParam }: Props) {
  console.log(pageParam, "getPostRecommends pageParams");
  const res = await fetch(
    `http://localhost:3000/api/posts?cursor=${pageParam}`,
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
  console.log(data, "getPostRecommends res");
  return data;
}
