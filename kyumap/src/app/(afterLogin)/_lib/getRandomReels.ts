import { QueryFunctionContext, QueryFunction } from "@tanstack/query-core";
import { IPost } from "@/model/Post";

// type Props = {
//   queryKey: [_1: string, userEmail: string, _2: string];
//   pageParam: number;
// };

type Props = QueryFunctionContext<[string, string]> & {
  pageParam?: number;
};

export const getRandomReels: QueryFunction<
  IPost[],
  [string, string],
  number
> = async ({ queryKey, pageParam }: Props) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/posts/reels?cursor=${pageParam}`,
    {
      next: {
        tags: ["posts", "reels"],
      },
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
};
