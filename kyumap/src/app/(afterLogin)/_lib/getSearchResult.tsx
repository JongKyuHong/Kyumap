import { QueryFunction } from "@tanstack/query-core";
import { User } from "@/model/User";

export const getSearchResult: QueryFunction<
  User[],
  [_1: string, searchParams: string]
> = async ({ queryKey }) => {
  const [_1, searchParams] = queryKey;
  const res = await fetch(`http://localhost:9090/api/search/${searchParams}`, {
    next: {
      tags: ["search", searchParams],
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
