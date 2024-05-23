import { QueryFunction } from "@tanstack/query-core";
import { IPost } from "@/model/Post";

export const getComments: QueryFunction<
  IPost[],
  [_1: string, id: string, _3: string]
> = async ({ queryKey }) => {
  const [_1, id, _2] = queryKey;
  const res = await fetch(`/api/posts/${id}/comments`, {
    next: {
      tags: ["posts", id, "comments"],
    },
    cache: "no-store",
  });
  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch data");
  }

  return res.json();
};
