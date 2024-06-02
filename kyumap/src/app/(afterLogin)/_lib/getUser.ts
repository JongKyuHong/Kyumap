import { QueryFunction } from "@tanstack/query-core";
import { IUser } from "@/model/User";

export const getUser: QueryFunction<
  IUser,
  [_1: string, userEmail: string]
> = async ({ queryKey }) => {
  const [_1, userEmail] = queryKey;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/users/${userEmail}`,
    {
      next: {
        tags: ["users", userEmail],
      },
      credentials: "include",
      cache: "no-store",
    }
  );
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  const data = await res.json();

  return data;
};
