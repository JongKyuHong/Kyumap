import { QueryFunction } from "@tanstack/query-core";
import { IPost } from "@/model/Post";

export const getComments: QueryFunction<
  IPost[],
  [_1: string, postId: string, _3: string]
> = async ({ queryKey }) => {
  const [_1, postId, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/${postId}/comments`,
    {
      next: {
        tags: ["posts", postId, "comments"],
      },
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
