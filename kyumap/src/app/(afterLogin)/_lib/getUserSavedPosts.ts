import { QueryFunctionContext, QueryFunction } from "@tanstack/query-core";
import { IPost } from "@/model/Post";

// type Props = {
//   queryKey: [_1: string, userEmail: string, _2: string];
//   pageParam: number;
// };

type Props = QueryFunctionContext<[string, string, string]> & {
  pageParam?: number;
};

export const getUserSavedPosts: QueryFunction<
  IPost[],
  [string, string, string],
  number
> = async ({ queryKey, pageParam }: Props) => {
  const [_1, userEmail, _2] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}/posts/saved?cursor=${pageParam}`,
    {
      next: {
        tags: ["user", userEmail, "saveposts"],
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
  console.log(data, "api data 저장됨");
  return data;
};
