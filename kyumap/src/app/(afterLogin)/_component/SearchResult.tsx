"use client";

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

// 검색 결과
export default function SearchResult({
  searchParams,
  addToHistory,
  onClickMounted,
}: Props) {
  // 검색 결과 데이터를 불러옴
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

  // if (isLoading) {
  //   return <LoadingComponent />;
  // }

  if (error) {
    return <div>Error</div>;
  }

  // 검색 결과가 없는경우
  if (!Array.isArray(data)) {
    return <div>No results found</div>;
  }

  // 검색결과를 card로 보여줌
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
