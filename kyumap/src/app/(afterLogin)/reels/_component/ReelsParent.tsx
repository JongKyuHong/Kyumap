"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getRandomReels } from "../../_lib/getRandomReels";
import { IPost } from "../../../../model/Post";
import styles from "./reels.module.css";
import Reels from "./Reels";
import LoadingComponent from "@/app/_component/LoadingComponent";
import generateMD5Hash from "../_lib/generateMD5Hash";

export default function ReelsParent() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string],
    string
  >({
    queryKey: ["posts", "reels"],
    queryFn: getRandomReels,
    initialPageParam: "",
    getNextPageParam: (lastPage) => {
      const lastPost = lastPage.at(-1);
      return lastPost ? lastPost.createdAt.toString() : undefined;
    },
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
  });

  const allReelsData = useMemo(() => data?.pages.flat() || [], [data]);

  // IntersectionObserver로 현재 인덱스 추적
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);
        if (visibleEntry) {
          const index = Number(visibleEntry.target.getAttribute("data-index"));
          setCurrentIndex(index);
        }
      },
      { threshold: 0.7 }
    );

    reelRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      reelRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [allReelsData]);

  // 비디오 자동 재생 / 정지 처리
  useEffect(() => {
    reelRefs.current.forEach((ref, index) => {
      const video = ref?.querySelector("video") as HTMLVideoElement;
      if (!video) return;

      if (index === currentIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [currentIndex]);

  // 마지막 Reels가 보이면 fetchNextPage
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.5 }
    );

    const lastReel = reelRefs.current[allReelsData.length - 1];
    if (lastReel) observer.observe(lastReel);

    return () => {
      if (lastReel) observer.unobserve(lastReel);
    };
  }, [allReelsData, hasNextPage]);

  // URL 해시 변경
  useEffect(() => {
    const post = allReelsData[currentIndex];
    if (post) {
      const hashId = generateMD5Hash(post.postId.toString());
      history.replaceState(null, "", `/reels/${hashId}`);
    }
  }, [currentIndex, allReelsData]);

  if (isFetching && allReelsData.length === 0) {
    return <LoadingComponent />;
  }

  return (
    <div className={styles.rootDiv}>
      {allReelsData.map((post, index) => (
        <div
          key={index}
          ref={(el) => (reelRefs.current[index] = el)}
          data-index={index}
        >
          <Reels post={post} />
        </div>
      ))}
    </div>
  );
}
