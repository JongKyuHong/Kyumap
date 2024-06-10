export async function getFollowRecommends(userEmail: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/followRecommends/${userEmail}`,
    {
      next: {
        tags: ["users", "followRecommends", userEmail],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();
  return data;
}
