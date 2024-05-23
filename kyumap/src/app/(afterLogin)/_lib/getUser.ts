import { QueryFunction } from "@tanstack/query-core";
import { IUser } from "@/model/User";

export const getUser: QueryFunction<
  IUser,
  [_1: string, userId: string]
> = async ({ queryKey }) => {
  const [_1, userId] = queryKey;
  const res = await fetch(`/api/users/${userId}`, {
    next: {
      tags: ["users", userId],
    },
    credentials: "include",
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }
  return res.json();
};
