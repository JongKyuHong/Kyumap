"use client";

import { useState, useEffect, Fragment, useCallback, useMemo } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getRandomReels } from "../../_lib/getRandomReels";
import { IPost } from "../../../../model/Post";
import styles from "./reels.module.css";
import Reels from "./Reels";
import Loading from "../../home/loading";
import crypto from "crypto";

export default function ReelsParent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
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

  const allReelsData = useMemo(() => {
    return data?.pages.flat() || [];
  }, []);

  if (allReelsData && allReelsData.length > 0) {
    const hashId = generateMD5Hash(
      allReelsData[currentIndex].postId.toString()
    );
    history.replaceState(null, "", `/reels/${hashId}`);
  }

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIndex = Number(localStorage.getItem("reelsIndex")) || 0;
      const storedLength = Number(localStorage.getItem("reelsLength")) || 0;
      setCurrentIndex(storedIndex);
      setEndIndex(storedLength);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("reelsLength")) {
        localStorage.setItem("reelsLength", allReelsData.length.toString());
        setEndIndex(allReelsData.length);
      }
      if (!localStorage.getItem("reelsIndex")) {
        localStorage.setItem("reelsIndex", "0");
        setCurrentIndex(0);
      }
    }
  }, [allReelsData.length]);

  const handleScroll = useCallback(
    (event: WheelEvent) => {
      if (event.deltaY > 0) {
        // 스크롤 다운
        if (allReelsData) {
          if (currentIndex < endIndex - 1) {
            let plus = currentIndex + 1;
            localStorage.setItem("reelsIndex", plus.toString());
            setCurrentIndex(plus);
          }
        }
      } else if (event.deltaY < 0) {
        // 스크롤 업
        if (allReelsData && currentIndex > 0) {
          let minus = currentIndex - 1;
          localStorage.setItem("reelsIndex", minus.toString());
          setCurrentIndex(minus);
        }
      }
    },
    [allReelsData, currentIndex, endIndex]
  );

  useEffect(() => {
    if (allReelsData && allReelsData.length > 0) {
      const hashId = generateMD5Hash(
        allReelsData[currentIndex].postId.toString()
      );
      history.replaceState(null, "", `/reels/${hashId}`);
    }
  }, [currentIndex, allReelsData]);

  function generateMD5Hash(data: string) {
    return crypto.createHash("md5").update(data).digest("hex");
  }

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleScroll]);

  if (isFetching) {
    return <Loading />;
  }

  return (
    <div className={`${styles.rootDiv}`} tabIndex={0}>
      {allReelsData.map((page, index) => (
        <Fragment key={index}>
          <Reels post={page} />
        </Fragment>
      ))}
    </div>
  );
}
