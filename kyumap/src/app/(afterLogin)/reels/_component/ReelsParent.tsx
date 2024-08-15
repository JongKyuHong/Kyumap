"use client";

import { useState, useEffect, Fragment, useCallback, useMemo } from "react";
import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getRandomReels } from "../../_lib/getRandomReels";
import { IPost } from "../../../../model/Post";
import styles from "./reels.module.css";
import Reels from "./Reels";
import crypto from "crypto";
import LoadingComponent from "@/app/_component/LoadingComponent";

export default function ReelsParent() {
  // 현재 인덱스 관리
  const [currentIndex, setCurrentIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(0);
  // 릴스 목록을 받아옴
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
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    // refetchOnWindowFocus: true, // 윈도우 포커스 시 다시 페칭
    // refetchOnMount: true, // 컴포넌트 마운트 시 다시 페칭
  });

  // 전체 비디오 데이터를 평탄화하여 저장
  const allReelsData = useMemo(() => {
    return data?.pages.flat() || [];
  }, [data]);

  // 현재 릴스의 id를 해시로 변경하여 url 변경
  if (allReelsData && allReelsData.length > 0) {
    const hashId = generateMD5Hash(
      allReelsData[currentIndex].postId.toString()
    );
    history.replaceState(null, "", `/reels/${hashId}`);
  }

  // 컴포넌트 마운트시에 로컬 스토리지에 저장된 데이터 가져옴
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedIndex = Number(localStorage.getItem("reelsIndex")) || 0;
      const storedLength = Number(localStorage.getItem("reelsLength")) || 0;
      setCurrentIndex(storedIndex);
      setEndIndex(storedLength);
    }
  }, []);

  // 비디오 데이터의 길이가 변경될 때, 로컬 스토리지에 저장
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

  // 스크롤 핸들러 현재 인덱스를 변경을 줌, 처음, 마지막 인덱스인경우 따로 처리
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

  // 현재 인덱스 변경 시 해시 ID 갱신
  useEffect(() => {
    if (allReelsData && allReelsData.length > 0) {
      const hashId = generateMD5Hash(
        allReelsData[currentIndex].postId.toString()
      );
      history.replaceState(null, "", `/reels/${hashId}`);
    }
  }, [currentIndex, allReelsData]);

  // 해시 함수
  function generateMD5Hash(data: string) {
    return crypto.createHash("md5").update(data).digest("hex");
  }

  // 스크롤 이벤트 등록
  useEffect(() => {
    window.addEventListener("wheel", handleScroll);

    return () => {
      window.removeEventListener("wheel", handleScroll);
    };
  }, [handleScroll]);

  // 데이터 페칭중에는 로딩
  if (isFetching) {
    return <LoadingComponent />;
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
