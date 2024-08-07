import React from "react";
import MainSection from "../_component/MainSection";
import styles from "../layout.module.css";
import FollowRecommendSection from "../_component/FollowRecommendSection";
import { auth } from "@/auth";
import { Metadata } from "next";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";

export const metadata: Metadata = {
  title: "홈 / Kyumap",
  description: "홈",
};

export default async function Home() {
  const session = await auth();
  const queryClient = new QueryClient();

  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <div className={styles.mainrootDiv}>
      <HydrationBoundary state={dehydratedState}>
        <MainSection session={session} />
      </HydrationBoundary>
      <FollowRecommendSection session={session} />
    </div>
  );
}
