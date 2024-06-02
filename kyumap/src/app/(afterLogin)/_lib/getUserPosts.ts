import { QueryFunction } from "@tanstack/query-core";
import { IPost } from "@/model/Post";

type Props = {
  queryKey: [_1: string, string, _2: string];
  pageParam?: number;
};
export const getUserPosts = async ({ queryKey, pageParam }: Props) => {
  const [_1, userEmail, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/posts?cursor=${pageParam}`,
    {
      next: {
        tags: ["user", userEmail, "posts"],
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

  return res.json();
};
