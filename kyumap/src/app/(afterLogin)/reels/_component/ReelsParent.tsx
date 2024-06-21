"use client";

import { useState, useEffect, Fragment } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getRandomReels } from "../../_lib/getRandomReels";
import { IPost } from "../../../../model/Post";
import { useRouter } from "next/navigation";
import styles from "./reels.module.css";
import Reels from "./Reels";
import { useInView } from "react-intersection-observer";

export default function ReelsParent() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string],
    number
  >({
    queryKey: ["posts", "reels"],
    queryFn: getRandomReels,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const allReelsData = data?.pages.flat() || [];
  console.log(allReelsData, "allReelsData");
  const router = useRouter();

  if (allReelsData[0]) {
    console.log(allReelsData.length, "loglog");
    localStorage.setItem("reelsIndex", "0");
    localStorage.setItem("reelsLength", allReelsData.length.toString());
    router.replace(`/reels/${allReelsData[0].postId}`);
  }

  return null;
}
