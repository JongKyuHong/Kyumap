"use client";

import Post from "@/app/(afterLogin)/_component/Post";
import { IPost } from "@/model/Post";
import { getSearchResult } from "@/app/(afterLogin)/_lib/getSearchResult";
import { useQuery } from "@tanstack/react-query";
import SearchCard from "./SearchCard";
import { IUser } from "@/model/User";
import LoadingComponent from "@/app/_component/LoadingComponent";

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
  const { data, error, isLoading } = useQuery<
    IUser[],
    Object,
    IUser[],
    [string, string]
  >({
    queryKey: ["search", searchParams],
    queryFn: getSearchResult,
    staleTime: 60 * 1000, 
    gcTime: 300 * 1000,
  });

  if (isLoading) {
    return <LoadingComponent />;
  }

  if (error) {
    return <div>Error</div>;
  }

  if (!Array.isArray(data)) {
    return <div>No results found</div>;
  }

  return (
    <>
      {data.map((userData, index) => (
        <SearchCard
          key={index}
          userData={userData}
          onClick={addToHistory}
          onClickMounted={onClickMounted}
        />
      ))}
    </>
  );
}
