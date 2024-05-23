"use client";

import Post from "@/app/(afterLogin)/_component/Post";
import { Post as IPost } from "@/model/Post";
import { getSearchResult } from "@/app/(afterLogin)/_lib/getSearchResult";
import { useQuery } from "@tanstack/react-query";
import SearchCard from "./SearchCard";
import { User } from "@/model/User";

type Props = {
  searchParams: string;
};

export default function SearchResult({ searchParams }: Props) {
  const { data } = useQuery<User[], Object, User[], [string, string]>({
    queryKey: ["search", searchParams],
    queryFn: getSearchResult,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  return data?.map((userData, index) => (
    <SearchCard key={index} userData={userData} />
  ));
}
