"use client";

import Post from "@/app/(afterLogin)/_component/Post";
import { IPost } from "@/model/Post";
import { getSearchResult } from "@/app/(afterLogin)/_lib/getSearchResult";
import { useQuery } from "@tanstack/react-query";
import SearchCard from "./SearchCard";
import { IUser } from "@/model/User";

type Props = {
  searchParams: string;
  addToHistory: (user: IUser) => void;
  onClickMounted: () => void;
};

export default function SearchResult({
  searchParams,
  addToHistory,
  onClickMounted,
}: Props) {
  if (!searchParams) return null;
  const { data } = useQuery<IUser[], Object, IUser[], [string, string]>({
    queryKey: ["search", searchParams],
    queryFn: getSearchResult,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });

  return data?.map((userData, index) => (
    <SearchCard
      key={index}
      userData={userData}
      onClick={addToHistory}
      onClickMounted={onClickMounted}
    />
  ));
}
