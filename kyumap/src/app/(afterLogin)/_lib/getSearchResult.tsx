import { QueryFunction } from "@tanstack/query-core";
import { IUser } from "@/model/User";

export const getSearchResult: QueryFunction<
  IUser[],
  [_1: string, searchParams: string]
> = async ({ queryKey }) => {
  const [_1, searchParams] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/search/${searchParams}`,
    {
      next: {
        tags: ["search", searchParams],
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
