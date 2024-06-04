export const getPost = async ({ queryKey }: { queryKey: [string, string] }) => {
  const [_1, postId] = queryKey;
  console.log(postId, "getPost");
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}`,
    {
      next: {
        tags: ["posts", postId],
      },
      // cache: "no-store",
      credentials: "include",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
