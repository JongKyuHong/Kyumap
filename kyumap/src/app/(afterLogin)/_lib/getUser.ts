import { QueryFunction } from "@tanstack/query-core";
import { User } from "@/model/User";

export const getUser: QueryFunction<
  User,
  [_1: string, userId: string]
> = async ({ queryKey }) => {
  const [_1, userId] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userId}`,
    {
      next: {
        tags: ["user", userId],
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
