export async function getFollowRecommends(userEmail: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/followRecommends/${userEmail}`,
    {
      next: {
        tags: ["users", "followRecommends", userEmail],
      },
      credentials: "include",
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Failed to fetch data");
  }

  const data = await res.json();

  return data.data;
}
