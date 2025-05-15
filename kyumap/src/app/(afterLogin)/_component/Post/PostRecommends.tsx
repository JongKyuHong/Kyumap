"use client";

import { useInfiniteQuery, InfiniteData } from "@tanstack/react-query";
import { getPostRecommends } from "../../_lib/getPostRecommends";
import Post from "@/app/(afterLogin)/_component/Post/Post";
import { IPost } from "@/model/Post";
import { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";

// 추천 포스트를 보여주는 컴포넌트
export default function PostRecommends() {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string],
    string
  >({
    queryKey: ["posts", "recommends"], // 쿼리 키 설정
    queryFn: getPostRecommends, // 데이터 페칭 함수
    initialPageParam: "", // 초기 페이지 파라미터
    getNextPageParam: (lastPage) => {
      const lastPost = lastPage.at(-1);
      return lastPost ? lastPost.createdAt.toString() : undefined;
    }, // 다음 페이지 파라미터 설정
    staleTime: 60 * 1000, // 데이터가 신선함을 유지하는 시간 (1분)
    gcTime: 300 * 1000, // 가비지 컬렉션 시간 (5분)
    refetchOnWindowFocus: true, // 윈도우 포커스 시 다시 페칭
  });

  // useInView 훅을 사용하여 요소가 뷰포트에 들어왔는지 감지
  const { ref, inView } = useInView({
    threshold: 0, // 요소가 뷰포트에 들어오자마자 트리거
    delay: 0, // 지연 시간 없음
  });

  // 요소가 뷰포트에 들어왔을 때 데이터 페칭
  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  return (
    <>
      {data?.pages.map((page, i) => (
        <Fragment key={i}>
          {page.map((post) => (
            <Post key={post.postId} post={post} />
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }}></div>
    </>
  );
}
