"use client";

import React, { Fragment, useTransition } from "react";
import styles from "../_component/reels.module.css";
import Reels from "../_component/Reels";
import { useEffect, useState } from "react";
import {
  useQueryClient,
  useInfiniteQuery,
  InfiniteData,
} from "@tanstack/react-query";
import { IPost } from "../../../../model/Post";
import { getRandomReels } from "../../_lib/getRandomReels";
import { useRouter } from "next/navigation";
import { CSSTransition } from "react-transition-group";

type Props = {
  params: {
    postId: number;
  };
};

export default function Page({ params }: Props) {
  // 릴스 모두 불러와서 map으로 돌려서 Reels 컴포넌트
  // 주소별로
  const { postId } = params;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [currentIndex, setCurrentIndex] = useState(
    Number(localStorage.getItem("reelsIndex")) || 0
  );
  const [endIndex, setEndIndex] = useState(
    Number(localStorage.getItem("reelsLength") || 0)
  );
  console.log(currentIndex, "currentIndex");
  const queryClient = useQueryClient();
  const rawData = queryClient.getQueryData<any>(["posts", "reels"]);
  console.log(rawData, "rawData");
  let allData: IPost[] | undefined;

  if (!rawData) {
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
    });
    if (data?.pages) {
      allData = data.pages.flat();
    }
  } else {
    allData = rawData.pages.flat();
  }

  console.log(allData, "alldata");
  useEffect(() => {
    if (allData) {
      const index = allData.findIndex((post) => post.postId === postId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [postId, allData]);

  const handleScroll = (event: WheelEvent) => {
    event.preventDefault();
    if (event.deltaY > 0) {
      // 스크롤 다운
      if (allData) {
        if (currentIndex < endIndex - 1) {
          let plus = currentIndex + 1;
          setCurrentIndex(currentIndex + 1);
          localStorage.setItem("reelsIndex", plus.toString());
          setScrollDirection("down");
          startTransition(() => {
            router.replace(`/reels/${allData[plus]?.postId}`);
          });
        }
      }
    } else if (event.deltaY < 0) {
      // 스크롤 업
      if (allData && currentIndex > 0) {
        let minus = currentIndex - 1;
        setCurrentIndex(currentIndex - 1);
        localStorage.setItem("reelsIndex", minus.toString());
        setScrollDirection("up");
        startTransition(() => {
          router.replace(`/reels/${allData[minus]?.postId}`);
        });
      }
    }
  };

  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleScroll]);

  if (!allData) {
    return <div>Loading...</div>;
  }

  const currentPage = allData[currentIndex];
  console.log(
    currentIndex,
    endIndex,
    currentIndex < endIndex - 1,
    allData[currentIndex],
    allData[currentIndex - 1],
    allData[currentIndex + 1],
    "커런트"
  );
  return (
    <div
      className={`${styles.rootDiv} ${
        scrollDirection === "down" ? styles.slideDown : styles.slideUp
      }`}
    >
      {allData.slice(currentIndex).map((page, i) => (
        <Fragment key={i + currentIndex}>
          <Reels post={page} />
          <div
            className={styles.underDiv}
            style={{ height: "16px", width: "100%" }}
          ></div>
        </Fragment>
      ))}
    </div>
  );
}
