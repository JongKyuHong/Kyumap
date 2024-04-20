"use client";

import React, { Fragment, useEffect } from "react";
import styles from "../profile.module.css";
import Link from "next/link";
import {
  useInfiniteQuery,
  InfiniteData,
  useQueryClient,
} from "@tanstack/react-query";
import { Post as IPost } from "@/model/Post";
import { getUserPosts } from "@/app/(afterLogin)/_lib/getUserPosts";
import { useInView } from "react-intersection-observer";
import Post from "@/app/(afterLogin)/_component/Post";

type Props = {
  userId: string;
};

export default function UserPosts({ userId }: Props) {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<
    IPost[],
    Object,
    InfiniteData<IPost[]>,
    [_1: string, _2: string, _3: string],
    number
  >({
    queryKey: ["posts", "users", userId],
    queryFn: getUserPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage.at(-1)?.postId,
    staleTime: 60 * 1000, // fresh -> stale, 5분이라는 기준
    gcTime: 300 * 1000,
  });
  console.log(data, "data");
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(["users", userId]);

  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);

  if (user) {
    return (
      <>
        {data?.pages?.map((page, i) => (
          <Fragment key={i}>
            {page.map((post) => (
              <Post key={post.postId} post={post} />
            ))}
          </Fragment>
        ))}
        <div ref={ref} style={{ height: 50 }} />
      </>
    );
  }
  return null;
}
