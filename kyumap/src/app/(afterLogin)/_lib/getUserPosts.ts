import { QueryFunction } from "@tanstack/query-core";
import { Post } from "@/model/Post";

export const getUserPosts: QueryFunction<
  Post[],
  [_1: string, userId: string, _2: string]
> = async ({ queryKey }) => {
  const [_1, userId, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}/posts`,
    {
      next: {
        tags: ["user", userId, "posts"],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
