import React from "react";
import MainSection from "../_component/MainSection";
import styles from "../layout.module.css";
import FollowRecommendSection from "../_component/FollowRecommendSection";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getPostRecommends } from "../_lib/getPostRecommends";
import { getUser } from "../_lib/getUser";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  const queryClient = new QueryClient();
  await queryClient.prefetchInfiniteQuery({
    queryKey: ["posts", "recommends"],
    queryFn: getPostRecommends,
    initialPageParam: 0,
  });

  // const email = session!.user!.email?.toString();
  // await queryClient.prefetchQuery({
  //   queryKey: ["users", email!],
  //   queryFn: getUser,
  // });

  const dehydrateState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydrateState}>
      <div className={styles.mainrootDiv}>
        <MainSection />
        <FollowRecommendSection />
      </div>
    </HydrationBoundary>
  );
}
